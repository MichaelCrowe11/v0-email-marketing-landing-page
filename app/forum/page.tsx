import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { MessageSquare, Plus, Eye, ThumbsUp, Clock, Search, TrendingUp, Users } from "lucide-react"

export default async function ForumPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("forum_posts_with_stats")
    .select("*")
    .order("last_activity", { ascending: false })
    .limit(50)

  const { data: categories } = await supabase.from("forum_categories").select("*").order("name")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const totalPosts = posts?.length || 0
  const totalReplies = posts?.reduce((sum, post) => sum + (post.reply_count || 0), 0) || 0
  const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950/20 via-background to-emerald-950/20">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent mb-3">
              Community Forum
            </h1>
            <p className="text-muted-foreground text-lg">
              Share tips, ask questions, and connect with fellow cultivators
            </p>
          </div>
          {user && (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg"
            >
              <Link href="/forum/new">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-800/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Discussions</p>
                  <p className="text-3xl font-bold text-amber-100">{totalPosts}</p>
                </div>
                <MessageSquare className="w-10 h-10 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-800/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Community Replies</p>
                  <p className="text-3xl font-bold text-emerald-100">{totalReplies}</p>
                </div>
                <Users className="w-10 h-10 text-emerald-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-800/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-blue-100">{totalViews.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search discussions, topics, or species..."
              className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border/50"
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Card
                key={category.id}
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-amber-500/50 hover:bg-card/80 transition-all duration-300 cursor-pointer group"
              >
                <CardHeader>
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <CardTitle className="text-lg group-hover:text-amber-200 transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-sm">{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Recent Discussions</h2>
          <div className="space-y-3">
            {posts?.map((post) => (
              <Link key={post.id} href={`/forum/${post.id}`}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-amber-500/50 hover:bg-card/80 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {post.is_pinned && (
                            <Badge className="bg-gradient-to-r from-amber-600 to-amber-500 text-white border-0">
                              📌 Pinned
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-border/50 bg-background/50">
                            {post.category_icon} {post.category_name}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-200 transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.content}</p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{post.author_name || "Anonymous"}</span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-semibold">{post.reply_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="font-semibold">{post.like_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-400">
                          <Eye className="w-4 h-4" />
                          <span className="font-semibold">{post.view_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {(!posts || posts.length === 0) && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 text-center py-16">
              <CardContent>
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">Start the conversation and share your cultivation journey!</p>
                {user && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white"
                  >
                    <Link href="/forum/new">Create First Post</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
