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
import Image from "next/image"

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
  const isEmpty = messages.length === 0

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/crowe-logic-logo.png"
              alt="Crowe Logic"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">CROWELOGIC AI</h1>
            <p className="text-xs text-muted-foreground">Expert Cultivation Assistant</p>
          </div>
        </div>
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

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] space-y-8">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-xl">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    <Image
                      src="/crowe-logic-logo.png"
                      alt="Crowe Logic AI"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

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
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md">
                          <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                            <Image
                              src="/crowe-logic-logo.png"
                              alt="Crowe Logic AI"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                          You
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      {isAssistant && reasoning.length > 0 && <ChainOfThought steps={reasoning} />}
                      <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</div>
                    </div>
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 animate-pulse shadow-md">
                      <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                        <Image
                          src="/crowe-logic-logo.png"
                          alt="Crowe Logic AI"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
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

      <div className="border-t border-border bg-card/50 backdrop-blur-xl">
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
    </div>
  )
}
