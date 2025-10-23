"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CodeParticle {
  id: number
  code: string
  x: number
  y: number
  color: string
  speed: number
  angle: number
  radius: number
  opacity: number
}

type AvatarState = "idle" | "thinking" | "responding"

interface AIAvatarSwirlProps {
  state: AvatarState
  size?: number
}

export function AIAvatarSwirl({ state, size = 40 }: AIAvatarSwirlProps) {
  const [particles, setParticles] = useState<CodeParticle[]>([])

  const codeSnippets = [
    "AI",
    "ML",
    "{}",
    "<>",
    "fn",
    "=>",
    "if",
    "&&",
    "||",
    "++",
    "==",
    "!=",
    "[]",
    "()",
    "//",
    "/*",
    "*/",
    ";;",
  ]

  const colors = [
    "rgb(34, 211, 238)", // cyan-400
    "rgb(168, 85, 247)", // purple-400
    "rgb(244, 114, 182)", // pink-400
    "rgb(74, 222, 128)", // green-400
    "rgb(96, 165, 250)", // blue-400
    "rgb(250, 204, 21)", // yellow-400
    "rgb(251, 146, 60)", // orange-400
    "rgb(248, 113, 113)", // red-400
  ]

  useEffect(() => {
    const particleCount = state === "thinking" ? 20 : state === "responding" ? 15 : 12
    const newParticles: CodeParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: 0,
      y: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed:
        state === "thinking"
          ? 2 + Math.random() * 3
          : state === "responding"
            ? 0.3 + Math.random() * 0.5
            : 0.5 + Math.random() * 1,
      angle: (i / particleCount) * Math.PI * 2,
      radius: size * 0.8 + Math.random() * (size * 0.4),
      opacity: 1,
    }))
    setParticles(newParticles)
  }, [state, size])

  useEffect(() => {
    let animationFrame: number
    let time = 0

    const animate = () => {
      time += state === "thinking" ? 0.05 : state === "responding" ? 0.01 : 0.02

      setParticles((prev) =>
        prev.map((p, index) => {
          let newAngle = p.angle + p.speed * 0.02
          let wobble = 0
          let newRadius = p.radius
          let newOpacity = p.opacity

          if (state === "thinking") {
            // Aggressive storm mode - chaotic movement
            wobble = Math.sin(time * 3 + p.id) * (size * 0.3) + Math.cos(time * 2 + p.id * 0.5) * (size * 0.2)
            newRadius = p.radius + Math.sin(time * 4 + p.id) * (size * 0.3)
            newOpacity = 0.6 + Math.sin(time * 5 + p.id) * 0.4
          } else if (state === "responding") {
            // Assembling into organized pattern - particles move to grid positions
            const gridSize = Math.ceil(Math.sqrt(prev.length))
            const gridX = (index % gridSize) - gridSize / 2
            const gridY = Math.floor(index / gridSize) - gridSize / 2
            const targetX = gridX * (size * 0.4)
            const targetY = gridY * (size * 0.4)

            const currentX = Math.cos(newAngle) * newRadius
            const currentY = Math.sin(newAngle) * newRadius

            // Smoothly interpolate towards grid position
            const lerpFactor = 0.05
            const newX = currentX + (targetX - currentX) * lerpFactor
            const newY = currentY + (targetY - currentY) * lerpFactor

            newAngle = Math.atan2(newY, newX)
            newRadius = Math.sqrt(newX * newX + newY * newY)
            newOpacity = 0.9
          } else {
            // Idle mode - gentle swirl
            wobble = Math.sin(time * 2 + p.id) * (size * 0.15)
            newOpacity = 0.7 + Math.sin(time * 1.5 + p.id) * 0.3
          }

          return {
            ...p,
            angle: newAngle,
            radius: newRadius,
            opacity: newOpacity,
            x: Math.cos(newAngle) * (newRadius + wobble),
            y: Math.sin(newAngle) * (newRadius + wobble),
          }
        }),
      )
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [state, size])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-all duration-500"
        style={{
          background:
            state === "thinking"
              ? "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 70%)"
              : state === "responding"
                ? "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)",
          transform: state === "thinking" ? "scale(1.5)" : "scale(1)",
        }}
      />

      {/* Code particles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute font-mono text-[8px] font-bold whitespace-nowrap transition-all duration-100 pointer-events-none"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              color: particle.color,
              opacity: particle.opacity,
              textShadow: `0 0 ${state === "thinking" ? "8px" : "4px"} currentColor`,
            }}
          >
            {particle.code}
          </div>
        ))}
      </div>

      {/* Center logo */}
      <div
        className={`absolute inset-0 rounded-full p-0.5 transition-all duration-500 ${
          state === "thinking"
            ? "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 animate-spin-slow shadow-lg shadow-orange-500/50"
            : state === "responding"
              ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 shadow-lg shadow-cyan-500/50"
              : "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
        }`}
        style={{
          transform: state === "thinking" ? "scale(1.1)" : "scale(1)",
        }}
      >
        <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
          <Image
            src="/crowe-logic-logo.png"
            alt="Crowe Logic AI"
            width={size}
            height={size}
            className={`w-full h-full object-cover transition-all duration-500 ${
              state === "thinking" ? "brightness-110 contrast-110" : ""
            }`}
          />
        </div>
      </div>
    </div>
  )
}
