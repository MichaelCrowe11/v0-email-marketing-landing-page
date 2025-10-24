import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model?: string } = await req.json()

  // Default to GPT-5 if no model specified
  const selectedModel = model || "openai/gpt-5"

  console.log("[v0] Chat request with model:", selectedModel)

  const prompt = convertToModelMessages(messages)

  // Add system message for Crowe Logic context
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

  const result = streamText({
    model: selectedModel,
    messages: [systemMessage, ...prompt],
    abortSignal: req.signal,
    maxOutputTokens: 4000,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] Chat request aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
