"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

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
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0059-uidEXFLqOMKCV8KKSQzX49Du7xOv3w.png",
          borderColor: "border-primary",
        }
      case "code":
        return {
          label: "Crowe Code",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0091-mxP3KS7g1RzzgkqgHPOoq4RnAMeSQ3.png",
          borderColor: "border-[#7c3aed]",
        }
      case "processing":
        return {
          label: "Processing",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0059-uidEXFLqOMKCV8KKSQzX49Du7xOv3w.png",
          borderColor: "border-green-500",
        }
      default:
        return {
          label: "Idle",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0059-uidEXFLqOMKCV8KKSQzX49Du7xOv3w.png",
          borderColor: "border-border",
        }
    }
  }

  const config = getModeConfig()

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Avatar */}
        <div className="relative">
          <Image
            src={config.image || "/placeholder.svg"}
            alt={config.label}
            width={size}
            height={size}
            className={`rounded-full border-2 ${config.borderColor} object-cover`}
          />

          {/* Status indicator */}
          {mode !== "idle" && (
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background bg-green-500`}
            />
          )}
        </div>
      </div>

      {/* Label */}
      {showLabel && <span className="text-sm font-semibold text-foreground">{config.label}</span>}
    </div>
  )
}
