"use client"

import type React from "react"
import type { ReasoningStep } from "@/components/chat/chain-of-thought"

import { useChat } from "@ai-sdk/react"
import { useState, useEffect, useRef } from "react"
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
import { createConversation } from "@/lib/supabase/chat-queries"
import { ConversationHistory } from "@/components/chat/conversation-history"
import { ModelSelector } from "@/components/chat/model-selector"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { WorkflowTerminal } from "@/components/chat/workflow-terminal"
import { BrowserResearchPanel } from "@/components/chat/browser-research-panel"
import { VoiceChatButton } from "@/components/chat/voice-chat-button"
import { saveMessage } from "@/lib/supabase/chat-queries" // Declare the saveMessage function

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
  const [selectedModel, setSelectedModel] = useState("azure/crowelogic")
  const [userId, setUserId] = useState<string | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  const { messages, input, handleSubmit, handleInputChange, status, setMessages, error } = useChat({
    api: "/api/chat",
    body: { model: selectedModel },
    onError: (error) => {
      console.error("[v0] Chat error:", error)
    },
    onFinish: async (message) => {
      // Save message to database after completion
      if (userId && currentConversationId) {
        await saveMessage(currentConversationId, "assistant", message.content)
      }
    },
  })

  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set())
  const [activeToolDialog, setActiveToolDialog] = useState<"substrate" | "strain" | "environment" | "yield" | null>(
    null,
  )
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [canvasContent, setCanvasContent] = useState("")
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isWorkflowTerminalOpen, setIsWorkflowTerminalOpen] = useState(false)
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([])
  const [isBrowserResearchActive, setIsBrowserResearchActive] = useState(false)
  const [researchQuery, setResearchQuery] = useState("")

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
  }

  const handleNewConversation = async (title: string) => {
    if (!userId) return

    const conversation = await createConversation(userId, title)
    if (conversation) {
      setCurrentConversationId(conversation.id)
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    const syntheticEvent = {
      target: { value: transcript },
    } as React.ChangeEvent<HTMLTextAreaElement>
    handleInputChange(syntheticEvent)
    setTimeout(() => {
      if (textareaRef.current) {
        const form = textareaRef.current.closest("form")
        if (form) form.requestSubmit()
      }
    }, 50)
  }

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

  const handleSuggestionClick = (suggestion: string) => {
    const syntheticEvent = {
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLTextAreaElement>

    handleInputChange(syntheticEvent)

    setTimeout(() => {
      if (textareaRef.current) {
        const form = textareaRef.current.closest("form")
        if (form) form.requestSubmit()
      }
    }, 50)
  }

  const isLoading = status === "in_progress"
  const isEmpty = messages.length === 0

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-border glass-panel">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle conversation history"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-foreground">Crowe Logic AI</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Expert Cultivation Assistant</p>
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
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
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
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] space-y-6 sm:space-y-8 px-4">
              <AIAvatarSwirl state="idle" size={typeof window !== "undefined" && window.innerWidth < 640 ? 96 : 128} />

              <div className="text-center space-y-2 sm:space-y-3 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                  Welcome to <span className="font-semibold">Crowe Logic AI</span>
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light px-4">
                  Your expert cultivation assistant powered by years of commercial growing experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mt-6 sm:mt-8">
                {[
                  "How do I identify contamination?",
                  "Optimal conditions for lion's mane?",
                  "How to increase yields by 40%?",
                  "Best substrate for oyster mushrooms?",
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

                if (
                  isStreaming &&
                  (content.toLowerCase().includes("research") ||
                    content.toLowerCase().includes("look up") ||
                    content.toLowerCase().includes("find information") ||
                    content.toLowerCase().includes("search for"))
                ) {
                  if (!isBrowserResearchActive) {
                    const queryMatch = content.match(/research|look up|find information about|search for\s+(.+?)[.,?]/i)
                    if (queryMatch) {
                      setResearchQuery(queryMatch[1] || textContent.slice(0, 100))
                      setIsBrowserResearchActive(true)
                    }
                  }
                }

                if (isStreaming && (content.includes("SOP") || content.includes("batch") || content.includes("log"))) {
                  if (!isWorkflowTerminalOpen) {
                    setIsWorkflowTerminalOpen(true)
                    setWorkflowLogs([
                      "[v0] Initializing workflow engine...",
                      "[v0] Loading cultivation protocols...",
                      "[v0] Analyzing request parameters...",
                    ])
                  }
                }

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

              {isBrowserResearchActive && (
                <BrowserResearchPanel
                  isActive={isBrowserResearchActive}
                  query={researchQuery}
                  onComplete={(result) => {
                    setIsBrowserResearchActive(false)
                    console.log("[v0] Research complete:", result)
                  }}
                />
              )}

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
              placeholder="Ask about cultivation techniques, contamination, yields..."
              className="w-full min-h-[56px] sm:min-h-[60px] max-h-[200px] px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 glass-input rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 resize-none shadow-sm"
              rows={2}
              disabled={isLoading}
            />
            <div className="absolute right-14 sm:right-16 bottom-2 sm:bottom-3">
              <VoiceChatButton onTranscript={handleVoiceTranscript} disabled={isLoading} />
            </div>
            <button
              type="submit"
              className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M19 12V5" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
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

      <DebugPanel messages={messages} status={status} lastRequest={null} lastResponse={null} />
      <Canvas isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)} initialContent={canvasContent} />
      <IntegrationsPanel isOpen={isIntegrationsOpen} onClose={() => setIsIntegrationsOpen(false)} />
      <WorkflowTerminal
        isOpen={isWorkflowTerminalOpen}
        onClose={() => setIsWorkflowTerminalOpen(false)}
        logs={workflowLogs}
      />
    </div>
  )
}
