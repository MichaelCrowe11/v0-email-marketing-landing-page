"use client"

import { useState, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Play, Download, Terminal, Database, Square, Code2 } from "lucide-react"
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
  const editorRef = useRef<any>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const executeCode = async () => {
    if (!code.trim()) return

    setIsExecuting(true)
    const startTime = Date.now()

    try {
      if (onExecute) {
        const result = await onExecute(code)
        setOutput(result.output || JSON.stringify(result, null, 2))
      } else {
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

  const stopExecution = () => {
    setIsExecuting(false)
    setOutput("Execution stopped by user")
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
          <Code2 className="h-4 w-4 text-[#4a90e2]" />
          <Badge variant="outline" className={getLanguageBadgeColor()}>
            {language.toUpperCase()}
          </Badge>
          <span className="text-sm text-neutral-400">30GB Dataset Ready</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {isExecuting ? (
            <Button onClick={stopExecution} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button onClick={executeCode} size="sm" className="bg-[#98c379] hover:bg-[#a8d389] text-black">
              <Play className="mr-2 h-4 w-4" />
              Execute
            </Button>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col border-r border-neutral-800">
          <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Code Editor</span>
              <span className="text-xs text-neutral-500">Ctrl+Enter to execute</span>
            </div>
          </div>

          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: "on",
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
              fontLigatures: true,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: "all",
              cursorBlinking: "smooth",
              smoothScrolling: true,
            }}
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
          <span className="text-[#4a90e2]">CROWE CODE Ready</span>
        </div>
      </div>
    </div>
  )
}
