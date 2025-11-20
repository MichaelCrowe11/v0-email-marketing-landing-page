import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all active AI model subscriptions for the user
    const { data: subscriptions, error } = await supabase
      .from("ai_model_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")

    if (error) {
      throw error
    }

    return NextResponse.json({ subscriptions: subscriptions || [] })
  } catch (error: any) {
    console.error("AI model keys fetch error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// Regenerate API key
export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate new API key
    const newApiKey = "sk_" + crypto.randomUUID().replace(/-/g, "")

    // Update subscription with new API key
    const { data, error } = await supabase
      .from("ai_model_subscriptions")
      .update({ api_key: newApiKey, updated_at: new Date().toISOString() })
      .eq("id", subscriptionId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ subscription: data })
  } catch (error: any) {
    console.error("API key regeneration error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
