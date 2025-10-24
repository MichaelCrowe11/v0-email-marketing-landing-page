import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  console.log("[v0] Chat API route called")

  try {
    const { messages, model } = await req.json()

    console.log("[v0] Received messages:", messages?.length || 0)
    console.log("[v0] Selected model:", model)

    const selectedModel = model || "anthropic/claude-sonnet-4.5"

    console.log("[v0] Using model:", selectedModel)

    const systemMessage = {
      role: "system" as const,
      content: `You are CROWELOGIC AI, an expert mushroom cultivation assistant with 20+ years of commercial growing experience. 

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

    console.log("[v0] Starting streamText")

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
