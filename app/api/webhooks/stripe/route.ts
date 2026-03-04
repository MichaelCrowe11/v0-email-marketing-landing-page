import { createClient } from '@/lib/azure/client'
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { sendEmail } from "@/lib/resend"
import { getOrderConfirmationEmailHTML, getLicenseKeyEmailHTML } from "@/lib/email-templates"
import { createLicenseKey } from "@/lib/license-keys"

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
    console.error("[CroweLogic] Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("[CroweLogic] Stripe webhook event:", event.type)

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const customerEmail = session.customer_email || session.customer_details?.email
        const customerName = session.customer_details?.name || "Valued Customer"
        const planId = session.metadata?.plan_id

        if (!customerEmail) {
          console.error("[CroweLogic] No customer email in session")
          break
        }

        // Determine if this is a subscription (has plan_id) or a one-time purchase (book/bundle)
        if (planId && session.subscription) {
          // --- SUBSCRIPTION FLOW (existing) ---
          const { data: user } = await supabase.from("users").select("id").eq("email", customerEmail).single()

          if (!user) {
            console.error("[CroweLogic] User not found for email:", customerEmail)
            break
          }

          await supabase.from("user_subscriptions").insert({
            user_id: user.id,
            plan_id: planId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })

          await supabase
            .from("users")
            .update({
              subscription_tier: planId.includes("expert") ? "expert" : "pro",
              subscription_status: "active",
            })
            .eq("id", user.id)

          const planNames: Record<string, string> = {
            pro: "Pro Access",
            expert: "Expert Access",
            master: "Master Grower",
          }

          try {
            await sendEmail({
              to: customerEmail,
              subject: "Order Confirmation - Crowe Logic",
              html: getOrderConfirmationEmailHTML({
                name: customerName,
                productName: planNames[planId] || planId,
                amount: `$${(session.amount_total! / 100).toFixed(2)}`,
                orderId: session.id,
              }),
            })
            console.log("[CroweLogic] Subscription confirmation email sent")
          } catch (emailError) {
            console.error("[CroweLogic] Failed to send subscription email:", emailError)
          }

          console.log("[CroweLogic] Subscription created for user:", user.id)
        } else {
          // --- ONE-TIME PURCHASE FLOW (book/bundle via Payment Link) ---
          let productName = session.metadata?.product_name || ""
          const amount = session.amount_total || 0

          // Fetch actual product name from line items if not in metadata
          if (!productName) {
            try {
              const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
              productName = lineItems.data[0]?.description || "The Mushroom Grower Bundle"
            } catch {
              productName = "The Mushroom Grower Bundle"
            }
          }

          console.log("[CroweLogic] One-time purchase:", productName, "by", customerEmail)
          console.log("[CONVERSION]", {
            timestamp: new Date().toISOString(),
            source: "stripe",
            email: customerEmail,
            product: productName,
            amount: `$${(amount / 100).toFixed(2)}`,
          })

          try {
            const licenseKey = await createLicenseKey({
              email: customerEmail,
              productName,
              stripeSessionId: session.id,
              amount: amount / 100,
            })

            await sendEmail({
              to: customerEmail,
              subject: "Your License Key — The Mushroom Grower",
              html: getLicenseKeyEmailHTML({
                name: customerName,
                licenseKey,
                productName,
                amount: `$${(amount / 100).toFixed(2)}`,
              }),
            })
            console.log("[CroweLogic] License key email sent:", licenseKey)
          } catch (licenseError) {
            console.error("[CroweLogic] License key generation/email failed:", licenseError)
            // Still send a basic confirmation even if license fails
            try {
              await sendEmail({
                to: customerEmail,
                subject: "Order Confirmed — The Mushroom Grower",
                html: getOrderConfirmationEmailHTML({
                  name: customerName,
                  productName,
                  amount: `$${(amount / 100).toFixed(2)}`,
                  orderId: session.id,
                }),
              })
            } catch (fallbackError) {
              console.error("[CroweLogic] Even fallback email failed:", fallbackError)
            }
          }
        }

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

        console.log("[CroweLogic] Subscription updated:", subscription.id)
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

        // Update user status
        const { data: userSub } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single()

        if (userSub) {
          await supabase
            .from("users")
            .update({
              subscription_tier: "free",
              subscription_status: "canceled",
            })
            .eq("id", userSub.user_id)
        }

        console.log("[CroweLogic] Subscription canceled:", subscription.id)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        try {
          if (invoice.customer_email) {
            await sendEmail({
              to: invoice.customer_email,
              subject: "Payment Receipt - Crowe Logic",
              html: getOrderConfirmationEmailHTML({
                name: invoice.customer_name || "Valued Customer",
                productName: "Subscription Payment",
                amount: `$${(invoice.amount_paid / 100).toFixed(2)}`,
                orderId: invoice.id,
              }),
            })
            console.log("[CroweLogic] Payment receipt email sent")
          }
        } catch (emailError) {
          console.error("[CroweLogic] Failed to send payment receipt email:", emailError)
        }

        console.log("[CroweLogic] Payment succeeded for invoice:", invoice.id)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice

        // Update subscription status to past_due
        if (invoice.subscription) {
          await supabase
            .from("user_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription as string)
        }

        console.log("[CroweLogic] Payment failed for invoice:", invoice.id)
        break
      }

      default:
        console.log("[CroweLogic] Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[CroweLogic] Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
