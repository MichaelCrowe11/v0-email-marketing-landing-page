"use client"
import type { ReasoningStep } from "@/components/chat/chain-of-thought"
import { useState, useEffect } from "react"
import { getUserSubscription } from "@/lib/subscription"
import { FeatureGate } from "@/components/feature-gate"
import { ChatContainer } from "@/components/chat/chat-container"

export default async function ChatPage() {
  const subscription = await getUserSubscription()
  const hasAccess = subscription.features.unlimited_chat

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <FeatureGate hasAccess={hasAccess} feature="Unlimited AI Chat" requiredTier="pro">
          <ChatContainer />
        </FeatureGate>
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
