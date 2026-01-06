import { createClient } from '@/lib/azure/client'
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch conversations for the user
    const { data: conversations, error } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching conversations:", error)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("[v0] Conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title } = await request.json()

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from("ai_conversations")
      .insert({
        user_id: user.id,
        conversation_title: title || "New Conversation",
        project_id: null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating conversation:", error)
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("[v0] Create conversation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
