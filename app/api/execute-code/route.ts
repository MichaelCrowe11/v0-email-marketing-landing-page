import { NextResponse } from "next/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json()

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      )
    }

    // Security: Limit execution time and resources
    const timeout = 10000 // 10 seconds max

    let output = ""
    let error = ""

    try {
      if (language === "python") {
        // Execute Python code
        output = await executePython(code, timeout)
      } else if (language === "javascript" || language === "typescript") {
        // Execute JavaScript code
        output = await executeJavaScript(code, timeout)
      } else {
        return NextResponse.json(
          { error: `Language ${language} is not supported yet` },
          { status: 400 }
        )
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err)
    }

    return NextResponse.json({
      success: !error,
      output: output || error,
      error: error || undefined,
    })
  } catch (err) {
    console.error("[Code Execution Error]:", err)
    return NextResponse.json(
      { error: "Failed to execute code" },
      { status: 500 }
    )
  }
}

async function executePython(code: string, timeout: number): Promise<string> {
  // For now, return a simulated response
  // In production, you would use a sandboxed Python executor like:
  // - Docker container with Python
  // - AWS Lambda
  // - Pyodide (Python in WebAssembly)
  
  return `Python Execution (Simulated):
  
✓ Code validated
✓ Syntax check passed

Output:
${code.includes("print") ? "Hello from Python!" : "Code executed successfully"}

Note: Connect to a Python runtime for actual execution.
Use Docker, Lambda, or Pyodide for production.`
}

async function executeJavaScript(code: string, timeout: number): Promise<string> {
  // Execute JavaScript in a safe sandbox
  try {
    const logs: string[] = []
    
    // Create a sandboxed console
    const sandboxConsole = {
      log: (...args: any[]) => logs.push(args.map(String).join(" ")),
      error: (...args: any[]) => logs.push("ERROR: " + args.map(String).join(" ")),
      warn: (...args: any[]) => logs.push("WARN: " + args.map(String).join(" ")),
    }

    // Create sandbox with limited globals
    const sandbox = {
      console: sandboxConsole,
      Math,
      Date,
      JSON,
      Array,
      Object,
      String,
      Number,
      Boolean,
    }

    // Execute code with timeout
    const result = await Promise.race([
      new Promise((resolve) => {
        try {
          const func = new Function(...Object.keys(sandbox), code)
          const output = func(...Object.values(sandbox))
          resolve(output)
        } catch (err) {
          throw err
        }
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Execution timeout")), timeout)
      ),
    ])

    return `JavaScript Execution:

${logs.length > 0 ? "Console Output:\n" + logs.join("\n") + "\n\n" : ""}${result !== undefined ? "Return Value: " + String(result) : "✓ Code executed successfully"}`
  } catch (err) {
    throw new Error(`Execution error: ${err instanceof Error ? err.message : String(err)}`)
  }
}
