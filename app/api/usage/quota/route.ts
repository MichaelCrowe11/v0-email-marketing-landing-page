import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create usage quota
    let { data: quota } = await supabase.from("usage_quotas").select("*").eq("user_id", user.id).single()

    if (!quota) {
      const { data: newQuota } = await supabase
        .from("usage_quotas")
        .insert({
          user_id: user.id,
          chat_messages_quota: 10,
          chat_messages_used: 0,
          subscription_tier: "free",
        })
        .select()
        .single()
      quota = newQuota
    }

    const remaining = (quota.chat_messages_quota || 10) - (quota.chat_messages_used || 0)

    return NextResponse.json({
      used: quota.chat_messages_used || 0,
      remaining: Math.max(0, remaining),
      quota: quota.chat_messages_quota || 10,
    })
  } catch (error) {
    console.error("[v0] Quota fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch quota" }, { status: 500 })
  }
}
