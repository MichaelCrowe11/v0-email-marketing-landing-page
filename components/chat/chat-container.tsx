"use client"
import type { ReasoningStep } from "@/components/chat/chain-of-thought"

import { useChat } from "@ai-sdk/react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { createConversation, getMessages } from "@/lib/supabase/chat-queries"
import { ModelSelector } from "@/components/chat/model-selector"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"

function parseReasoning(text: string): { reasoning: ReasoningStep[]; content: string } {
  const reasoningMatch = text.match(/<reasoning>([\s\S]*?)<\/reasoning>/)

  if (!reasoningMatch) {
    return { reasoning: [], content: text }
  }

  const reasoningXml = reasoningMatch[1]
  const steps: ReasoningStep[] = []

  const stepRegex = /<step type="(research|analysis|synthesis|verification)">([\s\S]*?)<\/step>/g
  let match

  while ((match = stepRegex.exec(reasoningXml)) !== null) {
    steps.push({
      type: match[1] as ReasoningStep["type"],
      content: match[2] ? match[2].trim() : "",
    })
  }

  const content = text.replace(/<reasoning>[\s\S]*?<\/reasoning>/, "").trim()

  return { reasoning: steps, content }
}

function MagicalStreamingText({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text)
      return
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 15)

      return () => clearTimeout(timeout)
    }
  }, [text, currentIndex, isStreaming])

  useEffect(() => {
    setCurrentIndex(0)
    setDisplayedText("")
  }, [text])

  return (
    <>
      {displayedText.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-char-appear"
          style={{
            animationDelay: `${i * 15}ms`,
            animationFillMode: "backwards",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      {isStreaming && currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-amber-500 ml-0.5 animate-magical-cursor shadow-lg shadow-amber-500/70" />
      )}
    </>
  )
}

export function ChatContainer({ hasUnlimitedAccess = false }: { hasUnlimitedAccess?: boolean }) {
  const [selectedModel, setSelectedModel] = useState("openai/gpt-4o-mini")
  const [userId, setUserId] = useState<string | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  const chatHelpers = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
    onError: (error) => {
      console.error("[v0] Chat error:", error)
    },
  })

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = chatHelpers

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = messages.length === 0

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const autoResize = () => {
      textarea.style.height = "auto"
      const newHeight = Math.min(textarea.scrollHeight, 200)
      textarea.style.height = `${newHeight}px`
    }

    textarea.addEventListener("input", autoResize)
    return () => textarea.removeEventListener("input", autoResize)
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    if (setInput) {
      setInput(suggestion)
      setTimeout(() => {
        const form = textareaRef.current?.closest("form")
        if (form) form.requestSubmit()
      }, 50)
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
  }

  const handleNewConversation = async () => {
    if (!userId) return

    const conversation = await createConversation(userId, "New Chat")
    if (conversation) {
      setCurrentConversationId(conversation.id)
      setInput("") // Clear current input
    }
  }

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        // Create initial conversation if none exists
        if (!currentConversationId) {
          const conversation = await createConversation(user.id, "New Chat")
          if (conversation) {
            setCurrentConversationId(conversation.id)
          }
        }
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    async function loadConversationMessages() {
      if (!currentConversationId) return

      const messages = await getMessages(currentConversationId)
      if (messages.length > 0) {
        // Convert database messages to chat format
        const chatMessages = messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        }))
        setInput(chatMessages[chatMessages.length - 1].content || "")
      } else {
        setInput("")
      }
    }
    loadConversationMessages()
  }, [currentConversationId, setInput])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-border glass-panel">
        <div className="flex items-center gap-2 sm:gap-3">
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-foreground">Crowe Logic AI</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Deep Reasoning Research Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
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
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
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
                  Your deep reasoning scientific research assistant for complex problem-solving.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mt-6 sm:mt-8">
                {[
                  "Explain quantum entanglement",
                  "Solve a complex math problem",
                  "Analyze mycological research",
                  "Generate Python code for data analysis",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 sm:p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left text-sm text-foreground shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isEmpty && (
            <div className="space-y-8">
              {messages.map((message, index) => {
                const isAssistant = message.role === "assistant"
                const isLastMessage = index === messages.length - 1
                const isStreaming = isLastMessage && isLoading

                return (
                  <div key={message.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      {isAssistant ? (
                        <AIAvatarSwirl state={isStreaming ? "responding" : "idle"} size={40} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                          You
                        </div>
                      )}
                    </div>
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
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <AIAvatarSwirl state="thinking" size={40} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Thinking...</div>
                  </div>
                </div>
              )}
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
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  const form = e.currentTarget.closest("form")
                  if (form) form.requestSubmit()
                }
              }}
              placeholder="Ask about scientific research, code generation, problem-solving..."
              className="w-full min-h-[56px] sm:min-h-[60px] max-h-[200px] px-4 sm:px-5 py-3 sm:py-4 pr-16 glass-input rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 resize-none shadow-sm"
              rows={2}
              disabled={isLoading}
            />

            <button
              type="submit"
              className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              disabled={isLoading || !input?.trim()}
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
  )
}
