import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, Eye, Clock, MessageSquare, Award } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-950/20 via-background to-emerald-950/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 hover:bg-amber-500/10">
          <Link href="/forum">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Link>
        </Button>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl mb-6">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {post.is_pinned && (
                <Badge className="bg-gradient-to-r from-amber-600 to-amber-500 text-white border-0">📌 Pinned</Badge>
              )}
              <Badge variant="outline" className="border-border/50 bg-background/50">
                {post.category_icon} {post.category_name}
              </Badge>
              <div className="flex items-center gap-3 text-sm text-muted-foreground ml-auto">
                <div className="flex items-center gap-1 text-blue-400">
                  <Eye className="w-4 h-4" />
                  <span className="font-semibold">{post.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-semibold">{post.reply_count || 0}</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-balance bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
              {post.title}
            </h1>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="ring-2 ring-amber-500/20">
                  <AvatarImage src={post.author_avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-600 to-amber-500 text-white">
                    {post.author_name?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{post.author_name || "Anonymous"}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <LikeButton postId={post.id} initialLikes={post.like_count || 0} userId={user?.id} />
            </div>
          </CardHeader>

          <CardContent className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-pretty leading-relaxed text-foreground">{post.content}</div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-500" />
            Replies ({post.reply_count || 0})
          </h2>

          {replies?.map((reply) => (
            <Card
              key={reply.id}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-emerald-500/30 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="ring-2 ring-emerald-500/20">
                    <AvatarImage src={reply.author_avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white">
                      {reply.author_name?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{reply.author_name || "Anonymous"}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reply.is_solution && (
                          <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-0">
                            <Award className="w-3 h-3 mr-1" />
                            Solution
                          </Badge>
                        )}
                        <LikeButton replyId={reply.id} initialLikes={reply.like_count || 0} userId={user?.id} />
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap text-pretty leading-relaxed text-foreground">
                      {reply.content}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {user ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <h3 className="text-xl font-semibold">Add Your Reply</h3>
            </CardHeader>
            <CardContent>
              <ReplyForm postId={post.id} userId={user.id} />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 text-center py-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
              <Button
                asChild
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
