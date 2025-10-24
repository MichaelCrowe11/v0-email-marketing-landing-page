import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")!

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

        let userId: string | null = null

        // Try to get user_id from metadata first
        if (session.metadata?.user_id) {
          userId = session.metadata.user_id
        } else if (session.customer_email) {
          // Fallback to email lookup
          const { data: user } = await supabase.from("users").select("id").eq("email", session.customer_email).single()
          userId = user?.id || null
        }

        if (!userId) {
          console.error("[v0] User not found for session:", session.id)
          break
        }

        const planId = session.metadata?.plan_id
        if (!planId) {
          console.error("[v0] No plan_id in session metadata")
          break
        }

        const periodEnd = session.subscription
          ? await stripe.subscriptions
              .retrieve(session.subscription as string)
              .then((sub) => new Date(sub.current_period_end * 1000).toISOString())
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        await supabase.from("user_subscriptions").insert({
          user_id: userId,
          plan_id: planId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd,
        })

        await supabase
          .from("users")
          .update({
            subscription_tier: planId.includes("expert") ? "expert" : "pro",
            subscription_status: "active",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_expires_at: periodEnd,
          })
          .eq("id", userId)

        console.log("[v0] Subscription created for user:", userId)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from("user_subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("stripe_subscription_id", subscription.id)

        // Update user's subscription expiry
        const { data: userSub } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single()

        if (userSub) {
          await supabase
            .from("users")
            .update({
              subscription_status: subscription.status,
              subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("id", userSub.user_id)
        }

        console.log("[v0] Subscription updated:", subscription.id)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        const canceledAt = new Date().toISOString()

        await supabase
          .from("user_subscriptions")
          .update({
            status: "canceled",
            cancel_at_period_end: false,
          })
          .eq("stripe_subscription_id", subscription.id)

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
              subscription_expires_at: canceledAt,
            })
            .eq("id", userSub.user_id)
        }

        console.log("[v0] Subscription canceled:", subscription.id)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)

          await supabase
            .from("user_subscriptions")
            .update({
              status: "active",
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_subscription_id", invoice.subscription as string)
        }

        console.log("[v0] Payment succeeded for invoice:", invoice.id)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          await supabase
            .from("user_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription as string)

          const { data: userSub } = await supabase
            .from("user_subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", invoice.subscription as string)
            .single()

          if (userSub) {
            await supabase.from("users").update({ subscription_status: "past_due" }).eq("id", userSub.user_id)
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
