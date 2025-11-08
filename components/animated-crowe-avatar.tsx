"use client"

import { useEffect, useState } from "react"

interface AnimatedCroweAvatarProps {
  mode: "vision" | "code" | "processing" | "idle"
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
          label: "Crowe Vision",
          borderColor: "border-cyan-500",
          glowColor: "shadow-cyan-500/50",
          particleColor: "bg-cyan-400",
        }
      case "code":
        return {
          label: "Crowe Code",
          borderColor: "border-[#4a90e2]",
          glowColor: "shadow-[#4a90e2]/50",
          particleColor: "bg-[#4a90e2]",
        }
      case "processing":
        return {
          label: "Processing",
          borderColor: "border-[#98c379]",
          glowColor: "shadow-[#98c379]/50",
          particleColor: "bg-[#98c379]",
        }
      default:
        return {
          label: "Idle",
          borderColor: "border-[#485063]",
          glowColor: "",
          particleColor: "bg-[#485063]",
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
          <div
            className={`relative rounded-full border-2 ${config.borderColor} ${mode !== "idle" ? "animate-pulse" : ""} transition-all duration-300 flex items-center justify-center bg-[#1a1f2e]`}
            style={{ width: size, height: size }}
          >
            <span className="text-2xl font-bold text-white">CL</span>
          </div>

          {/* Status indicator */}
          {mode !== "idle" && (
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0e14] animate-pulse ${config.particleColor}`}
            />
          )}
        </div>
      </div>

      {/* Label */}
      {showLabel && <span className="text-sm font-semibold text-white">{config.label}</span>}
    </div>
  )
}
