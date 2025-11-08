import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: conversationId } = await params
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role, content } = await request.json()

    // Verify conversation belongs to user
    const { data: conversation, error: convError } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Insert message
    const { data: message, error } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        role,
        content,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving message:", error)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Update conversation updated_at timestamp
    await supabase.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    return NextResponse.json({ message })
  } catch (error) {
    console.error("[v0] Save message API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
