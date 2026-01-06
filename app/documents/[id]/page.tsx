import { createClient } from '@/lib/azure/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, Eye, Calendar } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Increment view count
  await supabase.rpc("increment_document_views", { document_id: id })

  const { data: document } = await supabase
    .from("documents")
    .select(
      `
      *,
      users:author_id (full_name, avatar_url)
    `,
    )
    .eq("id", id)
    .single()

  if (!document) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/documents">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Link>
        </Button>

        <Card className="glass shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{document.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{document.view_count || 0} views</span>
              </div>
            </div>

            <CardTitle className="text-3xl md:text-4xl text-balance">{document.title}</CardTitle>

            <div className="flex items-center gap-3 pt-4 border-t">
              <Avatar>
                <AvatarImage src={document.users?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{document.users?.full_name?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{document.users?.full_name || "Anonymous"}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(document.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {document.tags && document.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="prose prose-purple max-w-none">
            <div className="whitespace-pre-wrap text-pretty leading-relaxed">{document.content}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
