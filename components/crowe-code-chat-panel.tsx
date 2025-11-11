"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Copy, Check, Sparkles } from "lucide-react"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content: string
  code?: string
  language?: string
  streaming?: boolean
}

interface Props {
  onCodeGenerated: (code: string) => void
  selectedText: string
  onUsageUpdate?: (quota: { used: number; remaining: number; quota: number }) => void
  editorInstance?: any
  generationMode: "plan" | "generate" | "guided"
}

export function CroweCodeChatPanel({
  onCodeGenerated,
  selectedText,
  onUsageUpdate,
  editorInstance,
  generationMode,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-populate with selected text
  useEffect(() => {
    if (selectedText) {
      setInput(`Explain this code:\n\n${selectedText}`)
    }
  }, [selectedText])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    // Add streaming assistant message
    const streamingMessage: Message = {
      role: "assistant",
      content: "",
      streaming: true,
    }
    setMessages((prev) => [...prev, streamingMessage])

    let hasInsertedCode = false

    try {
      const response = await fetch("/api/crowe-code/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, context: messages }),
      })

      if (response.status === 429) {
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content:
              "⚠️ Daily quota exceeded. You've reached your free tier limit of AI requests. Upgrade your plan or wait until tomorrow for quota reset.",
          }
          return newMessages
        })
        setIsGenerating(false)
        return
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let fullResponse = ""
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true })

          // Process complete lines from buffer
          const lines = buffer.split("\n")
          buffer = lines.pop() || "" // Keep incomplete line in buffer

          for (const line of lines) {
            if (!line.trim()) continue

            // AI SDK data stream format: each chunk is prefixed with type identifier
            // Format: 0:"text" for text chunks, 2:"{json}" for data, etc.
            try {
              // Text chunks from AI SDK start with '0:' followed by JSON-encoded string
              if (line.startsWith("0:")) {
                const textChunk = JSON.parse(line.slice(2))
                fullResponse += textChunk

                // Update streaming message in real-time (token by token)
                setMessages((prev) => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  if (lastMessage.role === "assistant") {
                    lastMessage.content = fullResponse
                    // Extract code block if present
                    const codeMatch = fullResponse.match(/```(\w+)?\n([\s\S]*?)```/)
                    if (codeMatch) {
                      lastMessage.code = codeMatch[2]
                      lastMessage.language = codeMatch[1] || "python"

                      // AUTO-INSERT CODE INTO MONACO EDITOR (only once when code block completes)
                      if (!hasInsertedCode && editorInstance && lastMessage.code) {
                        const selection = editorInstance.getSelection()
                        const position = editorInstance.getPosition()

                        // Insert at cursor position
                        editorInstance.executeEdits("crowe-code-ai", [
                          {
                            range: new (window as any).monaco.Range(
                              position.lineNumber,
                              position.column,
                              position.lineNumber,
                              position.column
                            ),
                            text: lastMessage.code,
                          },
                        ])

                        // Move cursor to end of inserted code
                        const lines = lastMessage.code.split("\n")
                        const newPosition = {
                          lineNumber: position.lineNumber + lines.length - 1,
                          column: lines[lines.length - 1].length + 1,
                        }
                        editorInstance.setPosition(newPosition)
                        editorInstance.revealPosition(newPosition)
                        editorInstance.focus()

                        hasInsertedCode = true
                        console.log("[v0] Auto-inserted code into editor")
                      }
                    }
                  }
                  return newMessages
                })
              }
              // Handle error chunks (e.g., "3:{error json}")
              else if (line.startsWith("3:")) {
                const errorData = JSON.parse(line.slice(2))
                console.error("[Crowe Code] Stream error:", errorData)
              }
              // Handle finish/metadata chunks (e.g., "d:{metadata}")
              else if (line.startsWith("d:")) {
                const metadata = JSON.parse(line.slice(2))
                console.log("[Crowe Code] Stream metadata:", metadata)
              }
            } catch (parseError) {
              // If parsing fails, treat as raw text (fallback for non-standard streams)
              console.warn("[Crowe Code] Failed to parse stream chunk:", line, parseError)
              fullResponse += line
              setMessages((prev) => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]
                if (lastMessage.role === "assistant") {
                  lastMessage.content = fullResponse
                }
                return newMessages
              })
            }
          }
        }

        // Update usage quota after stream completes
        const usageResponse = await fetch("/api/usage/quota")
        if (usageResponse.ok) {
          const newQuota = await usageResponse.json()
          onUsageUpdate?.(newQuota)
        }
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: "Error generating response. Please try again.",
        }
        return newMessages
      })
    } finally {
      setIsGenerating(false)
      // Remove streaming flag
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage.role === "assistant") {
          delete lastMessage.streaming
        }
        return newMessages
      })
    }
  }

  const handleCopy = (text: string, index: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  const handleInsertCode = (code: string) => {
    onCodeGenerated(code)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-[#cccccc] font-semibold">Crowe Code Agent</p>
              <p className="text-[#858585] text-xs max-w-sm">
                Ask me to generate code, explain functions, debug errors, or optimize your agricultural data analysis
              </p>
            </div>
            <div className="space-y-2 w-full text-xs">
              <div className="text-[#858585] text-left">Try asking:</div>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Generate a function to analyze contamination patterns")}
                  className="w-full justify-start text-[#cccccc] bg-[#1e1e1e] border-[#485063] hover:bg-[#2a2d2e]"
                >
                  Generate contamination analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Create a yield forecasting model")}
                  className="w-full justify-start text-[#cccccc] bg-[#1e1e1e] border-[#485063] hover:bg-[#2a2d2e]"
                >
                  Create yield forecast model
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Optimize this database query for performance")}
                  className="w-full justify-start text-[#cccccc] bg-[#1e1e1e] border-[#485063] hover:bg-[#2a2d2e]"
                >
                  Optimize database queries
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-start gap-2">
                  {msg.role === "assistant" ? (
                    <Image
                      src="/crowe-code-avatar.png"
                      alt="Crowe Code"
                      width={24}
                      height={24}
                      className="rounded-full mt-1"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#4a90e2] flex items-center justify-center text-white text-xs font-semibold mt-1">
                      U
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-[#cccccc] whitespace-pre-wrap">
                      {msg.content}
                      {msg.streaming && <span className="inline-block w-2 h-4 bg-[#4a90e2] ml-1 animate-pulse" />}
                    </p>
                    {msg.code && (
                      <div className="bg-[#0a0e14] border border-[#485063] rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e] border-b border-[#485063]">
                          <span className="text-xs text-[#858585] font-mono">{msg.language || "code"}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(msg.code!, idx)}
                              className="h-6 px-2 text-xs text-[#858585] hover:text-[#cccccc]"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleInsertCode(msg.code!)}
                              className="h-6 px-2 text-xs text-[#4a90e2] hover:text-[#61afef]"
                            >
                              Insert
                            </Button>
                          </div>
                        </div>
                        <pre className="p-3 text-xs text-[#61afef] font-mono overflow-x-auto">
                          <code>{msg.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-[#252526] border-t border-[#2d2d30]">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Crowe Code to generate, explain, or optimize code..."
            className="flex-1 bg-[#1e1e1e] border-[#3e3e42] text-[#e0e0e0] text-sm resize-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc] font-mono placeholder:text-[#6a6a6a]"
            rows={3}
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isGenerating}
            size="icon"
            className="bg-[#007acc] hover:bg-[#1084d8] text-white self-end h-10 w-10 shadow-lg disabled:opacity-40"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="text-[10px] text-[#6a6a6a] mt-2 flex items-center justify-between">
          <span>Press {typeof navigator !== 'undefined' && navigator.platform?.includes("Mac") ? "Cmd" : "Ctrl"}+Enter to send</span>
          <span className="font-mono tabular-nums">Powered by Claude 4.5 Sonnet</span>
        </div>
      </form>
    </div>
  )
}

export default CroweCodeChatPanel
