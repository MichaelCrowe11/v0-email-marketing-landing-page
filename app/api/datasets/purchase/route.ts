import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { getDatasetById, getDatasetPriceInCents } from "@/lib/datasets"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { datasetId } = await request.json()

    if (!datasetId) {
      return NextResponse.json({ error: "Dataset ID is required" }, { status: 400 })
    }

    const dataset = getDatasetById(datasetId)
    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: dataset.name,
              description: dataset.description,
              metadata: {
                dataset_id: dataset.id,
                sample_count: dataset.sampleCount.toString(),
                category: dataset.category,
              },
            },
            unit_amount: getDatasetPriceInCents(dataset),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/datasets/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/datasets`,
      metadata: {
        user_id: user.id,
        dataset_id: dataset.id,
        type: "dataset_purchase",
      },
      customer_email: user.email,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Dataset purchase error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
