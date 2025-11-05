export const runtime = "edge"

interface UploadRequest {
  filename: string
  code: string
  action: "refactor" | "explain" | "fix" | "modernize" | "optimize"
  language?: string
}

export async function POST(req: Request) {
  try {
    const { filename, code, action, language }: UploadRequest = await req.json()

    if (!filename || !code || !action) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: filename, code, action" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Detect language from filename if not provided
    const detectedLanguage = language || detectLanguageFromFilename(filename)

    // Create a prompt based on the action
    const prompts: Record<string, string> = {
      refactor: `Refactor this ${detectedLanguage} code to improve quality, readability, and performance:\n\n\`\`\`${detectedLanguage}\n${code}\n\`\`\`\n\nProvide the refactored code with explanations of changes.`,
      explain: `Explain this ${detectedLanguage} code in detail:\n\n\`\`\`${detectedLanguage}\n${code}\n\`\`\`\n\nProvide a comprehensive explanation including what it does, how it works, and any potential issues.`,
      fix: `Analyze and fix any bugs or issues in this ${detectedLanguage} code:\n\n\`\`\`${detectedLanguage}\n${code}\n\`\`\`\n\nProvide the fixed code with explanations of the bugs found.`,
      modernize: `Modernize this ${detectedLanguage} code using current best practices and latest language features:\n\n\`\`\`${detectedLanguage}\n${code}\n\`\`\`\n\nProvide the modernized code.`,
      optimize: `Optimize this ${detectedLanguage} code for better performance:\n\n\`\`\`${detectedLanguage}\n${code}\n\`\`\`\n\nProvide the optimized code with performance improvements explained.`,
    }

    const prompt = prompts[action]

    // Return the prompt that will be sent to the chat API
    // The frontend will handle actually sending this to /api/chat
    return new Response(
      JSON.stringify({
        success: true,
        filename,
        language: detectedLanguage,
        action,
        prompt,
        message: `Ready to ${action} ${filename}`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("[Upload API] Error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process upload",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

function detectLanguageFromFilename(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase()

  const extensionMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    go: "go",
    rs: "rust",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    swift: "swift",
    kt: "kotlin",
    sql: "sql",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    sh: "bash",
    md: "markdown",
  }

  return extensionMap[extension || ""] || "plaintext"
}
