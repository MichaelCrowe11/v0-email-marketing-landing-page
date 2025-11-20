import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { getAIModelById, getAIModelPriceInCents } from "@/lib/ai-models-marketplace"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { modelId } = await request.json()

    if (!modelId) {
      return NextResponse.json({ error: "Model ID is required" }, { status: 400 })
    }

    const model = getAIModelById(modelId)
    if (!model) {
      return NextResponse.json({ error: "AI model not found" }, { status: 404 })
    }

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has active subscription for this model
    const { data: existingSub } = await supabase
      .from("ai_model_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("model_id", modelId)
      .eq("status", "active")
      .single()

    if (existingSub) {
      return NextResponse.json(
        { error: "You already have an active subscription for this model" },
        { status: 400 }
      )
    }

    // Create or retrieve Stripe customer
    let customerId: string
    const { data: existingPurchase } = await supabase
      .from("dataset_purchases")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .not("stripe_customer_id", "is", null)
      .limit(1)
      .single()

    if (existingPurchase?.stripe_customer_id) {
      customerId = existingPurchase.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id
    }

    // Create Stripe Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: model.name,
              description: model.description,
              metadata: {
                model_id: model.id,
                category: model.category,
                model_type: model.modelType,
              },
            },
            unit_amount: getAIModelPriceInCents(model),
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ai-models/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ai-models`,
      customer: customerId,
      metadata: {
        user_id: user.id,
        model_id: model.id,
        type: "ai_model_subscription",
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("AI model subscription error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
