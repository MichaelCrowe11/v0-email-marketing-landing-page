"use client"

import { useState, useRef, useEffect } from "react"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { IDEToolbar } from "@/components/chat/ide-toolbar"
import { CodeFileBrowser } from "@/components/chat/code-file-browser"
import { Button } from "@/components/ui/button"
import {
  PanelLeft,
  Terminal,
  FileCode2,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Code2,
  Database,
  Layers,
  Zap,
  Maximize2,
  Minimize2,
  PanelRight,
} from "lucide-react"

interface CodeFile {
  id: string
  name: string
  language: string
  code: string
  size: number
  uploadedAt: Date
}

type CopilotState = "idle" | "listening" | "thinking" | "coding" | "completed"

type Task = {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  progress: number
  type: "frontend" | "backend" | "database" | "api" | "fullstack"
}

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function IDEPage() {
  const [files, setFiles] = useState<CodeFile[]>([])
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showCopilotPanel, setShowCopilotPanel] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "🧬 Crowe Logic Research IDE v2.0.0",
    "✨ Crowe Code Co-Pilot integrated and ready",
    "🚀 Start by describing what you want to build...",
    "",
  ])
  const [fullscreen, setFullscreen] = useState(false)

  // Co-Pilot State
  const [copilotState, setCopilotState] = useState<CopilotState>("idle")
  const [userInput, setUserInput] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [conversationHistory, setConversationHistory] = useState<Message[]>([])
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationHistory, currentMessage])

  const typeIconMap = {
    frontend: Layers,
    backend: Database,
    database: Database,
    api: Code2,
    fullstack: Sparkles,
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const message = userInput.trim()
    setUserInput("")
    setCopilotState("thinking")

    // Add user message to history
    setConversationHistory(prev => [...prev, { role: "user", content: message }])
    addTerminalLine(`💬 User: ${message.substring(0, 50)}...`)

    try {
      // Call the Crowe Code agent API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...conversationHistory,
            { role: "user", content: message }
          ],
          agent: "deepseek", // Crowe Code agent
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ""
      let extractedTasks: Task[] = []

      setCopilotState("coding")
      addTerminalLine("⚡ Crowe Code is thinking...")

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter(line => line.trim() !== "")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content

              if (content) {
                accumulatedText += content
                setCurrentMessage(accumulatedText)

                // Check if this is code and should update the editor
                const codeBlockMatch = accumulatedText.match(/```(\w+)?\n([\s\S]*?)```/g)
                if (codeBlockMatch && codeBlockMatch.length > 0) {
                  // Extract the last complete code block
                  const lastBlock = codeBlockMatch[codeBlockMatch.length - 1]
                  const match = lastBlock.match(/```(\w+)?\n([\s\S]*?)```/)
                  if (match) {
                    const language = match[1] || "typescript"
                    const code = match[2]

                    // Auto-create file if none exists
                    if (!activeFile) {
                      const newFile: CodeFile = {
                        id: Date.now().toString(),
                        name: `crowe-generated.${getFileExtension(language)}`,
                        language: language,
                        code: code,
                        size: code.length,
                        uploadedAt: new Date(),
                      }
                      setFiles([newFile])
                      setActiveFile(newFile)
                      addTerminalLine(`📄 Created ${newFile.name}`)
                    } else {
                      // Update active file with new code
                      setActiveFile({ ...activeFile, code, size: code.length })
                    }
                  }
                }

                // Parse task markers
                const taskMatches = content.matchAll(/\[TASK: ([^\|]+) \| ([^\|]+) \| ([^\]]+)\]/g)
                for (const match of taskMatches) {
                  const [, title, type, description] = match
                  const taskId = `task-${Date.now()}-${Math.random()}`

                  extractedTasks.push({
                    id: taskId,
                    title: title.trim(),
                    description: description.trim(),
                    status: "pending",
                    progress: 0,
                    type: (type.trim().toLowerCase() as Task["type"]) || "fullstack",
                  })
                }

                if (extractedTasks.length > 0) {
                  setTasks(extractedTasks)
                  simulateTaskProgress(extractedTasks)
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add assistant response to history
      setConversationHistory(prev => [...prev, { role: "assistant", content: accumulatedText }])
      setCurrentMessage("")
      setCopilotState("completed")
      addTerminalLine("✅ Crowe Code completed task")

      // Sync final code to files
      if (activeFile && accumulatedText.includes("```")) {
        setFiles(prev => prev.map(f =>
          f.id === activeFile.id ? activeFile : f
        ))
      }

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setCopilotState("idle")
      }, 2000)
    } catch (error) {
      console.error("Copilot error:", error)
      setCurrentMessage("I encountered an error. Please try again.")
      setCopilotState("idle")
      addTerminalLine("❌ Error occurred")
    }
  }

  const simulateTaskProgress = (taskList: Task[]) => {
    taskList.forEach((task, index) => {
      setTimeout(() => {
        setTasks(prev =>
          prev.map(t =>
            t.id === task.id ? { ...t, status: "in_progress" as const } : t
          )
        )
        addTerminalLine(`⚙️  ${task.title}...`)

        const progressInterval = setInterval(() => {
          setTasks(prev => {
            const updated = prev.map(t => {
              if (t.id === task.id && t.progress < 100) {
                const newProgress = Math.min(t.progress + Math.random() * 15, 100)
                if (newProgress >= 100) {
                  addTerminalLine(`✓ ${task.title} complete`)
                  return { ...t, progress: 100, status: "completed" as const }
                }
                return { ...t, progress: newProgress }
              }
              return t
            })

            const currentTask = updated.find(t => t.id === task.id)
            if (currentTask?.progress === 100) {
              clearInterval(progressInterval)
            }

            return updated
          })
        }, 300)
      }, index * 1000)
    })
  }

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      typescript: "ts",
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      go: "go",
      rust: "rs",
      ruby: "rb",
      php: "php",
      swift: "swift",
      kotlin: "kt",
    }
    return extensions[language.toLowerCase()] || "txt"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStateMessage = () => {
    switch (copilotState) {
      case "listening":
        return "I'm listening..."
      case "thinking":
        return "Analyzing your request..."
      case "coding":
        return "Writing code in real-time..."
      case "completed":
        return "Done! What's next?"
      default:
        return "Tell me what to build"
    }
  }

  const getAvatarState = (): "idle" | "thinking" | "responding" => {
    if (copilotState === "idle" || copilotState === "completed") return "idle"
    if (copilotState === "thinking" || copilotState === "listening") return "thinking"
    return "responding"
  }

  const handleFileSelect = (file: CodeFile) => {
    setActiveFile(file)
    addTerminalLine(`📂 Opened ${file.name}`)
  }

  const handleFileDelete = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      addTerminalLine(`🗑️  Deleted ${file.name}`)
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (activeFile?.id === fileId) {
      setActiveFile(null)
    }
  }

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case "run":
        if (activeFile) {
          addTerminalLine(`▶️  Running ${activeFile.name}...`)
          setTimeout(() => addTerminalLine("✓ Execution complete"), 1500)
        }
        break
      case "refactor":
        if (activeFile) {
          setUserInput(`Refactor this ${activeFile.language} code to improve quality:\n\n\`\`\`${activeFile.language}\n${activeFile.code}\n\`\`\``)
        }
        break
      case "terminal":
        setShowTerminal(!showTerminal)
        break
      case "git":
        addTerminalLine("🌿 Git status: On branch main")
        break
    }
  }

  const addTerminalLine = (line: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTerminalOutput((prev) => [...prev, `[${timestamp}] ${line}`])
  }

  return (
    <div className={`flex flex-col h-screen bg-background ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <IDEToolbar onAction={handleToolbarAction} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Browser */}
        {showSidebar && (
          <div className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-bold text-foreground mb-1">Files</h2>
              <p className="text-xs text-muted-foreground">Workspace</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <CodeFileBrowser
                onFileSelect={handleFileSelect}
                onFileDelete={handleFileDelete}
              />

              {files.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <FileCode2 className="w-12 h-12 mx-auto text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">
                    Ask Crowe Code to generate files
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Tabs */}
          {activeFile && (
            <div className="border-b border-border bg-muted/20 flex items-center px-2 py-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-t border-t border-l border-r border-border">
                <FileCode2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium">{activeFile.name}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" title="Modified" />
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="h-7 w-7 p-0"
                  title="Toggle File Browser"
                >
                  <PanelLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCopilotPanel(!showCopilotPanel)}
                  className="h-7 w-7 p-0"
                  title="Toggle Co-Pilot"
                >
                  <PanelRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullscreen(!fullscreen)}
                  className="h-7 w-7 p-0"
                >
                  {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 overflow-hidden relative">
            {activeFile ? (
              <div className="h-full relative">
                {/* Coding indicator overlay */}
                {copilotState === "coding" && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-xs font-medium text-blue-500">Crowe Code is writing...</span>
                  </div>
                )}

                <textarea
                  ref={editorRef}
                  value={activeFile.code}
                  onChange={(e) => {
                    const newCode = e.target.value
                    setActiveFile({ ...activeFile, code: newCode })
                  }}
                  className="w-full h-full p-6 bg-muted/5 text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none border-0"
                  spellCheck={false}
                  style={{ tabSize: 2 }}
                  placeholder="// Crowe Code will write code here as you describe what you want..."
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md px-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-3xl animate-pulse" />
                    <div className="relative">
                      <AIAvatarSwirl state="idle" size={80} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                      <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Crowe Code IDE
                      </span>
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      AI Pair Programming • Real-time Code Generation
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium">Crowe Code Ready</span>
                      </div>
                      <span className="text-xs text-muted-foreground">→</span>
                      <span className="text-xs text-muted-foreground">Describe what you want to build</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-48 border-t border-border bg-black/90 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-green-500">Terminal</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTerminal(false)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-green-400">
                {terminalOutput.map((line, i) => (
                  <div key={i} className="mb-1">
                    {line}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-cyan-400">$</span>
                  <span className="ml-2 animate-pulse">▋</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Crowe Code Co-Pilot Chat */}
        {showCopilotPanel && (
          <div className="w-96 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col">
            {/* Co-Pilot Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <AIAvatarSwirl state={getAvatarState()} size={36} />
                  {copilotState !== "idle" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    Crowe Code
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">{getStateMessage()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex-1 flex items-center gap-1.5 px-2 py-1 rounded bg-background/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">AI Pair Programmer</span>
                </div>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {conversationHistory.length === 0 && (
                <div className="text-center py-8 space-y-4">
                  <div className="text-sm font-medium text-foreground mb-3">Start Coding with AI</div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setUserInput("Create a React component for a login form with email and password")}
                      className="w-full p-3 rounded-lg bg-muted hover:bg-muted/80 border border-border text-left text-xs transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Layers className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-foreground">Login Form</div>
                          <div className="text-muted-foreground">React component</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setUserInput("Build a REST API endpoint for user registration with validation")}
                      className="w-full p-3 rounded-lg bg-muted hover:bg-muted/80 border border-border text-left text-xs transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Database className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-foreground">API Endpoint</div>
                          <div className="text-muted-foreground">User registration</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setUserInput("Write a Python function to parse CSV files and generate statistics")}
                      className="w-full p-3 rounded-lg bg-muted hover:bg-muted/80 border border-border text-left text-xs transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Code2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-foreground">CSV Parser</div>
                          <div className="text-muted-foreground">Python analytics</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {conversationHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <AIAvatarSwirl state="idle" size={28} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                      U
                    </div>
                  )}
                </div>
              ))}

              {currentMessage && (
                <div className="flex gap-2 justify-start">
                  <div className="flex-shrink-0">
                    <AIAvatarSwirl state="responding" size={28} />
                  </div>
                  <div className="max-w-[85%] rounded-xl px-3 py-2 bg-muted text-foreground border border-border">
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{currentMessage}</p>
                  </div>
                </div>
              )}

              {/* Task Progress */}
              {tasks.length > 0 && (
                <div className="space-y-2 pt-2">
                  {tasks.map(task => {
                    const Icon = typeIconMap[task.type]
                    return (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-lg bg-muted border border-border space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <Icon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h5 className="text-xs font-semibold text-foreground truncate">
                                  {task.title}
                                </h5>
                                {task.status === "completed" && (
                                  <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                )}
                                {task.status === "in_progress" && (
                                  <Loader2 className="w-3 h-3 text-blue-500 animate-spin flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                {task.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-blue-500 flex-shrink-0">
                            {Math.round(task.progress)}%
                          </span>
                        </div>
                        <div className="h-1 bg-muted-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-background/50">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe what you want to code..."
                  className="w-full min-h-[80px] max-h-[200px] px-3 py-2 pr-10 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  disabled={copilotState === "thinking" || copilotState === "coding"}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || copilotState === "thinking" || copilotState === "coding"}
                  size="sm"
                  className="absolute right-2 bottom-2 h-7 w-7 p-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {copilotState === "thinking" || copilotState === "coding" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
