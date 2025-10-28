"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ModelSelector } from "@/components/chat/model-selector"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { ChatCanvas } from "@/components/chat/chat-canvas"
import { ConversationHistory } from "@/components/chat/conversation-history"
import { Button } from "@/components/ui/button"
import { FileText, Code, Download, Copy, Check, Maximize2, Menu, X } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatContainer({ hasUnlimitedAccess = false }: { hasUnlimitedAccess?: boolean }) {
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4o-mini")
  const [copied, setCopied] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [canvasContent, setCanvasContent] = useState<{
    content: string
    type: "code" | "document"
    language?: string
  } | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = messages.length === 0

  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      const lastMessage = messages[messages.length - 1]
      saveMessage(lastMessage)
    }
  }, [messages, currentConversationId])

  const saveMessage = async (message: Message) => {
    if (!currentConversationId) return

    try {
      await fetch(`/api/conversations/${currentConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: message.role,
          content: message.content,
        }),
      })
    } catch (error) {
      console.error("[v0] Error saving message:", error)
    }
  }

  const createNewConversation = async (firstMessage?: string) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: firstMessage ? firstMessage.slice(0, 50) + "..." : "New Conversation",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentConversationId(data.conversation.id)
        return data.conversation.id
      }
    } catch (error) {
      console.error("[v0] Error creating conversation:", error)
    }
    return null
  }

  const loadConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(
          data.messages.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          })),
        )
        setCurrentConversationId(id)
        setShowSidebar(false)
      }
    } catch (error) {
      console.error("[v0] Error loading conversation:", error)
    }
  }

  const handleNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setShowSidebar(false)
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    let conversationId = currentConversationId
    if (!conversationId) {
      conversationId = await createNewConversation(text)
      if (!conversationId) {
        console.error("[v0] Failed to create conversation")
        return
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const assistantMessageId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      },
    ])

    try {
      console.log("[v0] Sending chat request with model:", selectedModel)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      })

      console.log("[v0] Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error response:", errorText)
        throw new Error(`Chat request failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      let accumulatedText = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter((line) => line.trim() !== "")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)

            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content

              if (content) {
                accumulatedText += content

                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMessageId ? { ...m, content: accumulatedText } : m)),
                )
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      console.log("[v0] Streaming complete, total length:", accumulatedText.length)
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
              }
            : m,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setTimeout(() => {
      sendMessage(suggestion)
      setInputValue("")
    }, 50)
  }

  const handleCopyConversation = async () => {
    const text = messages.map((m) => `${m.role === "user" ? "You" : "Crowe Logic AI"}: ${m.content}`).join("\n\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportMarkdown = () => {
    const markdown = messages
      .map((m) => `### ${m.role === "user" ? "You" : "Crowe Logic AI"}\n\n${m.content}\n`)
      .join("\n")

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `crowe-logic-conversation-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    sendMessage(inputValue)
    setInputValue("")
  }

  const handleOpenCanvas = (content: string, type: "code" | "document", language?: string) => {
    setCanvasContent({ content, type, language })
  }

  return (
    <>
      <div className="h-full flex">
        {showSidebar && (
          <div className="w-64 lg:w-80 flex-shrink-0">
            <ConversationHistory
              currentConversationId={currentConversationId}
              onSelectConversation={loadConversation}
              onNewConversation={handleNewConversation}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-border glass-panel">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon-sm" onClick={() => setShowSidebar(!showSidebar)} className="h-8 w-8">
                {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              <AIAvatarSwirl state="idle" size={40} />
              <div>
                <h1 className="text-sm sm:text-base font-semibold text-foreground">Crowe Logic AI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Deep Reasoning Research Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {!isEmpty && (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={handleCopyConversation} className="h-8 w-8">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={handleExportMarkdown} className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Home
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-12">
              {isEmpty && (
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] space-y-6 sm:space-y-8 px-4">
                  <AIAvatarSwirl state="idle" size={128} />

                  <div className="text-center space-y-2 sm:space-y-3 max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                      Welcome to <span className="font-semibold">Crowe Logic AI</span>
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light px-4">
                      Your deep reasoning scientific research assistant for complex problem-solving, document
                      generation, and code creation.
                    </p>
                  </div>

                  <div className="w-full max-w-3xl mt-6 sm:mt-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSuggestionClick("Generate a detailed SOP for laboratory safety protocols")}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left shadow-sm group"
                      >
                        <FileText className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="text-sm font-medium text-foreground">Generate SOP</div>
                        <div className="text-xs text-muted-foreground mt-1">Create standard operating procedures</div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Write Python code to analyze mycological growth data")}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left shadow-sm group"
                      >
                        <Code className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="text-sm font-medium text-foreground">Generate Code</div>
                        <div className="text-xs text-muted-foreground mt-1">Create analysis scripts and tools</div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Explain the biochemistry of fungal cell wall synthesis")}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left shadow-sm group"
                      >
                        <svg
                          className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <div className="text-sm font-medium text-foreground">Scientific Research</div>
                        <div className="text-xs text-muted-foreground mt-1">Deep mycological analysis</div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Solve this differential equation: dy/dx = x^2 + y")}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left shadow-sm group"
                      >
                        <svg
                          className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="text-sm font-medium text-foreground">Problem Solving</div>
                        <div className="text-xs text-muted-foreground mt-1">Complex mathematical reasoning</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isEmpty && (
                <div className="space-y-8">
                  {messages.map((message, index) => {
                    const isAssistant = message.role === "assistant"
                    const isLastMessage = index === messages.length - 1
                    const isStreaming = isLastMessage && isLoading && isAssistant

                    // Detect if message contains code or document
                    const hasCode = message.content.includes("```")
                    const isDocument = message.content.length > 500 && !hasCode

                    return (
                      <div key={message.id} className="flex gap-4">
                        {!isAssistant && (
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                              You
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <div
                            className={`rounded-2xl px-5 py-4 shadow-sm ${
                              isAssistant
                                ? "bg-card border border-border"
                                : "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50"
                            }`}
                          >
                            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                              {message.content}
                              {isAssistant && (
                                <span className="inline-block align-middle ml-3">
                                  <AIAvatarSwirl state={isStreaming ? "thinking" : "idle"} size={32} />
                                </span>
                              )}
                              {isStreaming && (
                                <span className="inline-block w-1.5 h-4 ml-0.5 bg-foreground animate-pulse align-middle" />
                              )}
                            </div>

                            {/* Canvas buttons for code/documents */}
                            {isAssistant && !isStreaming && (hasCode || isDocument) && (
                              <div className="mt-4 flex gap-2">
                                {hasCode && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const codeMatch = message.content.match(/```(\w+)?\n([\s\S]*?)```/)
                                      const code = codeMatch ? codeMatch[2] : message.content
                                      const lang = codeMatch ? codeMatch[1] || "typescript" : "typescript"
                                      handleOpenCanvas(code, "code", lang)
                                    }}
                                    className="gap-2"
                                  >
                                    <Maximize2 className="w-3 h-3" />
                                    Open in Code Canvas
                                  </Button>
                                )}
                                {isDocument && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenCanvas(message.content, "document")}
                                    className="gap-2"
                                  >
                                    <Maximize2 className="w-3 h-3" />
                                    Open in Document Canvas
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border glass-panel">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  placeholder="Ask about scientific research, generate SOPs, create code, solve problems..."
                  className="w-full min-h-[56px] sm:min-h-[60px] max-h-[200px] px-4 sm:px-5 py-3 sm:py-4 pr-16 glass-input rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 resize-none shadow-sm"
                  rows={2}
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={isLoading || !inputValue?.trim()}
                >
                  {isLoading ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path d="m5 12 7-7 7 7" />
                      <path d="M12 19V5" />
                    </svg>
                  )}
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Modal */}
      {canvasContent && (
        <ChatCanvas
          content={canvasContent.content}
          type={canvasContent.type}
          language={canvasContent.language}
          onClose={() => setCanvasContent(null)}
        />
      )}
    </>
  )
}
