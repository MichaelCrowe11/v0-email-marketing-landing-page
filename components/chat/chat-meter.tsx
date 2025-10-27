"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ChatMeterProps {
  initialQuota: number
  initialUsed: number
  initialResetAt: string
}

export function ChatMeter({ initialQuota, initialUsed, initialResetAt }: ChatMeterProps) {
  const [remaining, setRemaining] = useState(initialQuota - initialUsed)
  const [resetAt, setResetAt] = useState(new Date(initialResetAt))
  const [timeUntilReset, setTimeUntilReset] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = resetAt.getTime() - now.getTime()

      if (diff <= 0) {
        setRemaining(initialQuota)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        setResetAt(tomorrow)
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeUntilReset(`${hours}h ${minutes}m`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [resetAt, initialQuota])

  const percentage = (remaining / initialQuota) * 100

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-semibold text-foreground">Daily Questions</span>
        </div>
        <span className="text-sm font-mono font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {remaining} / {initialQuota}
        </span>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Resets in {timeUntilReset}</span>
        {remaining === 0 && (
          <Button size="sm" variant="outline" asChild>
            <Link href="/pricing">Upgrade for Unlimited</Link>
          </Button>
        )}
      </div>

      {remaining <= 2 && remaining > 0 && (
        <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded p-2">
          Only {remaining} question{remaining === 1 ? "" : "s"} remaining today. Upgrade for unlimited access!
        </div>
      )}

      {remaining === 0 && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-2">
          Daily limit reached. Upgrade to Pro for unlimited questions or wait for reset.
        </div>
      )}
    </div>
  )
}
