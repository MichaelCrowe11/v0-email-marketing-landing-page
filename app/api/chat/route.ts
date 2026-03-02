import { getCroweLMModel, CROWELM_SYSTEM_PROMPT } from "@/lib/crowelm"
import { getRAGContext } from "@/lib/rag"
import { validateLicenseFromHeader } from "@/lib/license"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    // Verify license before processing
    const cookieHeader = req.headers.get("cookie")
    if (!validateLicenseFromHeader(cookieHeader)) {
      return new Response(
        JSON.stringify({ error: "License required", code: "LICENSE_REQUIRED" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      )
    }

    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const normalizedMessages = messages.map((msg: any) => {
      const content =
        typeof msg.content === "string"
          ? msg.content
          : msg.parts?.map((p: any) => p.text).join("") || msg.text || ""
      return { role: msg.role, content }
    })

    // Get the latest user message for RAG query
    const lastUserMessage = [...normalizedMessages].reverse().find((m: any) => m.role === "user")
    const userQuery = lastUserMessage?.content || ""

    // Fetch RAG context from Pinecone
    let ragContext = ""
    if (userQuery) {
      try {
        ragContext = await getRAGContext(userQuery, 5)
      } catch (e) {
        console.error("[CroweLM] RAG error:", e)
      }
    }

    // Build system message with RAG context
    const systemContent = ragContext
      ? `${CROWELM_SYSTEM_PROMPT}\n\n${ragContext}`
      : CROWELM_SYSTEM_PROMPT

    const systemMessage = { role: "system" as const, content: systemContent }

    // Use the configured AI provider (Kimi K2.5 via OpenAI-compatible API)
    const AI_BASE_URL = process.env.AI_BASE_URL || "https://api.moonshot.cn/v1"
    const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || ""
    const AI_MODEL_ID = process.env.AI_MODEL_ID || "kimi-k2.5"

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000)

    let response
    try {
      response = await fetch(`${AI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_MODEL_ID,
          messages: [systemMessage, ...normalizedMessages],
          temperature: 0.7,
          max_tokens: 4000,
          stream: true,
        }),
        signal: controller.signal,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("[CroweLM] Fetch error:", fetchError)
      throw new Error(
        `Failed to connect to AI provider: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}`
      )
    }

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
      console.error("[CroweLM] API error:", response.status, errorData)
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`)
    }

    // Stream the response back (OpenAI-compatible SSE format)
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[CroweLM] Chat error:", error instanceof Error ? error.message : String(error))
    return new Response(
      JSON.stringify({
        error: "Chat request failed",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
