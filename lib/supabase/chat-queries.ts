import { createClient } from "@/lib/supabase/client"

export interface Conversation {
  id: string
  user_id: string
  conversation_title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export async function createConversation(userId: string, title: string): Promise<Conversation | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ai_conversations")
    .insert({
      user_id: userId,
      conversation_title: title,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating conversation:", error)
    return null
  }

  return data
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
): Promise<Message | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ai_messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error saving message:", error)
    return null
  }

  // Update conversation timestamp
  await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

  return data
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching conversations:", error)
    return []
  }

  return data || []
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("ai_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching messages:", error)
    return []
  }

  return data || []
}

export async function deleteConversation(conversationId: string): Promise<boolean> {
  const supabase = createClient()

  // Delete messages first
  await supabase.from("ai_messages").delete().eq("conversation_id", conversationId)

  // Delete conversation
  const { error } = await supabase.from("ai_conversations").delete().eq("id", conversationId)

  if (error) {
    console.error("[v0] Error deleting conversation:", error)
    return false
  }

  return true
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from("ai_conversations")
    .update({ conversation_title: title })
    .eq("id", conversationId)

  if (error) {
    console.error("[v0] Error updating conversation title:", error)
    return false
  }

  return true
}
