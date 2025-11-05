export const runtime = "edge"

interface ExportRequest {
  code: string
  language: string
  filename?: string
}

export async function POST(req: Request) {
  try {
    const { code, language, filename }: ExportRequest = await req.json()

    if (!code) {
      return new Response(JSON.stringify({ error: "Code is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Determine file extension based on language
    const extensions: Record<string, string> = {
      typescript: "ts",
      javascript: "js",
      python: "py",
      jsx: "jsx",
      tsx: "tsx",
      go: "go",
      rust: "rs",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      php: "php",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
      sql: "sql",
      html: "html",
      css: "css",
      json: "json",
      yaml: "yaml",
      markdown: "md",
      bash: "sh",
      shell: "sh",
    }

    const ext = extensions[language.toLowerCase()] || "txt"
    const defaultFilename = `crowe-code-export.${ext}`
    const finalFilename = filename || defaultFilename

    // Create the file content as a blob
    return new Response(code, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${finalFilename}"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("[Export API] Error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to export code",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
