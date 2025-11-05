"use client"

import { useState } from "react"
import { Copy, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockWithActionsProps {
  code: string
  language: string
  filename?: string
  className?: string
  children?: React.ReactNode
}

export function CodeBlockWithActions({
  code,
  language,
  filename,
  className,
  children,
}: CodeBlockWithActionsProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const handleDownload = async () => {
    try {
      setDownloading(true)

      const response = await fetch("/api/code/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          filename,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to download file")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename || `code.${getExtension(language)}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to download file:", error)
    } finally {
      setDownloading(false)
    }
  }

  const getExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      typescript: "ts",
      javascript: "js",
      python: "py",
      jsx: "jsx",
      tsx: "tsx",
      go: "go",
      rust: "rs",
      java: "java",
    }
    return extensions[lang.toLowerCase()] || "txt"
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2 bg-background/80 backdrop-blur-sm hover:bg-accent"
          title="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="ml-1.5 text-xs">{copied ? "Copied!" : "Copy"}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
          className="h-8 px-2 bg-background/80 backdrop-blur-sm hover:bg-accent"
          title="Download file"
        >
          <Download className="h-4 w-4" />
          <span className="ml-1.5 text-xs">{downloading ? "Downloading..." : "Download"}</span>
        </Button>
      </div>

      {/* Code block content (passed as children or styled pre/code) */}
      {children || (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      )}

      {/* Filename badge */}
      {filename && (
        <div className="absolute top-2 left-2 text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded border border-border">
          {filename}
        </div>
      )}
    </div>
  )
}
