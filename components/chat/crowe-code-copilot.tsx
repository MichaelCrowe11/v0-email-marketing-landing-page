"use client"

import { useState, useRef, useEffect } from "react"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { Button } from "@/components/ui/button"
import {
  X,
  Minimize2,
  Maximize2,
  Send,
  Loader2,
  CheckCircle2,
  Circle,
  Sparkles,
  Code2,
  FileCode,
  Database,
  Layers,
  Zap
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type CopilotState = "idle" | "listening" | "thinking" | "coding" | "completed"

type Task = {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  progress: number
  files?: string[]
  type: "frontend" | "backend" | "database" | "api" | "fullstack"
}

interface CroweCodeCopilotProps {
  onClose: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export function CroweCodeCopilot({
  onClose,
  isMinimized = false,
  onToggleMinimize
}: CroweCodeCopilotProps) {
  const [copilotState, setCopilotState] = useState<CopilotState>("idle")
  const [userInput, setUserInput] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([])
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
          copilotMode: true, // Special flag for co-pilot behavior
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ""
      let extractedTasks: Task[] = []

      setCopilotState("coding")

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

                // Parse task markers from response
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
                  // Simulate progress
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

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setCopilotState("idle")
      }, 2000)
    } catch (error) {
      console.error("Copilot error:", error)
      setCurrentMessage("I encountered an error. Please try again.")
      setCopilotState("idle")
    }
  }

  const simulateTaskProgress = (taskList: Task[]) => {
    taskList.forEach((task, index) => {
      // Stagger task starts
      setTimeout(() => {
        setTasks(prev =>
          prev.map(t =>
            t.id === task.id ? { ...t, status: "in_progress" as const } : t
          )
        )

        // Simulate progress
        const progressInterval = setInterval(() => {
          setTasks(prev => {
            const updated = prev.map(t => {
              if (t.id === task.id && t.progress < 100) {
                const newProgress = Math.min(t.progress + Math.random() * 15, 100)
                if (newProgress >= 100) {
                  return { ...t, progress: 100, status: "completed" as const }
                }
                return { ...t, progress: newProgress }
              }
              return t
            })

            // Clear interval if task is complete
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
        return "Building your solution..."
      case "completed":
        return "All done! Ready for your next request."
      default:
        return "Hey! Tell me what you want to build."
    }
  }

  const getAvatarState = (): "idle" | "thinking" | "responding" => {
    if (copilotState === "idle" || copilotState === "completed") return "idle"
    if (copilotState === "thinking" || copilotState === "listening") return "thinking"
    return "responding"
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggleMinimize}
          className="group relative"
        >
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 -m-3">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-indigo-500/30 blur-xl animate-pulse" />
          </div>

          {/* Avatar */}
          <div className="relative">
            <AIAvatarSwirl state={getAvatarState()} size={56} />

            {/* Status indicator */}
            {copilotState !== "idle" && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Crowe Code Co-Pilot
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900" />
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[480px] max-h-[680px] flex flex-col">
      <Card className="flex flex-col h-full bg-gray-950/95 backdrop-blur-xl border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <AIAvatarSwirl state={getAvatarState()} size={40} />
              {copilotState !== "idle" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                Crowe Code Co-Pilot
                <Zap className="w-4 h-4 text-yellow-400" />
              </h3>
              <p className="text-xs text-gray-400">{getStateMessage()}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMinimize}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {conversationHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 -m-8 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl" />
                <AIAvatarSwirl state="idle" size={80} />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-white">Full-Stack Development at Your Command</h4>
                <p className="text-sm text-gray-400 max-w-sm">
                  Describe what you want to build in natural language. I'll break it down, write the code, and explain every step.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                <button
                  onClick={() => setUserInput("Build a user authentication system with JWT")}
                  className="p-3 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-left text-xs text-gray-300 transition-colors"
                >
                  <Code2 className="w-4 h-4 mb-1 text-blue-400" />
                  <div className="font-semibold">Auth System</div>
                </button>
                <button
                  onClick={() => setUserInput("Create a REST API with CRUD operations")}
                  className="p-3 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-left text-xs text-gray-300 transition-colors"
                >
                  <Database className="w-4 h-4 mb-1 text-green-400" />
                  <div className="font-semibold">REST API</div>
                </button>
                <button
                  onClick={() => setUserInput("Build a responsive dashboard with charts")}
                  className="p-3 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-left text-xs text-gray-300 transition-colors"
                >
                  <Layers className="w-4 h-4 mb-1 text-purple-400" />
                  <div className="font-semibold">Dashboard UI</div>
                </button>
                <button
                  onClick={() => setUserInput("Set up a database schema for an e-commerce app")}
                  className="p-3 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-left text-xs text-gray-300 transition-colors"
                >
                  <Database className="w-4 h-4 mb-1 text-orange-400" />
                  <div className="font-semibold">DB Schema</div>
                </button>
              </div>
            </div>
          )}

          {conversationHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0">
                  <AIAvatarSwirl state="idle" size={32} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-gray-900 text-gray-200 border border-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300">
                  You
                </div>
              )}
            </div>
          ))}

          {/* Current streaming message */}
          {currentMessage && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <AIAvatarSwirl state="responding" size={32} />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-900 text-gray-200 border border-gray-800">
                <p className="text-sm whitespace-pre-wrap">{currentMessage}</p>
              </div>
            </div>
          )}

          {/* Task Progress Display */}
          {tasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <Sparkles className="w-3 h-3" />
                Building your solution
              </div>
              {tasks.map(task => {
                const Icon = typeIconMap[task.type]
                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-gray-900 border border-gray-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <Icon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-semibold text-white truncate">
                              {task.title}
                            </h5>
                            {task.status === "completed" && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                            {task.status === "in_progress" && (
                              <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                            )}
                            {task.status === "pending" && (
                              <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-400 flex-shrink-0">
                        {Math.round(task.progress)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
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
        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me what you want to build..."
              className="w-full min-h-[80px] max-h-[160px] px-4 py-3 pr-12 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
              disabled={copilotState === "thinking" || copilotState === "coding"}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || copilotState === "thinking" || copilotState === "coding"}
              className="absolute right-2 bottom-2 h-9 w-9 p-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copilotState === "thinking" || copilotState === "coding" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  )
}
