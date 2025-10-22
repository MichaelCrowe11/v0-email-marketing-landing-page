import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, MessageSquare, Calendar, Mail } from "lucide-react"
import SignOutButton from "@/components/sign-out-button"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: posts } = await supabase
    .from("forum_posts")
    .select("*, forum_categories(name, icon)")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Card className="glass shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {userData?.full_name?.[0] || user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{userData?.full_name || "User"}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {userData?.subscription_tier && (
                  <Badge variant="default" className="mt-3 bg-purple-600">
                    {userData.subscription_tier}
                  </Badge>
                )}
              </div>
              <SignOutButton />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  My Documents
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/documents/new">New</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <Link key={doc.id} href={`/documents/${doc.id}`}>
                      <div className="p-3 rounded-lg hover:bg-purple-50 transition-colors">
                        <h3 className="font-medium line-clamp-1">{doc.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                          <span>{doc.view_count || 0} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Button asChild variant="link" className="w-full">
                    <Link href="/documents">View All Documents</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-3">No documents yet</p>
                  <Button asChild size="sm">
                    <Link href="/documents/new">Create Your First Document</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  My Forum Posts
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/forum/new">New</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {posts && posts.length > 0 ? (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/forum/${post.id}`}>
                      <div className="p-3 rounded-lg hover:bg-purple-50 transition-colors">
                        <h3 className="font-medium line-clamp-1">{post.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>
                            {post.forum_categories?.icon} {post.forum_categories?.name}
                          </span>
                          <span>{post.view_count || 0} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Button asChild variant="link" className="w-full">
                    <Link href="/forum">View All Posts</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-3">No forum posts yet</p>
                  <Button asChild size="sm">
                    <Link href="/forum/new">Create Your First Post</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
