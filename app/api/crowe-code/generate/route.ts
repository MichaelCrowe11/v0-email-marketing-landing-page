import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json()

    const systemPrompt = `You are Crowe Code, an autonomous software developer specializing in data analysis and research software.
You have 20 years of experience in scientific computing, data analysis, and algorithm development.

Generate clean, efficient code with clear explanations.
Focus on: Python, R, SQL, data analysis, machine learning, scientific computing.
Always include error handling and comments.`

    const userPrompt = `${context?.length > 0 ? "Previous conversation context:\n" + context.map((m: any) => `${m.role}: ${m.content}`).join("\n") + "\n\n" : ""}User request: ${prompt}

Generate code and explanation. Format as JSON: { "code": "...", "language": "python", "explanation": "..." }`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: systemPrompt + "\n\n" + userPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    try {
      const response = JSON.parse(text)
      return NextResponse.json(response)
    } catch {
      // Fallback if not JSON
      return NextResponse.json({
        code: text.includes("```") ? text.split("```")[1].replace(/^\w+\n/, "") : text,
        language: "python",
        explanation: "Code generated successfully",
      })
    }
  } catch (error) {
    console.error("[v0] Crowe Code error:", error)
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 })
  }
}
