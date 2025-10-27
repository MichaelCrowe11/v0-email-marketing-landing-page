"use server"

import { createClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadProfilePicture(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const file = formData.get("avatar") as File

  if (!file) {
    return { error: "No file provided" }
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be less than 5MB" }
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(`avatars/${user.id}-${Date.now()}.${file.name.split(".").pop()}`, file, {
      access: "public",
    })

    // Update user avatar_url in database
    const { error: updateError } = await supabase.from("users").update({ avatar_url: blob.url }).eq("id", user.id)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath("/profile")
    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Failed to upload image" }
  }
}
