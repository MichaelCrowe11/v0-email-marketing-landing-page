import { createClient } from "@/lib/supabase/server"

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

    // Create SSE stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Send initial thinking state
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "status", status: "thinking" })}\n\n`))

        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Send streaming state
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "status", status: "streaming" })}\n\n`))

        // Simulate AI response generation with streaming
        const aiResponse = generateAIResponse(content)
        const words = aiResponse.split(" ")

        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + " "
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content", content: chunk })}\n\n`))
          await new Promise((resolve) => setTimeout(resolve, 50))
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
            content: aiResponse,
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

function generateAIResponse(content: string): string {
  // This is a placeholder - in production, integrate with AI SDK
  const lowerContent = content.toLowerCase()

  if (lowerContent.includes("contamination")) {
    return "Based on Michael Crowe's 20+ years of experience, contamination is often caused by inadequate sterilization or poor air quality. I recommend checking your pressure cooker reaches 15 PSI for at least 90 minutes, and ensure your workspace has proper HEPA filtration. What specific contamination are you seeing - green mold (Trichoderma), black mold (Aspergillus), or bacterial slime?"
  }

  if (lowerContent.includes("substrate")) {
    return "For substrate preparation, Michael Crowe recommends a moisture content of 60-65% - the 'field capacity' test where a handful squeezed releases only a few drops. The master's mix (50% hardwood sawdust, 50% soy hulls) works excellently for oysters and lion's mane. What species are you growing?"
  }

  if (lowerContent.includes("temperature") || lowerContent.includes("humidity")) {
    return "Environmental control is crucial for success. Most gourmet species fruit best at 55-65°F with 85-95% humidity. Michael Crowe's pro tip: use an ultrasonic humidifier with a hygrometer controller, and maintain fresh air exchange of 4-6 times per hour. Are you seeing any specific issues with your current setup?"
  }

  return "Great question! Based on Michael Crowe's cultivation expertise, I'd recommend starting with the fundamentals: proper sterilization, maintaining optimal environmental conditions, and careful observation of your mycelium's health. Could you provide more details about your specific situation so I can give you more targeted advice?"
}
