"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Copy, Download, Check, X } from "lucide-react"

interface CodeEditorProps {
  initialCode: string
  language: string
  onClose: () => void
}

export function CodeEditor({ initialCode, language, onClose }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRun = async () => {
    setIsRunning(true)
    setOutput("⚡ Executing code...\n")

    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })

      const data = await response.json()

      if (data.success) {
        setOutput(`✓ Execution completed\n\n${data.output}`)
      } else {
        setOutput(`✗ Execution failed\n\n${data.error || data.output}`)
      }
    } catch (error) {
      setOutput(`✗ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${language === "python" ? "py" : language === "javascript" ? "js" : "txt"}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Code Editor</h2>
              <p className="text-xs text-muted-foreground">
                {language.charAt(0).toUpperCase() + language.slice(1)} • Interactive IDE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleRun} disabled={isRunning} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="w-4 h-4" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Editor and Output */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col border-r border-border">
            <div className="px-4 py-2 bg-muted/20 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">Editor</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-6 bg-muted/5 text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
              style={{
                tabSize: 2,
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="w-1/3 flex flex-col bg-muted/10">
            <div className="px-4 py-2 bg-muted/20 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">Output</span>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
                {output || "Run code to see output..."}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Lines: {code.split('\n').length}</span>
            <span>Characters: {code.length}</span>
            <span>Language: {language}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Press Ctrl+Enter to run • ESC to close
          </div>
        </div>
      </div>
    </div>
  )
}
