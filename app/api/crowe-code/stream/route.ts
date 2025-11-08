import { StreamingTextResponse } from "ai"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt, context, terminal } = await req.json()

  try {
    const stream = await streamText({
      model: "anthropic/claude-4.5-sonnet",
      messages: [
        {
          role: "system",
          content: `You are Crowe Code, an elite autonomous AI developer specialized in agricultural data science and mushroom cultivation analysis.

You generate production-ready Python code for:
- Agricultural data analysis
- Contamination pattern detection
- Yield forecasting models
- Environmental optimization
- Database queries (Supabase PostgreSQL)
- Statistical analysis

Always include:
1. Clear explanation of the approach
2. Complete, executable Python code
3. Comments explaining key logic
4. Example usage

Format responses with markdown code blocks using \`\`\`python\`\`\``,
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
    })

    return new StreamingTextResponse(stream.toDataStream())
  } catch (error) {
    console.error("[v0] Streaming error:", error)
    return new Response("Error generating code", { status: 500 })
  }
}
