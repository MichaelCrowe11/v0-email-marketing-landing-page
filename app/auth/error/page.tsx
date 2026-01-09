"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The sign-in link is no longer valid.",
    Default: "An error occurred during authentication.",
  }

  const errorMessage = errorMessages[error || "Default"] || errorMessages.Default

  return (
    <Card className="shadow-2xl border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-red-600">Authentication Error</CardTitle>
        <CardDescription className="text-center">{errorMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          {error === "Configuration" && "Please contact support if this problem persists."}
          {error === "AccessDenied" && "Please contact your administrator for access."}
          {error === "Verification" && "Please request a new sign-in link."}
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/login">Try Again</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  )
}
