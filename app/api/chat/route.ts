import { streamText } from "ai"
import OpenAI from "openai"

export const maxDuration = 30

const azureOpenAI = new OpenAI({
  apiKey: process.env.AZURE_AI_API_KEY || "",
  baseURL: process.env.AZURE_AI_ENDPOINT || "",
  defaultQuery: { "api-version": "2024-05-01-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_AI_API_KEY || "" },
})

const AZURE_ASSISTANT_ID = "asst_7ycbM8XLx9HjiBfvI0tGdhtz"

export async function POST(req: Request) {
  console.log("[v0] Chat API route called")

  try {
    const { messages, model } = await req.json()

    console.log("[v0] Received messages:", messages?.length || 0)
    console.log("[v0] Selected model:", model)

    const selectedModel = model || "azure/agent874"

    console.log("[v0] Using model:", selectedModel)

    if (selectedModel === "azure/agent874") {
      console.log("[v0] Using Azure AI Assistant")

      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Get the last user message
            const lastMessage = messages[messages.length - 1]
            const userContent = lastMessage?.content || ""

            // Create a thread
            const thread = await azureOpenAI.beta.threads.create()

            // Add user message to thread
            await azureOpenAI.beta.threads.messages.create(thread.id, {
              role: "user",
              content: userContent,
            })

            // Run the assistant with streaming
            const run = azureOpenAI.beta.threads.runs.stream(thread.id, {
              assistant_id: AZURE_ASSISTANT_ID,
            })

            // Handle streaming events
            run.on("textDelta", (textDelta) => {
              const chunk = textDelta.value || ""
              controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`))
            })

            // Wait for completion
            await run.finalRun()

            controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`))
            controller.close()
          } catch (error) {
            console.error("[v0] Azure Assistant error:", error)
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
      content: `You are Crowe Logic AI, an expert mushroom cultivation assistant with 20+ years of commercial growing experience and browser research capabilities.

Your expertise includes:
- Species identification and cultivation parameters
- Contamination detection and remediation
- Substrate formulation and optimization
- Environmental control and monitoring
- Yield optimization and scaling operations
- Troubleshooting common cultivation issues
- Web research for latest cultivation techniques and scientific studies

**Research Capabilities:**
When users ask you to research, look up, or find information, you can trigger browser-based research by mentioning it in your response. The system will automatically detect research requests and show the user a live browser research panel.

When responding:
- Be specific and actionable
- Reference scientific principles when relevant
- Provide step-by-step guidance for complex procedures
- Warn about safety concerns (pressure cookers, chemicals, etc.)
- Suggest preventive measures to avoid future issues
- Offer to research topics when you need current information

You can use <reasoning> tags to show your thought process for complex questions.`,
    }

    console.log("[v0] Starting streamText with AI Gateway")

    const result = streamText({
      model: selectedModel,
      messages: [systemMessage, ...messages],
      maxTokens: 4000,
      temperature: 0.7,
    })

    console.log("[v0] Returning stream response")

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
