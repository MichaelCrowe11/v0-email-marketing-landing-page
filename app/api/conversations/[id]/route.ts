import { createClient } from '@/lib/azure/client'
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch conversation with messages
    const { data: conversation, error: convError } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (convError) {
      console.error("[v0] Error fetching conversation:", convError)
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Fetch messages for this conversation
    const { data: messages, error: msgError } = await supabase
      .from("ai_messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })

    if (msgError) {
      console.error("[v0] Error fetching messages:", msgError)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json({ conversation, messages })
  } catch (error) {
    console.error("[v0] Get conversation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete conversation (messages will be cascade deleted if FK is set up)
    const { error } = await supabase.from("ai_conversations").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error deleting conversation:", error)
      return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete conversation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
