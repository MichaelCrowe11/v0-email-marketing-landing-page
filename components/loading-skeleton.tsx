"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function LoadingSkeleton() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const phases = [
    { label: "Initializing neural pathways", icon: "🧠" },
    { label: "Loading cultivation protocols", icon: "🍄" },
    { label: "Calibrating environmental sensors", icon: "🌡️" },
    { label: "Preparing AI models", icon: "⚡" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const phaseInterval = setInterval(() => {
      setPhase((prev) => (prev + 1) % phases.length)
    }, 1500)

    return () => {
      clearInterval(interval)
      clearInterval(phaseInterval)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="max-w-md w-full px-6 space-y-8">
        {/* Animated Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
            <Image
              src="/crowe-avatar.png"
              alt="Michael Crowe"
              width={96}
              height={96}
              className="relative h-24 w-24 rounded-full ring-4 ring-accent/30 animate-float"
              priority
            />
            <div className="absolute inset-0 rounded-full border-2 border-accent/50 animate-spin-slow" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Crowe Logic AI</h2>
          <p className="text-sm text-muted-foreground font-mono">
            {phases[phase].icon} {phases[phase].label}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent via-accent/80 to-accent transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>Loading...</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Scientific Data Stream */}
        <div className="space-y-2 font-mono text-xs text-muted-foreground/60">
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
            <span>Substrate hydration: 62.4%</span>
          </div>
          <div className="flex items-center gap-2 animate-fade-in animation-delay-200">
            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
            <span>Temperature: 24.2°C</span>
          </div>
          <div className="flex items-center gap-2 animate-fade-in animation-delay-400">
            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
            <span>CO₂ levels: 850 ppm</span>
          </div>
          <div className="flex items-center gap-2 animate-fade-in animation-delay-600">
            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
            <span>Humidity: 85.7%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-muted rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-3 animate-fade-in">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 glass-card rounded-lg animate-pulse">
          <div className="h-10 w-10 bg-muted rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
          <div className="h-8 w-20 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}
