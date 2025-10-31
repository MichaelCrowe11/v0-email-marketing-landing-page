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

    const normalizedMessages = messages.map((msg: any) => {
      const content =
        typeof msg.content === "string" ? msg.content : msg.parts?.map((p: any) => p.text).join("") || msg.text || ""
      return {
        role: msg.role,
        content,
      }
    })

    console.log("[v0] Normalized messages:", normalizedMessages.length)

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

    // Use Azure OpenAI if configured, otherwise fallback to OpenAI
    const useAzure = process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY
    
    const apiUrl = useAzure
      ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`
      : "https://api.openai.com/v1/chat/completions"
    
    const headers = useAzure
      ? {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY!,
        }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: useAzure ? undefined : "gpt-4o-mini", // Azure uses deployment name in URL
        messages: [systemMessage, ...normalizedMessages],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenAI API error:", errorData)
      throw new Error(errorData.error?.message || "OpenAI API request failed")
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
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
