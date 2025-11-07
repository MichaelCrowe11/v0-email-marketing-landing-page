import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const maxDuration = 30

function getModelObject(modelString: string) {
  console.log("[v0] Converting model string to object:", modelString)

  // Crowe Logic Mini (default)
  if (modelString.startsWith("crowelogic/")) {
    return openai("gpt-4o-mini")
  }

  // OpenAI models
  if (modelString.startsWith("openai/")) {
    const modelName = modelString.replace("openai/", "")
    return openai(modelName)
  }

  // Anthropic models
  if (modelString.startsWith("anthropic/")) {
    const modelName = modelString.replace("anthropic/", "")
    return anthropic(modelName)
  }

  // Google models
  if (modelString.startsWith("google/")) {
    const modelName = modelString.replace("google/", "")
    return google(modelName)
  }

  // xAI models (uses OpenAI-compatible endpoint)
  if (modelString.startsWith("xai/")) {
    const modelName = modelString.replace("xai/", "")
    return openai(modelName, {
      baseURL: "https://api.x.ai/v1",
    })
  }

  // Default fallback
  console.log("[v0] Using default model: gpt-4o-mini")
  return openai("gpt-4o-mini")
}

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API called")

    const { messages, model } = await req.json()

    console.log("[v0] Received messages:", messages?.length, "Model:", model)

    if (!messages || messages.length === 0) {
      console.error("[v0] No messages provided")
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get the selected model or use default
    const selectedModel = model || "openai/gpt-4o-mini"
    const modelObject = getModelObject(selectedModel)

    console.log("[v0] Using model:", selectedModel)

    const normalizedMessages = messages.map((msg: any) => {
      const content =
        typeof msg.content === "string" ? msg.content : msg.parts?.map((p: any) => p.text).join("") || msg.text || ""
      return {
        role: msg.role,
        content,
      }
    })

    console.log("[v0] Normalized messages:", normalizedMessages.length)

    const systemPrompt = `You are Crowe Logic AI, an expert deep reasoning scientific research assistant.

Your capabilities:
- Complex multi-step reasoning and analysis
- Scientific research and problem-solving
- Technical explanations and code generation
- Mycological expertise and cultivation guidance
- Mathematical proofs and derivations

Approach:
- Break down complex problems logically
- Show your reasoning process
- Provide actionable insights
- Be clear and precise`

    // Use the AI SDK streamText with the model object
    const result = await streamText({
      model: modelObject,
      system: systemPrompt,
      messages: normalizedMessages,
      temperature: 0.7,
    })

    // Create SSE stream from AI SDK textStream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            // Format as OpenAI-compatible SSE event
            const data = JSON.stringify({
              choices: [{ delta: { content: chunk } }],
            })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        }
      },
    })

    console.log("[v0] Stream initialized successfully")

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Chat error:", error instanceof Error ? error.message : String(error))
    return new Response(
      JSON.stringify({
        error: "Chat request failed",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
