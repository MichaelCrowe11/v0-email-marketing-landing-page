import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Plus, Eye } from "lucide-react"

export default async function DocumentsPage() {
  const supabase = await createClient()

  const { data: documents } = await supabase
    .from("documents")
    .select(
      `
      *,
      users:author_id (full_name, avatar_url)
    `,
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const categories = ["Cultivation Guides", "Troubleshooting", "Species Info", "Equipment", "Recipes", "General"]

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3">Knowledge Base</h1>
            <p className="text-zinc-400 text-lg">Comprehensive guides and documentation for mushroom cultivation</p>
          </div>
          {user && (
            <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200">
              <Link href="/documents/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Document
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-zinc-900 border-zinc-800 text-zinc-300 px-4 py-2"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents?.map((doc) => (
            <Link key={doc.id} href={`/documents/${doc.id}`}>
              <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all duration-200 h-full group">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <FileText className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    <Badge variant="secondary" className="text-xs bg-zinc-900 text-zinc-300 border-0">
                      {doc.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 text-white group-hover:text-zinc-100">
                    {doc.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-zinc-400">
                    {doc.content.substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>{doc.users?.full_name || "Anonymous"}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{doc.view_count || 0}</span>
                    </div>
                  </div>
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {doc.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs border-zinc-800 text-zinc-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(!documents || documents.length === 0) && (
          <Card className="bg-zinc-950 border-zinc-800 text-center py-16">
            <CardContent>
              <FileText className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-white">No documents yet</h3>
              <p className="text-zinc-400 mb-6">Be the first to share your knowledge!</p>
              {user && (
                <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200">
                  <Link href="/documents/new">Create First Document</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
