"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
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
      console.log("[v0] Sending chat request")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
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
    const text = messages.map((m) => `${m.role === "user" ? "You" : "Crowe Logic Interface"}: ${m.content}`).join("\n\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportMarkdown = () => {
    const markdown = messages
      .map((m) => `### ${m.role === "user" ? "You" : "Crowe Logic Interface"}\n\n${m.content}\n`)
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
          <div className="px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between border-b border-border glass-panel">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon-sm" onClick={() => setShowSidebar(!showSidebar)} className="h-7 w-7">
                {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              <AIAvatarSwirl state="idle" size={36} />
              <div>
                <h1 className="text-sm font-bold text-foreground">
                  Crowe Logic Interface
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Neural Mycology Intelligence System</p>
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
                  <div className="relative">
                    {/* Dramatic glow rings */}
                    <div className="absolute inset-0 -m-16">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" style={{ animationDuration: "3s" }} />
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
                    </div>
                    <AIAvatarSwirl state="idle" size={160} />
                  </div>

                  <div className="text-center space-y-3 sm:space-y-4 max-w-3xl">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                        Crowe Logic Interface
                      </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light px-4">
                      Neural mycology intelligence powered by 20+ years of cultivation mastery
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/80">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Deep Reasoning</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span>Vision Analysis</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span>Code Generation</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-4xl mt-8 sm:mt-10 space-y-4">
                    <p className="text-center text-sm text-muted-foreground font-medium mb-4">
                      Choose your path to mycological mastery
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <button
                        onClick={() => handleSuggestionClick("Analyze this contamination and provide triage protocol with confidence levels")}
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/20 hover:border-red-500/50 transition-all text-left shadow-lg hover:shadow-red-500/20 hover:scale-105 transform duration-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-foreground mb-1">Contamination Triage</div>
                          <div className="text-xs text-muted-foreground">Vision-powered analysis</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Optimize substrate formula for Pleurotus ostreatus with yield predictions")}
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 hover:border-green-500/50 transition-all text-left shadow-lg hover:shadow-green-500/20 hover:scale-105 transform duration-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-foreground mb-1">Substrate Optimization</div>
                          <div className="text-xs text-muted-foreground">Formula engineering</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Generate production SOP for commercial oyster cultivation with safety protocols")}
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20 hover:border-blue-500/50 transition-all text-left shadow-lg hover:shadow-blue-500/20 hover:scale-105 transform duration-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="text-sm font-bold text-foreground mb-1">SOP Generation</div>
                          <div className="text-xs text-muted-foreground">Production protocols</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Write Python code to analyze growth data and predict harvest timing")}
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20 hover:border-purple-500/50 transition-all text-left shadow-lg hover:shadow-purple-500/20 hover:scale-105 transform duration-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Code className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="text-sm font-bold text-foreground mb-1">Code Generation</div>
                          <div className="text-xs text-muted-foreground">Analysis automation</div>
                        </div>
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
                    
                    // Determine avatar state based on streaming status
                    const hasContent = message.content.length > 0
                    const avatarState = isStreaming 
                      ? (hasContent ? "responding" : "thinking")  // "responding" when streaming content, "thinking" when waiting
                      : "idle"  // "idle" when message is complete

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
                            <div className="relative overflow-visible">
                              {/* Avatar zips around during streaming */}
                              {isAssistant && isStreaming && hasContent && (
                                <div className="absolute -left-24 -top-4 z-50 animate-pulse">
                                  <div className="animate-bounce">
                                    <AIAvatarSwirl state={avatarState} size={56} />
                                  </div>
                                </div>
                              )}
                              
                              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap relative z-10">
                                {message.content}
                                {isAssistant && !isStreaming && (
                                  <span className="inline-block align-middle ml-3 relative" style={{ minWidth: '56px', minHeight: '56px' }}>
                                    <AIAvatarSwirl state={avatarState} size={48} />
                                  </span>
                                )}
                                {isStreaming && (
                                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-foreground animate-pulse align-middle" />
                                )}
                              </div>
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
