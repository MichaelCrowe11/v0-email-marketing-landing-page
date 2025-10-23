import type { NextRequest } from "next/server"

export const runtime = "edge"

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const endpoint = process.env.AZURE_AI_ENDPOINT
    const apiKey = process.env.AZURE_AI_API_KEY

    console.log("[v0] Azure AI endpoint:", endpoint ? "configured" : "missing")
    console.log("[v0] Azure AI key:", apiKey ? "configured" : "missing")

    if (!endpoint || !apiKey) {
      return new Response(JSON.stringify({ error: "Azure AI credentials not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    })

    console.log("[v0] Azure AI response status:", response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Azure AI error:", error)
      return new Response(JSON.stringify({ error: `Azure AI error: ${error}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"))
              controller.close()
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            // Forward the SSE chunks directly
            controller.enqueue(encoder.encode(chunk))
          }
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
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
    console.error("[v0] Chat API error:", error)
    return new Response(JSON.stringify({ error: `Internal server error: ${error}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
