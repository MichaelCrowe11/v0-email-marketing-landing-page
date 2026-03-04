"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// March 4, 2026 at 5:00 PM MST (UTC-7) = March 5, 2026 00:00 UTC
const LAUNCH_END = new Date("2026-03-05T00:00:00Z").getTime()

function getTimeLeft() {
  const now = Date.now()
  const diff = LAUNCH_END - now
  if (diff <= 0) return null

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { hours, minutes, seconds }
}

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft())
    const interval = setInterval(() => {
      const t = getTimeLeft()
      if (!t) {
        clearInterval(interval)
      }
      setTimeLeft(t)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Don't render until mounted (avoid hydration mismatch) or if countdown expired
  if (!mounted || !timeLeft) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-900/90 via-amber-800/90 to-amber-900/90 border-b border-amber-700/50">
      {/* Animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-shimmer" />

      <div className="relative flex items-center justify-center gap-3 px-4 py-2.5 text-sm">
        <span className="hidden sm:inline font-medium text-amber-200/80 tracking-wide uppercase text-xs">
          The Mushroom Grower drops in
        </span>
        <span className="sm:hidden font-medium text-amber-200/80 tracking-wide uppercase text-xs">
          Drops in
        </span>

        <div className="flex items-center gap-1.5 font-mono font-bold text-white text-lg">
          <span className="bg-black/30 rounded px-2 py-0.5 min-w-[2.5ch] text-center tabular-nums">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-amber-400 animate-pulse">:</span>
          <span className="bg-black/30 rounded px-2 py-0.5 min-w-[2.5ch] text-center tabular-nums">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-amber-400 animate-pulse">:</span>
          <span className="bg-black/30 rounded px-2 py-0.5 min-w-[2.5ch] text-center tabular-nums">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>

        <Link
          href="https://buy.southwestmushrooms.com/b/00w6oHgjW63O6MO0haejK02"
          target="_blank"
          className="ml-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap"
        >
          Pre-Order Bundle — $499
        </Link>
      </div>
    </div>
  )
}
