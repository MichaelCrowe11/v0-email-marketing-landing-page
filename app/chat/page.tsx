"use client"

import type React from "react"
import type { ReasoningStep } from "@/components/chat/chain-of-thought"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState, useEffect } from "react"
import { ChainOfThought } from "@/components/chat/chain-of-thought"
import { SubstrateCalculator } from "@/components/chat/substrate-calculator"
import { StrainDatabase } from "@/components/chat/strain-database"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { DebugPanel } from "@/components/chat/debug-panel"
import { Canvas } from "@/components/chat/canvas"
import { EnvironmentMonitor } from "@/components/chat/environment-monitor"
import { YieldCalculator } from "@/components/chat/yield-calculator"
import { IntegrationsPanel } from "@/components/chat/integrations-panel"
import { createClient } from "@/lib/supabase/client"
import { createConversation, saveMessage, getMessages } from "@/lib/supabase/chat-queries"
import { ConversationHistory } from "@/components/chat/conversation-history"
import { ModelSelector } from "@/components/chat/model-selector"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <ChatContainer />
      </div>
    </div>
  )
}

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
      content: match[2].trim(),
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
      }, 15) // Fast, magical typing speed

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

function ChatContainer() {
  const [selectedModel, setSelectedModel] = useState("openai/gpt-5")
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    body: { model: selectedModel },
  })

  const [input, setInput] = useState("")
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set())
  const [activeToolDialog, setActiveToolDialog] = useState<"substrate" | "strain" | "environment" | "yield" | null>(
    null,
  )
  const [lastRequest, setLastRequest] = useState<any>(null)
  const [lastResponse, setLastResponse] = useState<any>(null)
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [canvasContent, setCanvasContent] = useState("")
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    async function persistMessage() {
      if (!userId || !currentConversationId || messages.length === 0) return

      const lastMessage = messages[messages.length - 1]
      const textContent = lastMessage.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("")

      await saveMessage(currentConversationId, lastMessage.role as "user" | "assistant", textContent)
    }

    if (status === "awaiting_message") {
      persistMessage()
    }
  }, [messages, status, userId, currentConversationId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "in_progress") return

    if (!currentConversationId && userId) {
      const title = input.slice(0, 50) + (input.length > 50 ? "..." : "")
      const conversation = await createConversation(userId, title)
      if (conversation) {
        setCurrentConversationId(conversation.id)
      }
    }

    const requestData = {
      text: input,
      timestamp: new Date().toISOString(),
      messageCount: messages.length,
    }
    setLastRequest(requestData)

    sendMessage({ text: input })
    setInput("")
  }

  useEffect(() => {
    if (status === "awaiting_message" && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant" && !completedMessages.has(lastMessage.id)) {
        setCompletedMessages((prev) => new Set(prev).add(lastMessage.id))
        setTimeout(() => {
          setCompletedMessages((prev) => {
            const next = new Set(prev)
            next.delete(lastMessage.id)
            return next
          })
        }, 400)
      }
    }
  }, [status, messages, completedMessages])

  const isLoading = status === "in_progress"
  const isEmpty = messages.length === 0

  async function handleSelectConversation(conversationId: string) {
    const dbMessages = await getMessages(conversationId)
    const formattedMessages = dbMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      parts: [{ type: "text" as const, text: msg.content }],
    }))
    setMessages(formattedMessages)
    setCurrentConversationId(conversationId)
    setIsHistoryOpen(false)
  }

  function handleNewConversation() {
    setMessages([])
    setCurrentConversationId(null)
    setIsHistoryOpen(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>
          <AIAvatarSwirl state={isLoading ? "thinking" : "idle"} size={40} />
          <div>
            <h1 className="text-base font-semibold text-foreground">CROWELOGIC AI</h1>
            <p className="text-xs text-muted-foreground">Expert Cultivation Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          <button
            onClick={() => setIsIntegrationsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
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
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" x2="12" y1="2" y2="15" />
            </svg>
            Integrations
          </button>
          <button
            onClick={() => setIsCanvasOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
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
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            Canvas
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {isHistoryOpen && (
        <div className="absolute left-0 top-[73px] bottom-0 w-64 bg-card border-r border-border z-50 shadow-lg">
          <ConversationHistory
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] space-y-8">
              <AIAvatarSwirl state="idle" size={128} />

              <div className="text-center space-y-3 max-w-2xl">
                <h2 className="text-3xl font-bold text-foreground">Welcome to CROWELOGIC AI</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Your expert cultivation assistant powered by years of commercial growing experience. Ask me anything
                  about mushroom cultivation, contamination, yields, or scaling operations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-8">
                {[
                  "How do I identify contamination in my cultures?",
                  "What are optimal conditions for lion's mane?",
                  "How can I increase my yields by 40%?",
                  "What's the best substrate recipe for oyster mushrooms?",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(suggestion)
                      sendMessage({ text: suggestion })
                    }}
                    className="p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all text-left text-sm text-foreground shadow-sm"
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
                const textContent = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("")

                const { reasoning, content } = isAssistant
                  ? parseReasoning(textContent)
                  : { reasoning: [], content: textContent }

                const isLastMessage = index === messages.length - 1
                const isCompleted = completedMessages.has(message.id)
                const isStreaming = isLastMessage && isLoading

                const avatarState: "idle" | "thinking" | "responding" =
                  isStreaming && reasoning.length > 0 ? "thinking" : isStreaming ? "responding" : "idle"

                return (
                  <div key={message.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      {isAssistant ? (
                        <AIAvatarSwirl state={avatarState} size={40} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                          You
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      {isAssistant && reasoning.length > 0 && <ChainOfThought steps={reasoning} />}
                      <div
                        className={`rounded-2xl px-5 py-4 shadow-sm ${
                          isAssistant
                            ? "bg-card border border-border"
                            : "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/50"
                        }`}
                      >
                        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {isStreaming ? (
                            <MagicalStreamingText text={content} isStreaming={true} />
                          ) : (
                            <span>{content}</span>
                          )}
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
                    <div className="text-sm text-muted-foreground relative inline-block">
                      <span className="relative z-10 font-medium">Consciousness awakening...</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent animate-wisdom-shimmer blur-sm" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveToolDialog("substrate")}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              Substrate Calculator
            </button>
            <button
              onClick={() => setActiveToolDialog("strain")}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
              Strain Database
            </button>
            <button
              onClick={() => setActiveToolDialog("environment")}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
              </svg>
              Environment Monitor
            </button>
            <button
              onClick={() => setActiveToolDialog("yield")}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M16 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Yield Calculator
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-6">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Ask about cultivation techniques, contamination, yields, or anything else..."
              className="w-full min-h-[60px] max-h-[200px] px-5 py-4 pr-14 bg-background border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none shadow-sm"
              rows={2}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-3 bottom-3 h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              disabled={isLoading || !input.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <Dialog open={activeToolDialog === "substrate"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Substrate Calculator</DialogTitle>
          </DialogHeader>
          <SubstrateCalculator />
        </DialogContent>
      </Dialog>

      <Dialog open={activeToolDialog === "strain"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Strain Database</DialogTitle>
          </DialogHeader>
          <StrainDatabase />
        </DialogContent>
      </Dialog>

      <Dialog open={activeToolDialog === "environment"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Environment Monitor</DialogTitle>
          </DialogHeader>
          <EnvironmentMonitor />
        </DialogContent>
      </Dialog>

      <Dialog open={activeToolDialog === "yield"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Yield Calculator</DialogTitle>
          </DialogHeader>
          <YieldCalculator />
        </DialogContent>
      </Dialog>

      <DebugPanel messages={messages} status={status} lastRequest={lastRequest} lastResponse={lastResponse} />
      <Canvas isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)} initialContent={canvasContent} />
      <IntegrationsPanel isOpen={isIntegrationsOpen} onClose={() => setIsIntegrationsOpen(false)} />
    </div>
  )
}
