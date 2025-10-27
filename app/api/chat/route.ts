import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"
import { calculateCost } from "@/lib/ai-models"
import { canAccessAzureAI } from "@/lib/subscription"

export const maxDuration = 30

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_GATEWAY_API_KEY ? "https://gateway.ai.cloudflare.com/v1" : undefined,
})

const anthropic = createAnthropic({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.ANTHROPIC_API_KEY,
})

const google = createGoogleGenerativeAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.GOOGLE_API_KEY,
})

function validateEnv() {
  const errors: string[] = []
  const warnings: string[] = []

  // Azure AI is optional - only needed for custom assistant
  if (!process.env.AZURE_AI_API_KEY || !process.env.AZURE_AI_ENDPOINT) {
    warnings.push("Azure AI not configured - custom assistant unavailable")
  }

  if (!process.env.RUNPOD_API_KEY || !process.env.RUNPOD_ENDPOINT) {
    warnings.push("RunPod not configured - Crowe Logic Mini unavailable")
  }

  // AI Gateway is optional - falls back to direct OpenAI
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.OPENAI_API_KEY) {
    errors.push("No AI provider configured - need either AI_GATEWAY_API_KEY or OPENAI_API_KEY")
  }

  if (errors.length > 0) {
    console.error("[v0] Environment validation failed:", errors)
    return { valid: false, errors, warnings }
  }

  if (warnings.length > 0) {
    console.warn("[v0] Environment warnings:", warnings)
  }

  return { valid: true, errors: [], warnings }
}

const envCheck = validateEnv()

const azureOpenAI =
  process.env.AZURE_AI_API_KEY && process.env.AZURE_AI_ENDPOINT
    ? new OpenAI({
        apiKey: process.env.AZURE_AI_API_KEY,
        baseURL: process.env.AZURE_AI_ENDPOINT,
        defaultQuery: { "api-version": "2024-05-01-preview" },
        defaultHeaders: { "api-key": process.env.AZURE_AI_API_KEY },
      })
    : null

const runpodClient =
  process.env.RUNPOD_API_KEY && process.env.RUNPOD_ENDPOINT
    ? new OpenAI({
        apiKey: process.env.RUNPOD_API_KEY,
        baseURL: process.env.RUNPOD_ENDPOINT,
      })
    : null

const AZURE_ASSISTANT_ID = "asst_7ycbM8XLx9HjiBfvI0tGdhtz"

function getAIModel(modelString: string) {
  console.log("[v0] Getting AI model for:", modelString)

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
    return openai(modelName, { baseURL: "https://api.x.ai/v1" })
  }

  // Default to OpenAI
  return openai("gpt-4o-mini")
}

