import { createClient } from "@/lib/supabase/server"
import { streamText } from "ai"

export const runtime = "edge"
export const dynamic = "force-dynamic"

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

    const result = await streamText({
      model: "anthropic/claude-sonnet-4.5",
      system: `You are CroweLogic AI, an expert mycology assistant with 20+ years of professional mushroom cultivation experience from Michael Crowe. 

Your expertise includes:
- Species identification and cultivation techniques
- Contamination detection and remediation
- Substrate preparation and sterilization
- Environmental control (temperature, humidity, FAE)
- Troubleshooting common cultivation issues
- Advanced techniques for gourmet and medicinal mushrooms

Provide practical, actionable advice based on proven cultivation methods. Be specific with measurements, temperatures, and techniques. When discussing contamination, always identify the type and provide immediate remediation steps.`,
      prompt: content,
      // align with other ai SDK calls in this repo
      maxOutputTokens: 1000,
    })

    // Create SSE stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial thinking state
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "status", status: "thinking" })}\n\n`))

        await new Promise((resolve) => setTimeout(resolve, 500))

        // Send streaming state
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "status", status: "streaming" })}\n\n`))

        let fullResponse = ""

        // Stream AI response
        for await (const chunk of result.textStream) {
          fullResponse += chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content", content: chunk })}\n\n`))
        }

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
