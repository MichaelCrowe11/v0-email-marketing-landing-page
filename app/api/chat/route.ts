import { streamText } from "ai"
import OpenAI from "openai"

export const maxDuration = 30

// Validate environment variables
function validateEnv() {
  const errors: string[] = []

  if (!process.env.AZURE_AI_API_KEY) {
    errors.push("AZURE_AI_API_KEY is not set")
  }
  if (!process.env.AZURE_AI_ENDPOINT) {
    errors.push("AZURE_AI_ENDPOINT is not set")
  }

  if (errors.length > 0) {
    console.error("[v0] Environment validation failed:", errors)
    return { valid: false, errors }
  }

  return { valid: true, errors: [] }
}

const envCheck = validateEnv()

const azureOpenAI = envCheck.valid
  ? new OpenAI({
      apiKey: process.env.AZURE_AI_API_KEY || "",
      baseURL: process.env.AZURE_AI_ENDPOINT || "",
      defaultQuery: { "api-version": "2024-05-01-preview" },
      defaultHeaders: { "api-key": process.env.AZURE_AI_API_KEY || "" },
    })
  : null

const AZURE_ASSISTANT_ID = "asst_7ycbM8XLx9HjiBfvI0tGdhtz"

export async function POST(req: Request) {
  console.log("[v0] Chat API route called")

  try {
    const { messages, model } = await req.json()

    // Check environment configuration
    if (!envCheck.valid) {
      console.error("[v0] Environment validation failed:", envCheck.errors)

      // Return a user-friendly error message in the chat stream format
      const errorMessage = `⚠️ **AI Service Configuration Required**\n\nThe chat service needs to be configured with API credentials.\n\n**Missing:**\n${envCheck.errors.map(err => `• ${err}`).join('\n')}\n\n**To fix this:**\n1. Copy \`.env.example\` to \`.env.local\`\n2. Add your Azure OpenAI credentials\n3. Restart the development server\n\nSee [SETUP.md](../SETUP.md) for detailed instructions.`

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

    const selectedModel = model || "azure/crowelogic"

    console.log("[v0] Using model:", selectedModel)

    if (selectedModel === "azure/crowelogic" || selectedModel === "azure/agent874") {
      console.log("[v0] Using Azure AI Assistant")

      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const lastMessage = messages[messages.length - 1]
            const userContent = lastMessage?.content || ""

            if (!azureOpenAI) {
              throw new Error("Azure OpenAI client not initialized")
            }

            const thread = await azureOpenAI.beta.threads.create()

            await azureOpenAI.beta.threads.messages.create(thread.id, {
              role: "user",
              content: userContent,
            })

            const run = azureOpenAI.beta.threads.runs.stream(thread.id, {
              assistant_id: AZURE_ASSISTANT_ID,
            })

            run.on("textDelta", (textDelta) => {
              const chunk = textDelta.value || ""
              controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`))
            })

            await run.finalRun()

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

    const systemMessage = {
      role: "system" as const,
      content: `You are Crowe Logic AI, an expert mushroom cultivation assistant with 20+ years of commercial growing experience.

Your expertise includes:
- Species identification and cultivation parameters
- Contamination detection and remediation
- Substrate formulation and optimization
- Environmental control and monitoring
- Yield optimization and scaling operations
- Troubleshooting common cultivation issues

When responding:
- Be specific and actionable
- Reference scientific principles when relevant
- Provide step-by-step guidance for complex procedures
- Warn about safety concerns (pressure cookers, chemicals, etc.)
- Suggest preventive measures to avoid future issues

You can use <reasoning> tags to show your thought process for complex questions.`,
    }

    console.log("[v0] Starting streamText with AI Gateway")

    const result = streamText({
      model: selectedModel,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
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
