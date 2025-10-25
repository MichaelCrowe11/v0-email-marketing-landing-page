import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

export const runtime = "edge"
export const dynamic = "force-dynamic"

const openai = new OpenAI({
  apiKey: process.env.AZURE_AI_API_KEY || "",
  baseURL: process.env.AZURE_AI_ENDPOINT || "",
  defaultQuery: { "api-version": "2024-05-01-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_AI_API_KEY || "" },
})

// Your Azure AI Assistant - Agent874
const ASSISTANT_ID = "asst_7ycbM8XLx9HjiBfvI0tGdhtz"

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(userId)

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60000 }) // 1 minute window
    return true
  }

  if (limit.count >= 10) {
    // 10 requests per minute
    return false
  }

  limit.count++
  return true
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return new Response("Rate limit exceeded", { status: 429 })
    }

    const { postId, replyId, content } = await request.json()

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial thinking state
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "status", status: "thinking" })}\n\n`))

          // Create a thread
          const thread = await openai.beta.threads.create()

          // Add user message to thread
          await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: content,
          })

          // Send streaming state
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "status", status: "streaming" })}\n\n`))

          // Run the assistant with streaming
          const run = openai.beta.threads.runs.stream(thread.id, {
            assistant_id: ASSISTANT_ID,
          })

          let fullResponse = ""

          // Handle streaming events
          run.on("textDelta", (textDelta) => {
            const chunk = textDelta.value || ""
            fullResponse += chunk
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content", content: chunk })}\n\n`))
          })

          // Wait for completion
          await run.finalRun()

          // Send completion state
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "status", status: "done" })}\n\n`))

          // Save AI reply to database
          const { data: aiReply } = await supabase
            .from("forum_replies")
            .insert({
              post_id: postId,
              parent_reply_id: replyId || null,
              author_id: "ai-crowe-logic", // Special AI user ID
              content: fullResponse,
            })
            .select()
            .single()

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "complete", replyId: aiReply?.id })}\n\n`))

          controller.close()
        } catch (error) {
          console.error("[v0] Assistant API error:", error)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error: "Failed to get response" })}\n\n`),
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] AI stream error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
