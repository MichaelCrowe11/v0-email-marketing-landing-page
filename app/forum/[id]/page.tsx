import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, Eye, Clock, MessageSquare } from "lucide-react"
import { notFound } from "next/navigation"
import ReplyForm from "@/components/reply-form"
import LikeButton from "@/components/like-button"

export default async function ForumPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Increment view count
  await supabase.rpc("increment_post_views", { post_id: id })

  const { data: post } = await supabase.from("forum_posts_with_stats").select("*").eq("id", id).single()

  if (!post) {
    notFound()
  }

  const { data: replies } = await supabase
    .from("forum_replies_with_stats")
    .select("*")
    .eq("post_id", id)
    .is("parent_reply_id", null)
    .order("created_at", { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/forum">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
        </Button>

        <Card className="glass shadow-2xl mb-6">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {post.is_pinned && (
                <Badge variant="default" className="bg-purple-600">
                  Pinned
                </Badge>
              )}
              <Badge variant="outline">
                {post.category_icon} {post.category_name}
              </Badge>
              <div className="flex items-center gap-3 text-sm text-muted-foreground ml-auto">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.reply_count || 0}</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-balance">{post.title}</h1>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.author_avatar || "/placeholder.svg"} />
                  <AvatarFallback>{post.author_name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author_name || "Anonymous"}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <LikeButton postId={post.id} initialLikes={post.like_count || 0} userId={user?.id} />
            </div>
          </CardHeader>

          <CardContent className="prose prose-purple max-w-none">
            <div className="whitespace-pre-wrap text-pretty leading-relaxed">{post.content}</div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold">Replies ({post.reply_count || 0})</h2>

          {replies?.map((reply) => (
            <Card key={reply.id} className="glass">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={reply.author_avatar || "/placeholder.svg"} />
                    <AvatarFallback>{reply.author_name?.[0] || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{reply.author_name || "Anonymous"}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reply.is_solution && <Badge variant="default">Solution</Badge>}
                        <LikeButton replyId={reply.id} initialLikes={reply.like_count || 0} userId={user?.id} />
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap text-pretty leading-relaxed">{reply.content}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {user ? (
          <Card className="glass">
            <CardHeader>
              <h3 className="text-xl font-semibold">Add a Reply</h3>
            </CardHeader>
            <CardContent>
              <ReplyForm postId={post.id} userId={user.id} />
            </CardContent>
          </Card>
        ) : (
          <Card className="glass text-center py-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">Sign in to reply to this post</p>
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
