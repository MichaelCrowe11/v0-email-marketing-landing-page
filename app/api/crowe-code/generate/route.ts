import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json()

    const systemPrompt = `You are Crowe Code, an elite autonomous AI developer specializing in agricultural data analysis and mushroom cultivation research.
You have 20+ years of experience in scientific computing, pharmaceutical-grade data analysis, and agricultural systems.

Generate production-quality code with:
- Clean, research-grade structure
- Comprehensive error handling
- Professional documentation
- Agricultural/cultivation domain expertise
- Database integration (Supabase)
- Data export capabilities (JSON, CSV, reports)

Focus on: Python, pandas, numpy, matplotlib, SQL, data visualization, statistical analysis, batch tracking, yield forecasting.`

    const userPrompt = `${context?.length > 0 ? "Previous conversation context:\n" + context.map((m: any) => `${m.role}: ${m.content}`).join("\n") + "\n\n" : ""}User request: ${prompt}

Generate executable code with clear explanation. Format as JSON: { "code": "...", "language": "python", "explanation": "..." }`

    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4.5",
      prompt: systemPrompt + "\n\n" + userPrompt,
      temperature: 0.4,
      maxTokens: 3000,
    })

    try {
      const response = JSON.parse(text)
      return NextResponse.json(response)
    } catch {
      // Fallback if not JSON - extract code from markdown
      const codeMatch = text.match(/```(?:python)?\n([\s\S]*?)\n```/)
      const code = codeMatch ? codeMatch[1] : text
      const explanation = text.replace(/```(?:python)?\n[\s\S]*?\n```/g, "").trim()

      return NextResponse.json({
        code,
        language: "python",
        explanation: explanation || "Code generated successfully by Crowe Code",
      })
    }
  } catch (error) {
    console.error("[v0] Crowe Code error:", error)
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 })
  }
}
