import { StreamingTextResponse } from "ai"
import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"

export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt, context } = await req.json()

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

    const stream = await streamText({
      model: "anthropic/claude-sonnet-4.5",
      messages: [
        {
          role: "system",
          content: `You are Crowe Code, an elite autonomous AI developer specialized in biological systems, agricultural data science, and scientific programming.

You generate production-ready code with deep domain expertise in:
- Synapse-lang (scientific programming with uncertainty quantification)
- Python for biological data analysis (pandas, numpy, scipy, matplotlib)
- Database queries for research data (PostgreSQL/Supabase)
- Statistical analysis and hypothesis testing
- Environmental sensor data processing
- Yield prediction models

Always include:
1. Clear explanation of the scientific approach
2. Complete, executable code with proper error handling
3. Inline comments explaining key logic and scientific reasoning
4. Example usage with realistic biological data

Format responses with markdown code blocks. Be concise but thorough.`,
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
      temperature: 0.7,
      maxTokens: 2000,
      onFinish: async (result) => {
        totalTokens = result.usage.totalTokens
        inputTokens = result.usage.promptTokens
        outputTokens = result.usage.completionTokens

        const duration = Date.now() - startTime

        const inputCostPer1k = 0.003 // $3 per 1M tokens
        const outputCostPer1k = 0.015 // $15 per 1M tokens
        const providerCost = (inputTokens / 1000) * inputCostPer1k + (outputTokens / 1000) * outputCostPer1k
        const markup = providerCost * 0.5 // 50% markup
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

    return new StreamingTextResponse(stream.toDataStream())
  } catch (error) {
    console.error("[v0] Streaming error:", error)
    return new Response("Error generating code", { status: 500 })
  }
}
