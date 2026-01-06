"use client"

import { createClient } from '@/lib/azure/client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

export default function SignOutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
      <LogOut className="w-4 h-4 mr-2" />
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  )
}
