"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

/**
 * Report usage to Stripe for metered billing
 * This is used for usage-based pricing on top of subscriptions
 */
export async function reportStripeUsage(quantity: number, action = "increment"): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  // Get user's subscription
  const { data: userData } = await supabase.from("users").select("stripe_subscription_id").eq("id", user.id).single()

  if (!userData?.stripe_subscription_id) return

  try {
    // Get subscription items
    const subscription = await stripe.subscriptions.retrieve(userData.stripe_subscription_id)

    // Find the metered item (if exists)
    const meteredItem = subscription.items.data.find((item) => item.price.recurring?.usage_type === "metered")

    if (meteredItem) {
      // Report usage to Stripe
      await stripe.subscriptionItems.createUsageRecord(meteredItem.id, {
        quantity,
        action: action as "increment" | "set",
        timestamp: Math.floor(Date.now() / 1000),
      })

      console.log(`[v0] Reported ${quantity} usage to Stripe for user ${user.id}`)
    }
  } catch (error) {
    console.error("[v0] Error reporting usage to Stripe:", error)
  }
}

/**
 * Create a metered subscription item for usage-based billing
 */
export async function addMeteredBilling(subscriptionId: string, priceId: string): Promise<void> {
  try {
    await stripe.subscriptionItems.create({
      subscription: subscriptionId,
      price: priceId,
    })

    console.log(`[v0] Added metered billing to subscription ${subscriptionId}`)
  } catch (error) {
    console.error("[v0] Error adding metered billing:", error)
  }
}

/**
 * Get usage summary from Stripe
 */
export async function getStripeUsageSummary(subscriptionItemId: string) {
  try {
    const usageRecords = await stripe.subscriptionItems.listUsageRecordSummaries(subscriptionItemId, { limit: 100 })

    return usageRecords.data
  } catch (error) {
    console.error("[v0] Error fetching Stripe usage:", error)
    return []
  }
}
