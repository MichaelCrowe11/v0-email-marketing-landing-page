import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Plus, Eye, ThumbsUp, Clock } from "lucide-react"

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3">Community Forum</h1>
            <p className="text-zinc-400 text-lg">Share tips, ask questions, and connect with fellow cultivators</p>
          </div>
          {user && (
            <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200">
              <Link href="/forum/new">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories?.map((category) => (
            <Card
              key={category.id}
              className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <CardHeader>
                <div className="text-3xl mb-3">{category.icon}</div>
                <CardTitle className="text-lg text-white group-hover:text-zinc-100">{category.name}</CardTitle>
                <CardDescription className="text-sm text-zinc-400">{category.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          {posts?.map((post) => (
            <Link key={post.id} href={`/forum/${post.id}`}>
              <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        {post.is_pinned && <Badge className="bg-white text-black">Pinned</Badge>}
                        <Badge variant="outline" className="border-zinc-800 text-zinc-400">
                          {post.category_icon} {post.category_name}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-zinc-100 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{post.content}</p>
                      <div className="flex items-center gap-6 text-sm text-zinc-500">
                        <span className="font-medium">{post.author_name || "Anonymous"}</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 text-sm text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.reply_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.like_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{post.view_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(!posts || posts.length === 0) && (
          <Card className="bg-zinc-950 border-zinc-800 text-center py-16">
            <CardContent>
              <MessageSquare className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-white">No posts yet</h3>
              <p className="text-zinc-400 mb-6">Start the conversation!</p>
              {user && (
                <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200">
                  <Link href="/forum/new">Create First Post</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
