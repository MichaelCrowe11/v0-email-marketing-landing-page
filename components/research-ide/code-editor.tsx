"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Save, Download, Upload, Terminal, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CodeEditorProps {
  sessionId?: string
  initialCode?: string
  language?: "python" | "r" | "javascript" | "sql"
  onExecute?: (code: string) => Promise<{ output: string }>
}

export function CodeEditor({ sessionId, initialCode = "", language = "python", onExecute }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [code])

  const executeCode = async () => {
    if (!code.trim()) return

    setIsExecuting(true)
    const startTime = Date.now()

    try {
      if (onExecute) {
        const result = await onExecute(code)
        setOutput(result.output || JSON.stringify(result, null, 2))
      } else {
        // Call the real API endpoint
        const response = await fetch("/api/execute-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language,
          }),
        })

        const result = await response.json()

        if (result.error) {
          setOutput(`❌ Execution Error:\n\n${result.error}`)
        } else {
          setOutput(result.output)
        }
      }
    } catch (error) {
      setOutput(`❌ Network Error: ${error instanceof Error ? error.message : "Failed to connect to execution server"}`)
    } finally {
      const endTime = Date.now()
      setExecutionTime(endTime - startTime)
      setIsExecuting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      executeCode()
    }

    // Handle tab indentation
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = code.substring(0, start) + "    " + code.substring(end)
      setCode(newValue)

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
  }

  const getLanguageBadgeColor = () => {
    switch (language) {
      case "python":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40"
      case "r":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
      case "javascript":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
      case "sql":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
      default:
        return "bg-neutral-500/20 text-neutral-300 border-neutral-500/40"
    }
  }

  return (
    <div className="flex h-full flex-col bg-black border border-neutral-800">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-900 px-4 py-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={getLanguageBadgeColor()}>
            {language.toUpperCase()}
          </Badge>
          <span className="text-sm text-neutral-400">Session {sessionId || "default"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button
            onClick={executeCode}
            disabled={isExecuting}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isExecuting ? (
              <>
                <Terminal className="mr-2 h-4 w-4 animate-pulse" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Input */}
        <div className="flex flex-1 flex-col border-r border-neutral-800">
          <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Code Editor</span>
              <span className="text-xs text-neutral-500">Ctrl+Enter to execute</span>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`# ${language === "python" ? "Python" : language.toUpperCase()} Research Terminal
# Load your 30GB mushroom dataset and start analyzing
${
  language === "python"
    ? `
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load mushroom cultivation data
df = pd.read_csv('mushroom_cultivation_data.csv')
print(f"Dataset shape: {df.shape}")
df.head()`
    : `
# Enter your ${language} code here
# Connect to databases, analyze data, run ML models
`
}`}
            className="w-full h-full p-4 bg-black border-none outline-none resize-none font-mono text-sm leading-relaxed text-white placeholder:text-neutral-600"
            style={{ minHeight: "300px" }}
          />
        </div>

        {/* Output Panel */}
        <div className="flex w-1/2 flex-col">
          <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Output</span>
              {executionTime && <span className="text-xs text-blue-400">Executed in {executionTime}ms</span>}
            </div>
          </div>

          <div ref={outputRef} className="flex-1 overflow-auto p-4 bg-black">
            {output ? (
              <pre className="text-xs font-mono whitespace-pre-wrap text-neutral-300">{output}</pre>
            ) : (
              <div className="text-xs text-neutral-600 italic">Output will appear here after execution...</div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-4 py-1 text-xs text-neutral-400">
        <div className="flex items-center gap-4">
          <span>Lines: {code.split("\n").length}</span>
          <span>Characters: {code.length}</span>
          {isExecuting && (
            <span className="flex items-center gap-1 text-yellow-400">
              <Terminal className="h-3 w-3 animate-pulse" />
              Executing...
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400">
            <Database className="h-3 w-3" />
            Database Connected
          </span>
          <span className="text-blue-400">CROWE LOGIC Ready</span>
        </div>
      </div>
    </div>
  )
}
