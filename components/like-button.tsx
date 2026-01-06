"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
      toast.error("Please sign in to like posts")
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

      if (error) {
        // Check if already liked
        if (error.code === "23505") {
          toast.info("You've already liked this")
        } else {
          throw error
        }
      } else {
        setLikes(likes + 1)
        toast.success("Liked!")
        router.refresh()
      }
    } catch (err) {
      console.error("Failed to like:", err)
      toast.error("Failed to like. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLoading} className="gap-1">
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ThumbsUp className="w-4 h-4" />
      )}
      <span>{isLoading ? "..." : likes}</span>
    </Button>
  )
}
