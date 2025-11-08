import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json()

    // Simulate code execution (replace with actual execution logic)
    const output = `Executing ${language} code...\n\n${code}\n\nExecution complete.`

    return NextResponse.json({ output })
  } catch (error) {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 })
  }
}
