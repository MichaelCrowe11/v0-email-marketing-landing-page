import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/resend"
import {
  getOrderConfirmationEmailHTML,
  getPaymentReceiptEmailHTML,
  getSubscriptionStatusEmailHTML,
  getConsultationConfirmationEmailHTML,
} from "@/lib/email-templates"

export const dynamic = "force-dynamic"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("[v0] Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("[v0] Stripe webhook event:", event.type)

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Get user by email
        const { data: user } = await supabase.from("users").select("id, username").eq("email", session.customer_email).single()

        if (!user) {
          console.error("[v0] User not found for email:", session.customer_email)
          break
        }

        // Check if this is a consultation booking
        const serviceType = session.metadata?.service_type
        const consultationType = session.metadata?.consultation_type

        if (serviceType === "consultation" && consultationType) {
          // Handle consultation booking
          const consultationNames: Record<string, { name: string; duration: string }> = {
            "1hr": { name: "1-Hour Consultation", duration: "1 hour" },
            "3hr": { name: "3-Hour Deep Dive", duration: "3 hours" },
            fullday: { name: "Full-Day Consultation", duration: "8 hours" },
            retainer: { name: "Monthly Retainer", duration: "Ongoing" },
          }

          const consultationInfo = consultationNames[consultationType] || {
            name: "Consultation",
            duration: "TBD",
          }

          try {
            await sendEmail({
              to: session.customer_email!,
              subject: "Consultation Confirmed - Crowe Logic",
              html: getConsultationConfirmationEmailHTML({
                name: session.customer_details?.name || (user as any).username || "Valued Customer",
                consultationType: consultationInfo.name,
                duration: consultationInfo.duration,
                amount: `$${(session.amount_total! / 100).toFixed(2)}`,
                bookingId: session.id,
              }),
            })

            // Also send notification to Michael
            await sendEmail({
              to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Michael@CroweLogic.com",
              subject: `New ${consultationInfo.name} Booking`,
              html: `
                <h2>New Consultation Booking</h2>
                <p><strong>Customer:</strong> ${session.customer_details?.name || (user as any).username}</p>
                <p><strong>Email:</strong> ${session.customer_email}</p>
                <p><strong>Type:</strong> ${consultationInfo.name}</p>
                <p><strong>Duration:</strong> ${consultationInfo.duration}</p>
                <p><strong>Amount:</strong> $${(session.amount_total! / 100).toFixed(2)}</p>
                <p><strong>Booking ID:</strong> ${session.id}</p>
                <p>Please reach out to schedule the consultation.</p>
              `,
            })

            console.log("[v0] Consultation confirmation emails sent")
          } catch (emailError) {
            console.error("[v0] Failed to send consultation confirmation email:", emailError)
          }

          break
        }

        // Get plan details from metadata for subscription purchases
        const planId = session.metadata?.plan_id

        if (!planId) {
          console.error("[v0] No plan_id in session metadata")
          break
        }

        // Create subscription record
        await supabase.from("user_subscriptions").insert({
          user_id: user.id,
          plan_id: planId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })

        // Update user subscription status
        await supabase
          .from("users")
          .update({
            subscription_tier: planId.includes("expert") ? "expert" : "pro",
            subscription_status: "active",
          })
          .eq("id", user.id)

        try {
          const planNames: Record<string, string> = {
            pro: "Pro Access",
            expert: "Expert Access",
            master: "Master Grower",
          }

          await sendEmail({
            to: session.customer_email!,
            subject: "Order Confirmation - Crowe Logic",
            html: getOrderConfirmationEmailHTML({
              name: session.customer_details?.name || (user as any).username || "Valued Customer",
              productName: planNames[planId] || planId,
              amount: `$${(session.amount_total! / 100).toFixed(2)}`,
              orderId: session.id,
            }),
          })
          console.log("[v0] Order confirmation email sent")
        } catch (emailError) {
          console.error("[v0] Failed to send order confirmation email:", emailError)
        }

        console.log("[v0] Subscription created for user:", user.id)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from("user_subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)

        console.log("[v0] Subscription updated:", subscription.id)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status
        await supabase
          .from("user_subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)

        // Get user info for email
        const { data: userSub } = await supabase
          .from("user_subscriptions")
          .select("user_id, plan_id, users(email, username)")
          .eq("stripe_subscription_id", subscription.id)
          .single()

        if (userSub) {
          // Update user status
          await supabase
            .from("users")
            .update({
              subscription_tier: "free",
              subscription_status: "canceled",
            })
            .eq("id", userSub.user_id)

          // Send cancellation email
          try {
            const userData = userSub.users as any
            if (userData?.email) {
              const planNames: Record<string, string> = {
                pro: "Pro",
                expert: "Expert",
                master: "Master Grower",
              }

              await sendEmail({
                to: userData.email,
                subject: "Subscription Cancelled - Crowe Logic",
                html: getSubscriptionStatusEmailHTML({
                  name: userData.username || "Valued Customer",
                  status: "cancelled",
                  planName: planNames[userSub.plan_id] || userSub.plan_id,
                }),
              })
              console.log("[v0] Subscription cancellation email sent")
            }
          } catch (emailError) {
            console.error("[v0] Failed to send cancellation email:", emailError)
          }
        }

        console.log("[v0] Subscription canceled:", subscription.id)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        try {
          if (invoice.customer_email) {
            // Build line items from invoice
            const items = invoice.lines?.data.map((line) => ({
              description: line.description || "Subscription",
              amount: `$${((line.amount || 0) / 100).toFixed(2)}`,
            })) || [{ description: "Subscription Payment", amount: `$${(invoice.amount_paid / 100).toFixed(2)}` }]

            await sendEmail({
              to: invoice.customer_email,
              subject: "Payment Receipt - Crowe Logic",
              html: getPaymentReceiptEmailHTML({
                name: (invoice.customer_name as string) || "Valued Customer",
                receiptNumber: invoice.number || invoice.id,
                date: new Date(invoice.created * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
                items,
                subtotal: `$${((invoice.subtotal || 0) / 100).toFixed(2)}`,
                tax: (invoice as any).tax ? `$${((invoice as any).tax / 100).toFixed(2)}` : undefined,
                total: `$${(invoice.amount_paid / 100).toFixed(2)}`,
                paymentMethod: "Card ending in ****",
              }),
            })
            console.log("[v0] Payment receipt email sent")
          }
        } catch (emailError) {
          console.error("[v0] Failed to send payment receipt email:", emailError)
        }

        console.log("[v0] Payment succeeded for invoice:", invoice.id)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = typeof (invoice as any).subscription === "string" ? (invoice as any).subscription : (invoice as any).subscription?.id

        // Update subscription status to past_due
        if (subscriptionId) {
          await supabase
            .from("user_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", subscriptionId)

          // Get user info for email
          const { data: userSub } = await supabase
            .from("user_subscriptions")
            .select("user_id, plan_id, users(email, username)")
            .eq("stripe_subscription_id", subscriptionId)
            .single()

          if (userSub) {
            // Send payment failed email
            try {
              const userData = userSub.users as any
              if (userData?.email) {
                const planNames: Record<string, string> = {
                  pro: "Pro",
                  expert: "Expert",
                  master: "Master Grower",
                }

                await sendEmail({
                  to: userData.email,
                  subject: "Payment Failed - Action Required",
                  html: getSubscriptionStatusEmailHTML({
                    name: userData.username || "Valued Customer",
                    status: "payment_failed",
                    planName: planNames[userSub.plan_id] || userSub.plan_id,
                    reason: "We were unable to process your payment. Please update your payment method.",
                  }),
                })
                console.log("[v0] Payment failed email sent")
              }
            } catch (emailError) {
              console.error("[v0] Failed to send payment failed email:", emailError)
            }
          }
        }

        console.log("[v0] Payment failed for invoice:", invoice.id)
        break
      }

      default:
        console.log("[v0] Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
