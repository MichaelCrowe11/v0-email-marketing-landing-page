"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"
import AIAvatar from "./ai-avatar"

interface AIReplyTriggerProps {
  postId: string
  replyId?: string
  content: string
  onComplete?: () => void
}

export default function AIReplyTrigger({ postId, replyId, content, onComplete }: AIReplyTriggerProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [status, setStatus] = useState<"idle" | "thinking" | "streaming" | "done">("idle")
  const [aiResponse, setAiResponse] = useState("")

  const handleAIReply = async () => {
    setIsStreaming(true)
    setStatus("thinking")
    setAiResponse("")

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, replyId, content }),
      })

      if (!response.ok) throw new Error("Failed to get AI response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No reader available")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6))

            if (data.type === "status") {
              setStatus(data.status)
            } else if (data.type === "content") {
              setAiResponse((prev) => prev + data.content)
            } else if (data.type === "complete") {
              setStatus("done")
              setTimeout(() => {
                setIsStreaming(false)
                onComplete?.()
              }, 1000)
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] AI reply error:", error)
      setIsStreaming(false)
      setStatus("idle")
    }
  }

  if (isStreaming) {
    return (
      <Card className="bg-gradient-to-br from-purple-950/40 to-pink-950/20 border-purple-500/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AIAvatar status={status} size="md" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-purple-200">CroweLogic AI</p>
                {status === "thinking" && (
                  <span className="text-xs text-purple-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Thinking...
                  </span>
                )}
                {status === "streaming" && (
                  <span className="text-xs text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    Responding...
                  </span>
                )}
              </div>
              <div className="text-foreground whitespace-pre-wrap">
                {aiResponse}
                {status === "streaming" && <span className="animate-pulse">▊</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button
      onClick={handleAIReply}
      variant="outline"
      size="sm"
      className="border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 text-purple-300 bg-transparent"
    >
      <Sparkles className="w-4 h-4 mr-2" />
      Ask @CroweLogic AI
    </Button>
  )
}
