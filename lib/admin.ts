"use server"

import { createClient } from "@/lib/supabase/server"

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  // Check if user is admin in the users table
  const { data, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

  if (error || !data) {
    return false
  }

  return data.is_admin === true
}

export async function requireAdmin() {
  const admin = await isAdmin()

  if (!admin) {
    throw new Error("Unauthorized: Admin access required")
  }

  return true
}

export async function getAdminUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!data || !data.is_admin) {
    return null
  }

  return data
}
