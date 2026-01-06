"use client"

import { createClient } from '@/lib/azure/client'

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import AIReplyTrigger from "./ai-reply-trigger"

export default function ReplyForm({ postId, userId }: { postId: string; userId: string }) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAITrigger, setShowAITrigger] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("forum_replies").insert({
        post_id: postId,
        author_id: userId,
        content,
      })

      if (error) throw error

      // Check if @CroweLogic was mentioned
      if (content.toLowerCase().includes("@crowelogic")) {
        setShowAITrigger(true)
      } else {
        setContent("")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply")
    } finally {
      setIsLoading(false)
    }
  }

  if (showAITrigger) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-purple-300 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            You mentioned @CroweLogic! Would you like AI assistance?
          </p>
          <AIReplyTrigger
            postId={postId}
            content={content}
            onComplete={() => {
              setContent("")
              setShowAITrigger(false)
              router.refresh()
            }}
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            setContent("")
            setShowAITrigger(false)
            router.refresh()
          }}
        >
          Skip AI Response
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write your reply... (Mention @CroweLogic to get AI assistance)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        required
      />
      <p className="text-xs text-muted-foreground">
        💡 Tip: Type <span className="text-purple-400 font-mono">@CroweLogic</span> to get expert AI assistance from
        Michael Crowe's cultivation knowledge
      </p>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Posting..." : "Post Reply"}
      </Button>
    </form>
  )
}
