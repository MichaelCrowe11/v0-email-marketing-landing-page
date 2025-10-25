"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { uploadProfilePicture } from "@/app/actions/profile"
import { useRouter } from "next/navigation"

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string | null
  userName: string
}

export function ProfilePictureUpload({ currentAvatarUrl, userName }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("avatar", file)

    const result = await uploadProfilePicture(formData)

    if (result.error) {
      setError(result.error)
    } else {
      router.refresh()
    }

    setIsUploading(false)
  }

  return (
    <div className="relative group">
      <Avatar className="w-24 h-24">
        <AvatarImage src={currentAvatarUrl || "/placeholder.svg"} />
        <AvatarFallback className="text-2xl">{userName[0] || "U"}</AvatarFallback>
      </Avatar>

      <label
        htmlFor="avatar-upload"
        className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Camera className="w-6 h-6 text-white" />
        )}
      </label>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      {error && <p className="absolute -bottom-6 left-0 text-xs text-destructive whitespace-nowrap">{error}</p>}
    </div>
  )
}
