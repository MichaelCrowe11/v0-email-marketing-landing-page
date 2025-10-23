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

    if (!endpoint || !apiKey) {
      return new Response(JSON.stringify({ error: "Azure AI credentials not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Call Azure AI agent
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

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Azure AI error:", error)
      return new Response(JSON.stringify({ error: "Failed to get response from Azure AI" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
