"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Error boundary caught:", error)
  }, [error])

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-6 animate-scale-in">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground">We encountered an unexpected error. Don't worry, your data is safe.</p>
        </div>

        {error.message && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-mono text-muted-foreground break-words">{error.message}</p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="outline">
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
