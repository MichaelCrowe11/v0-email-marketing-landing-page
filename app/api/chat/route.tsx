import { streamText } from "ai"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    console.log("[v0] Chat request received:", { model, messageCount: messages.length })

    if (model === "azure-agent") {
      const azureEndpoint = process.env.AZURE_AI_ENDPOINT
      const azureApiKey = process.env.AZURE_AI_API_KEY

      if (!azureEndpoint || !azureApiKey) {
        console.error("[v0] Azure AI credentials missing")
        return new Response(
          JSON.stringify({ error: "Azure AI not configured. Please add AZURE_AI_ENDPOINT and AZURE_AI_API_KEY." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      console.log("[v0] Using Azure AI agent:", azureEndpoint)

      // Call Azure AI endpoint directly
      const azureResponse = await fetch(azureEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": azureApiKey,
        },
        body: JSON.stringify({
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.parts?.map((p: any) => p.text).join("") || msg.content,
          })),
          max_tokens: 8000,
          temperature: 0.7,
          stream: true,
        }),
      })

      if (!azureResponse.ok) {
        const errorText = await azureResponse.text()
        console.error("[v0] Azure AI error:", errorText)
        throw new Error(`Azure AI request failed: ${azureResponse.status}`)
      }

      // Stream the response
      return new Response(azureResponse.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }

    console.log("[v0] Using AI Gateway model:", model)

    const result = streamText({
      model: model || "anthropic/claude-sonnet-4.5",
      messages,
      system: `You are Crowe Logic AI, an expert mycology cultivation assistant with 20+ years of commercial growing experience.

EXPERTISE AREAS:
- Mushroom cultivation (all methods: agar, liquid culture, grain spawn, bulk substrate)
- Contamination identification and prevention
- Commercial-scale operations and optimization
- Strain selection and genetics
- Environmental controls (temperature, humidity, CO2, FAE)
- Substrate formulation and sterilization
- Yield optimization and troubleshooting
- Food safety and quality control
- Business operations and scaling

RESPONSE STRUCTURE:
1. First, wrap your reasoning process in <reasoning> tags with steps:
   <reasoning>
   <step type="research">Analyze the question and recall relevant knowledge</step>
   <step type="analysis">Break down the problem and consider factors</step>
   <step type="synthesis">Formulate comprehensive solution</step>
   <step type="verification">Verify accuracy and completeness</step>
   </reasoning>

2. Then provide your detailed response with:
   - Clear, actionable guidance
   - Specific parameters (temperatures, ratios, timings)
   - Scientific explanations when relevant
   - Safety considerations
   - Troubleshooting tips
   - References to best practices

TONE: Professional, scientific, but accessible. Use precise terminology while explaining concepts clearly.

SAFETY: Always prioritize sterile technique, contamination prevention, and food safety protocols.`,
      maxTokens: 8000,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
