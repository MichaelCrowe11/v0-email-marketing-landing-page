"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { config } from "@/lib/config"

const PLAN_PRICES = {
  pro: {
    monthly: 9700, // $97.00 in cents
    yearly: 99700, // $997.00 in cents
  },
  expert: {
    monthly: 19700, // $197.00 in cents
    yearly: 199700, // $1997.00 in cents
  },
}

export async function startSubscriptionCheckout(planId: string, billingCycle: "monthly" | "yearly") {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to subscribe")
  }

  // Validate plan
  if (!["pro", "expert"].includes(planId)) {
    throw new Error("Invalid plan selected")
  }

  const priceInCents = PLAN_PRICES[planId as "pro" | "expert"][billingCycle]
  const planName = planId === "pro" ? "Pro Access" : "Expert Access"

  // Create or retrieve Stripe customer
  let customerId: string

  const { data: userData } = await supabase.from("users").select("stripe_customer_id").eq("id", user.id).single()

  if (userData?.stripe_customer_id) {
    customerId = userData.stripe_customer_id
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    })
    customerId = customer.id

    // Save customer ID to database
    await supabase.from("users").update({ stripe_customer_id: customerId }).eq("id", user.id)
  }

  // Create checkout session for subscription
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${planName} - ${billingCycle === "monthly" ? "Monthly" : "Yearly"}`,
            description: `Access to Crowe Logic AI platform with 20 years of mycology expertise`,
          },
          unit_amount: priceInCents,
          recurring: {
            interval: billingCycle === "monthly" ? "month" : "year",
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    return_url: `${config.site.url}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      user_id: user.id,
      plan_id: planId,
      billing_cycle: billingCycle,
    },
  })

  return session.client_secret!
}
