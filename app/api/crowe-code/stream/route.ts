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

    const result = streamText({
      model: "anthropic/claude-sonnet-4.5",
      messages: [
        {
          role: "system",
          content: `You are Crowe Code, an elite AI developer for biological systems programming.

Core Expertise:
- Synapse-lang (uncertainty quantification, hypothesis testing, quantum computing)
- Python for agricultural data science (pandas, scipy, matplotlib)
- PostgreSQL/Supabase queries for research databases
- Statistical analysis and environmental sensor data
- Biological data visualization and yield prediction

When asked to generate code:
1. Provide clear scientific explanation
2. Write complete, production-ready code with error handling
3. Include inline comments explaining scientific reasoning
4. Add example usage with realistic biological data
5. Wrap code in markdown code blocks with language identifier

Be concise, accurate, and production-focused. Format all code in triple backtick markdown blocks.`,
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
      maxOutputTokens: 2000,
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

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] Streaming error:", error)
    return new Response("Error generating code", { status: 500 })
  }
}
