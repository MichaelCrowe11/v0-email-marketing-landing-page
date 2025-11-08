"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"

export default function LikeButton({
  postId,
  replyId,
  initialLikes,
  userId,
}: {
  postId?: string
  replyId?: string
  initialLikes: number
  userId?: string
}) {
  const router = useRouter()
  const [likes, setLikes] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (!userId) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("forum_likes").insert({
        user_id: userId,
        post_id: postId || null,
        reply_id: replyId || null,
      })

      if (error) throw error

      setLikes(likes + 1)
      router.refresh()
    } catch (err) {
      console.error("Failed to like:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLoading} className="gap-1">
      <ThumbsUp className="w-4 h-4" />
      <span>{likes}</span>
    </Button>
  )
}
