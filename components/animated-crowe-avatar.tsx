"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface AnimatedCroweAvatarProps {
  mode: "vision" | "neural" | "genetic" | "quantum" | "processing" | "idle"
  size?: number
  showLabel?: boolean
}

export function AnimatedCroweAvatar({ mode, size = 48, showLabel = false }: AnimatedCroweAvatarProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (mode !== "idle") {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.cos((i / 8) * Math.PI * 2) * (size / 2 + 10),
        y: Math.sin((i / 8) * Math.PI * 2) * (size / 2 + 10),
        delay: i * 0.1,
      }))
      setParticles(newParticles)
    }
  }, [mode, size])

  const getModeConfig = () => {
    switch (mode) {
      case "vision":
        return {
          label: "Vision Analysis",
          borderColor: "border-cyan-500",
          glowColor: "shadow-cyan-500/50",
          particleColor: "bg-cyan-400",
        }
      case "neural":
        return {
          label: "Neural Processing",
          borderColor: "border-purple-500",
          glowColor: "shadow-purple-500/50",
          particleColor: "bg-purple-400",
        }
      case "genetic":
        return {
          label: "Genetic Analysis",
          borderColor: "border-green-500",
          glowColor: "shadow-green-500/50",
          particleColor: "bg-green-400",
        }
      case "quantum":
        return {
          label: "Quantum Computing",
          borderColor: "border-pink-500",
          glowColor: "shadow-pink-500/50",
          particleColor: "bg-pink-400",
        }
      case "processing":
        return {
          label: "Processing",
          borderColor: "border-amber-500",
          glowColor: "shadow-amber-500/50",
          particleColor: "bg-amber-400",
        }
      default:
        return {
          label: "Idle",
          borderColor: "border-foreground/20",
          glowColor: "",
          particleColor: "bg-foreground/20",
        }
    }
  }

  const config = getModeConfig()

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Animated particles for active modes */}
        {mode !== "idle" &&
          particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute w-1.5 h-1.5 rounded-full ${config.particleColor} animate-pulse`}
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(${particle.x}px, ${particle.y}px)`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}

        {/* Glow effect */}
        {mode !== "idle" && (
          <div
            className={`absolute inset-0 rounded-full blur-xl ${config.glowColor} animate-pulse`}
            style={{ boxShadow: `0 0 ${size / 2}px currentColor` }}
          />
        )}

        {/* Avatar */}
        <div className="relative">
          <Image
            src="/crowe-avatar.png"
            alt="Crowe AI"
            width={size}
            height={size}
            className={`relative rounded-full border-2 ${config.borderColor} ${mode !== "idle" ? "animate-spin-slow" : ""} transition-all duration-300`}
          />

          {/* Status indicator */}
          {mode !== "idle" && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span className="text-xs font-mono font-semibold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {config.label}
        </span>
      )}
    </div>
  )
}
