"use client"

import React from "react"
import { CodeBlockWithActions } from "./code-block-with-actions"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Parse markdown content and extract code blocks
  const parseContent = (text: string) => {
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    // Regex to match code blocks: ```language\ncode\n```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index)
        if (textBefore.trim()) {
          parts.push(
            <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
              {textBefore}
            </div>
          )
        }
      }

      // Add code block with actions
      const language = match[1] || "plaintext"
      const code = match[2].trim()
      const filename = generateFilename(language, code)

      parts.push(
        <CodeBlockWithActions
          key={`code-${match.index}`}
          code={code}
          language={language}
          filename={filename}
          className="my-4"
        >
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </CodeBlockWithActions>
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const textAfter = text.slice(lastIndex)
      if (textAfter.trim()) {
        parts.push(
          <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {textAfter}
          </div>
        )
      }
    }

    return parts.length > 0 ? parts : <div className="whitespace-pre-wrap">{text}</div>
  }

  // Generate a filename based on language and code content
  const generateFilename = (language: string, code: string): string => {
    // Try to detect filename from common patterns
    const functionMatch = code.match(/function\s+(\w+)|const\s+(\w+)\s*=|class\s+(\w+)/)
    const name = functionMatch ? (functionMatch[1] || functionMatch[2] || functionMatch[3]) : "code"

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
      html: "html",
      css: "css",
      sql: "sql",
      bash: "sh",
      shell: "sh",
      json: "json",
      yaml: "yaml",
    }

    const ext = extensions[language.toLowerCase()] || "txt"
    return `${name}.${ext}`
  }

  return <div className={className}>{parseContent(content)}</div>
}
