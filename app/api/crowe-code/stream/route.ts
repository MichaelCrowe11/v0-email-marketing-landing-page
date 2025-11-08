import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { createClient } from "@/lib/supabase/server"

export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt, context, mode = "generate" } = await req.json()

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { data: quota } = await supabase.from("usage_quotas").select("*").eq("user_id", user.id).single()

    if (quota) {
      const remaining = (quota.chat_messages_quota || 10) - (quota.chat_messages_used || 0)
      if (remaining <= 0) {
        return new Response("Daily quota exceeded", { status: 429 })
      }
    }

    const startTime = Date.now()
    let totalTokens = 0
    let inputTokens = 0
    let outputTokens = 0

    let systemPrompt = `You are Crowe Code, an elite AI developer for biological systems programming.

Core Expertise:
- Synapse-lang (uncertainty quantification, hypothesis testing, quantum computing)
- Python for agricultural data science (pandas, scipy, matplotlib)
- PostgreSQL/Supabase queries for research databases
- Statistical analysis and environmental sensor data
- Biological data visualization and yield prediction`

    if (mode === "plan") {
      systemPrompt += `

PLANNING MODE INSTRUCTIONS:
1. First, outline your approach with numbered steps
2. Explain the scientific reasoning and data structures
3. Then provide the complete implementation code
4. Format: "## Plan\n[steps]\n\n## Implementation\n\`\`\`language\n[code]\n\`\`\`"`
    } else if (mode === "generate") {
      systemPrompt += `

GENERATION MODE INSTRUCTIONS:
1. Write production-ready code immediately
2. Include minimal inline comments for clarity
3. Provide complete, runnable code with error handling
4. Format in markdown code blocks with language identifier
5. Be concise - code first, brief explanation after`
    } else if (mode === "guided") {
      systemPrompt += `

GUIDED MODE INSTRUCTIONS:
1. Break down the solution into clear steps
2. Explain each component before showing code
3. Ask if they want to proceed after each major section
4. Provide code in digestible chunks with explanations
5. Format: "Step 1: [explanation]\n\`\`\`language\n[code chunk]\n\`\`\`\n\nReady for Step 2?"`
    }

    systemPrompt += `

Be concise, accurate, and production-focused. Format all code in triple backtick markdown blocks.`

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...(context || []).map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: mode === "plan" ? 0.5 : 0.7,
      maxTokens: mode === "plan" ? 3000 : 2000,
      onFinish: async (completion) => {
        totalTokens = completion.usage.totalTokens
        inputTokens = completion.usage.promptTokens
        outputTokens = completion.usage.completionTokens

        const duration = Date.now() - startTime

        const inputCostPer1k = 0.003
        const outputCostPer1k = 0.015
        const providerCost = (inputTokens / 1000) * inputCostPer1k + (outputTokens / 1000) * outputCostPer1k
        const markup = providerCost * 0.5
        const userCharge = providerCost + markup

        await supabase.from("ai_usage_analytics").insert({
          user_id: user.id,
          feature_type: "crowe_code",
          model_provider: "anthropic",
          model_id: "claude-sonnet-4.5",
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_tokens: totalTokens,
          provider_cost_usd: providerCost,
          markup_usd: markup,
          user_charge_usd: userCharge,
          metadata: {
            duration_ms: duration,
            prompt_length: prompt.length,
            generation_mode: mode,
          },
        })

        await supabase
          .from("usage_quotas")
          .update({
            chat_messages_used: (quota?.chat_messages_used || 0) + 1,
          })
          .eq("user_id", user.id)
      },
    })

    // Return proper AI SDK v5 data stream response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[v0] Streaming error:", error)
    return new Response("Error generating code", { status: 500 })
  }
}
