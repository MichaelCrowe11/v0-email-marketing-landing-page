import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ForumPostForm from "@/components/forum-post-form"

export default async function NewForumPostPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: categories } = await supabase.from("forum_categories").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-balance">Create New Post</h1>
        <ForumPostForm userId={user.id} categories={categories || []} />
      </div>
    </div>
  )
}
