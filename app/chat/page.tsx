"use client"

import type React from "react"
import type { ReasoningStep } from "@/components/chat/chain-of-thought" // Declare ReasoningStep here

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState, useEffect } from "react"
import { ChainOfThought } from "@/components/chat/chain-of-thought"
import { AIAvatar } from "@/components/chat/ai-avatar"
import { SubstrateCalculator } from "@/components/chat/substrate-calculator"
import { StrainDatabase } from "@/components/chat/strain-database"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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

  return { reasoning: steps, content } // Fix the undeclared variable reasoning
}

function ChatContainer() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const [input, setInput] = useState("")
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set())
  const [activeToolDialog, setActiveToolDialog] = useState<"substrate" | "strain" | null>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "in_progress") return

    sendMessage({ text: input })
    setInput("")
  }

  const isLoading = status === "in_progress"

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <AIAvatar state="idle" />
              <div>
                <h1 className="text-sm font-semibold text-foreground">Crowe Logic AI</h1>
                <p className="text-xs text-foreground/60">Expert Mycology Assistant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <AIAvatar state="idle" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm text-foreground/90 leading-relaxed">
                    <p className="mb-3">
                      Hello! I'm Crowe Logic AI, your expert mycology assistant powered by 20+ years of professional
                      cultivation experience.
                    </p>
                    <p className="mb-3">I can help you with:</p>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80">
                      <li>Substrate formulation and optimization</li>
                      <li>Contamination identification and prevention</li>
                      <li>Environmental parameter guidance</li>
                      <li>Strain selection and characteristics</li>
                      <li>Troubleshooting cultivation issues</li>
                    </ul>
                    <p className="mt-3">What would you like to know about mushroom cultivation?</p>
                  </div>
                </div>
              </div>
            )}

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
              const avatarState = isAssistant
                ? isCompleted
                  ? "completed"
                  : isLastMessage && isLoading
                    ? "streaming"
                    : "idle"
                : undefined

              return (
                <div key={message.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    {isAssistant ? (
                      <AIAvatar state={avatarState!} />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                        You
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {isAssistant && reasoning.length > 0 && <ChainOfThought steps={reasoning} />}
                    <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{content}</div>
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <AIAvatar state="thinking" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-foreground/60">Thinking...</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveToolDialog("substrate")}
                className="h-8 text-xs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 mr-1.5"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
                Substrate Calculator
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveToolDialog("strain")} className="h-8 text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 mr-1.5"
                >
                  <path d="M12 2v20M2 12h20" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                Strain Database
              </Button>
            </div>

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
                placeholder="Ask about substrate ratios, contamination, environmental conditions..."
                className="w-full min-h-[60px] max-h-[200px] px-4 py-3 pr-12 bg-background border border-border/50 rounded-xl text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-3 bottom-3 h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
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
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              </button>
            </form>
            <p className="text-xs text-foreground/50 mt-2 text-center">
              Crowe Logic AI can make mistakes. Verify critical cultivation decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Tool Dialogs */}
      <Dialog open={activeToolDialog === "substrate"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Substrate Calculator</DialogTitle>
          </DialogHeader>
          <SubstrateCalculator />
        </DialogContent>
      </Dialog>

      <Dialog open={activeToolDialog === "strain"} onOpenChange={() => setActiveToolDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Strain Database</DialogTitle>
          </DialogHeader>
          <StrainDatabase />
        </DialogContent>
      </Dialog>
    </div>
  )
}
