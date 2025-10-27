import { createClient } from "@/lib/supabase/server"

export async function isAdmin(userId?: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    // If no userId provided, get current user
    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return false
      userId = user.id
    }

    // Check if user is admin
    const { data, error } = await supabase.from("users").select("is_admin, email").eq("id", userId).single()

    if (error) {
      console.error("[v0] Admin check error:", error)
      return false
    }

    console.log("[v0] Admin check for:", data?.email, "is_admin:", data?.is_admin)
    return data?.is_admin === true
  } catch (error) {
    console.error("[v0] Admin check exception:", error)
    return false
  }
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error("Admin access required")
  }
  return true
}
