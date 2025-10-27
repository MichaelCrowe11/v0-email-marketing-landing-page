import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"

export const maxDuration = 30

function getModel(modelString: string) {
  console.log("[v0] Getting model for:", modelString)

  // Crowe Logic Mini (default)
  if (modelString.startsWith("crowelogic/")) {
    return openai("gpt-4o-mini") // Fallback to GPT-4o-mini until RunPod is configured
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

  // xAI models
  if (modelString.startsWith("xai/")) {
    const modelName = modelString.replace("xai/", "")
    return openai(modelName)
  }

  // Default fallback
  return openai("gpt-4o-mini")
}

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    console.log("[v0] Chat request:", {
      messageCount: messages?.length,
      model,
      lastMessage: messages?.[messages.length - 1]?.content?.substring(0, 50),
    })

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const selectedModel = model || "openai/gpt-4o-mini"
    const aiModel = getModel(selectedModel)

    const systemMessage = {
      role: "system" as const,
      content: `You are Crowe Logic AI, an expert deep reasoning scientific research assistant.

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
- Be clear and precise`,
    }

    console.log("[v0] Starting AI stream...")

    const result = streamText({
      model: aiModel,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxTokens: 2000,
    })

    console.log("[v0] Returning stream response")
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
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