export async function POST(req: Request) {
  console.log("[v0] Chat API route called")

  try {
    const { messages, model } = await req.json()

    console.log("[v0] Request body:", { messagesCount: messages?.length, model })

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check environment configuration
    if (!envCheck.valid) {
      console.error("[v0] Environment validation failed:", envCheck.errors)

      const errorMessage = `⚠️ **AI Service Configuration Required**\n\nThe chat service needs to be configured with API credentials.\n\n**Missing:**\n${envCheck.errors.map((err) => `• ${err}`).join("\n")}\n\n**To fix this:**\nAdd your API keys to the Vercel environment variables.\n\nSee the Vars section in the sidebar to configure.`

      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(errorMessage)}\n`))
          controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
          controller.close()
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Vercel-AI-Data-Stream": "v1",
        },
      })
    }

    console.log("[v0] Received messages:", messages?.length || 0)
    console.log("[v0] Selected model:", model)

    const selectedModel = model || "crowelogic/mini"
    console.log("[v0] Using model:", selectedModel)

    if (selectedModel.startsWith("crowelogic/")) {
      console.log("[v0] Using Crowe Logic Mini (RunPod)")

      if (!runpodClient) {
        throw new Error("RunPod not configured. Please add RUNPOD_API_KEY and RUNPOD_ENDPOINT.")
      }

      const systemMessage = {
        role: "system" as const,
        content: `You are Crowe Logic Mini, a deep reasoning scientific research assistant.

Your capabilities:
- Complex multi-step reasoning and analysis
- Scientific research and literature synthesis
- Technical problem-solving and debugging
- Mathematical proofs and derivations
- Experimental design and methodology
- Data analysis and interpretation

Approach:
- Break down complex problems into logical steps
- Show your reasoning process clearly
- Cite relevant principles and theories
- Provide actionable insights and recommendations
- Acknowledge uncertainty when appropriate

You represent cutting-edge AI reasoning capabilities in a compact, efficient model.`,
      }

      const completion = await runpodClient.chat.completions.create({
        model: "crowe-logic-mini",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      })

      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content
              if (content) {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`))
              }
            }
            controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
            controller.close()
          } catch (error) {
            console.error("[v0] RunPod stream error:", error)
            controller.error(error)
          }
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Vercel-AI-Data-Stream": "v1",
        },
      })
    }

    if (selectedModel.startsWith("azure/")) {
      const hasAzureAccess = await canAccessAzureAI()

      if (!hasAzureAccess) {
        const errorMessage = `⚠️ **Premium Feature Required**\n\nThe Crowe Logic Custom Assistant is available for Expert and Master tier subscribers only.\n\n**To access this feature:**\n• Upgrade to Expert or Master tier\n• Enjoy unlimited access to your custom AI assistant trained on cultivation data\n\nIn the meantime, you can use our other powerful AI models like GPT-4o, Claude, and Gemini.`

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`0:${JSON.stringify(errorMessage)}\n`))
            controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
            controller.close()
          },
        })

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Vercel-AI-Data-Stream": "v1",
          },
        })
      }

      console.log("[v0] Using Azure AI Assistant")

      if (!azureOpenAI) {
        throw new Error("Azure AI not configured. Please add AZURE_AI_API_KEY and AZURE_AI_ENDPOINT.")
      }

      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const lastMessage = messages[messages.length - 1]
            const userContent = lastMessage?.content || ""

            console.log("[v0] Creating Azure thread for message:", userContent.substring(0, 100))

            const thread = await azureOpenAI.beta.threads.create()
            console.log("[v0] Thread created:", thread.id)

            await azureOpenAI.beta.threads.messages.create(thread.id, {
              role: "user",
              content: userContent,
            })
            console.log("[v0] Message added to thread")

            const run = azureOpenAI.beta.threads.runs.stream(thread.id, {
              assistant_id: AZURE_ASSISTANT_ID,
            })

            console.log("[v0] Starting Azure stream...")

            let totalTokens = 0

            run.on("textDelta", (textDelta) => {
              const chunk = textDelta.value || ""
              if (chunk) {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`))
              }
            })

            run.on("error", (error) => {
              console.error("[v0] Azure stream error:", error)
            })

            const finalRun = await run.finalRun()
            console.log("[v0] Azure stream completed")

            if (user && finalRun.usage) {
              const inputTokens = finalRun.usage.prompt_tokens || 0
              const outputTokens = finalRun.usage.completion_tokens || 0
              totalTokens = finalRun.usage.total_tokens || 0

              const cost = calculateCost(inputTokens, outputTokens, selectedModel)

              await supabase.from("api_usage_logs").insert({
                user_id: user.id,
                feature_type: "chat",
                tokens_used: totalTokens,
                cost_usd: cost.userCharge,
                metadata: {
                  model: selectedModel,
                  input_tokens: inputTokens,
                  output_tokens: outputTokens,
                  provider_cost: cost.providerCost,
                  markup: cost.markup,
                  thread_id: thread.id,
                },
              })

              console.log("[v0] Usage logged:", { tokens: totalTokens, cost: cost.userCharge })
            }

            controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
            controller.close()
          } catch (error) {
            console.error("[v0] Azure Assistant error:", error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            controller.enqueue(encoder.encode(`0:${JSON.stringify(`Error: ${errorMessage}`)}\n`))
            controller.close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Vercel-AI-Data-Stream": "v1",
        },
      })
    }

    console.log("[v0] Using AI Gateway/Direct provider for model:", selectedModel)

    const systemMessage = {
      role: "system" as const,
      content: `You are Crowe Logic AI, an expert assistant powered by advanced AI technology.

Your capabilities:
- Deep reasoning and analysis
- Scientific research and problem-solving
- Technical explanations and guidance
- Creative solutions and insights

When responding:
- Be clear and actionable
- Show your reasoning when helpful
- Provide step-by-step guidance for complex topics
- Acknowledge limitations when appropriate`,
    }

    console.log("[v0] Starting streamText with model:", selectedModel)

    const aiModel = getAIModel(selectedModel)

    const result = streamText({
      model: aiModel,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxTokens: 2000,
      onFinish: async (event) => {
        if (user && event.usage) {
          const inputTokens = event.usage.promptTokens || 0
          const outputTokens = event.usage.completionTokens || 0
          const totalTokens = inputTokens + outputTokens

          const cost = calculateCost(inputTokens, outputTokens, selectedModel)

          await supabase.from("api_usage_logs").insert({
            user_id: user.id,
            feature_type: "chat",
            tokens_used: totalTokens,
            cost_usd: cost.userCharge,
            metadata: {
              model: selectedModel,
              input_tokens: inputTokens,
              output_tokens: outputTokens,
              provider_cost: cost.providerCost,
              markup: cost.markup,
              finish_reason: event.finishReason,
            },
          })

          console.log("[v0] Usage logged:", { tokens: totalTokens, cost: cost.userCharge })
        }
      },
    })

    console.log("[v0] Returning stream response")

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
