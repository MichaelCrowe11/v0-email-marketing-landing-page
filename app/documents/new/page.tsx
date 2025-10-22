import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DocumentForm from "@/components/document-form"

export default async function NewDocumentPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-balance">Create New Document</h1>
        <DocumentForm userId={user.id} />
      </div>
    </div>
  )
}
