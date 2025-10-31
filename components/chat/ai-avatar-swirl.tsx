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
  scale: number
}

type AvatarState = "idle" | "thinking" | "responding"

interface AIAvatarSwirlProps {
  state: AvatarState
  size?: number
}

export function AIAvatarSwirl({ state, size = 40 }: AIAvatarSwirlProps) {
  const [particles, setParticles] = useState<CodeParticle[]>([])
  const [isBlinking, setIsBlinking] = useState(false)
  const [avatarOpacity, setAvatarOpacity] = useState(1)

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
    "rgb(236, 72, 153)", // pink-500
    "rgb(168, 85, 247)", // purple-500
    "rgb(59, 130, 246)", // blue-500
    "rgb(34, 211, 238)", // cyan-400
    "rgb(74, 222, 128)", // green-400
    "rgb(250, 204, 21)", // yellow-400
    "rgb(251, 146, 60)", // orange-400
    "rgb(239, 68, 68)", // red-500
  ]

  useEffect(() => {
    if (state === "thinking" || state === "responding") {
      const blinkInterval = setInterval(
        () => {
          setIsBlinking(true)
          setAvatarOpacity(0.3)

          setTimeout(() => {
            setAvatarOpacity(1)
          }, 150)

          setTimeout(() => {
            setAvatarOpacity(0.5)
          }, 300)

          setTimeout(() => {
            setAvatarOpacity(1)
            setIsBlinking(false)
          }, 450)
        },
        state === "thinking" ? 1200 : 2000,
      )

      return () => clearInterval(blinkInterval)
    } else {
      setAvatarOpacity(1)
      setIsBlinking(false)
    }
  }, [state])

  useEffect(() => {
    const particleCount = state === "thinking" ? 32 : state === "responding" ? 40 : 12
    const newParticles: CodeParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: 0,
      y: 0,
      color: colors[i % colors.length],
      speed:
        state === "thinking"
          ? 3 + Math.random() * 4
          : state === "responding"
            ? 4 + Math.random() * 5  // Much faster during responding
            : 0.5 + Math.random() * 1,
      angle: (i / particleCount) * Math.PI * 2,
      radius: size * 0.8 + Math.random() * (size * 0.6),
      opacity: 1,
      scale: 1,
    }))
    setParticles(newParticles)
  }, [state, size])

  useEffect(() => {
    let animationFrame: number
    let time = 0

    const animate = () => {
      time += state === "thinking" ? 0.08 : state === "responding" ? 0.12 : 0.02

      setParticles((prev) =>
        prev.map((p, index) => {
          const newAngle = p.angle + p.speed * 0.03
          let wobble = 0
          let newRadius = p.radius
          let newOpacity = p.opacity
          let newScale = 1

          if (state === "thinking") {
            // Aggressive storm mode - chaotic movement with pulsing
            wobble = Math.sin(time * 4 + p.id) * (size * 0.5) + Math.cos(time * 3 + p.id * 0.5) * (size * 0.4)
            newRadius = p.radius + Math.sin(time * 5 + p.id) * (size * 0.5)
            newOpacity = 0.8 + Math.sin(time * 6 + p.id) * 0.2
            newScale = 1.2 + Math.sin(time * 4 + p.id) * 0.5
          } else if (state === "responding") {
            // EXTREME STORM - particles fly outward aggressively then spiral
            const explosionFactor = Math.sin(time * 3 + p.id * 0.3) * 1.5
            const spiralOut = Math.cos(time * 4 + p.id * 0.7) * 0.8
            
            wobble = Math.sin(time * 5 + p.id) * (size * 0.8) + Math.cos(time * 4 + p.id * 0.3) * (size * 0.6)
            newRadius = p.radius * (1.3 + explosionFactor + spiralOut)
            newOpacity = 0.9 + Math.sin(time * 7 + p.id) * 0.1
            newScale = 1.3 + Math.sin(time * 5 + p.id) * 0.6
          } else {
            // Idle mode - gentle rainbow swirl
            wobble = Math.sin(time * 2 + p.id) * (size * 0.15)
            newOpacity = 0.6 + Math.sin(time * 1.5 + p.id) * 0.4
            newScale = 1 + Math.sin(time * 2 + p.id) * 0.1
          }

          return {
            ...p,
            angle: newAngle,
            radius: newRadius,
            opacity: newOpacity,
            scale: newScale,
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
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute font-mono text-[11px] font-bold whitespace-nowrap pointer-events-none"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale}) rotate(${particle.angle * 57.3}deg)`,
              color: particle.color,
              opacity: particle.opacity * (isBlinking ? 0.3 : 1),
              textShadow: `
                0 0 ${state === "responding" ? "20px" : state === "thinking" ? "15px" : "8px"} currentColor,
                0 0 ${state === "responding" ? "40px" : state === "thinking" ? "30px" : "16px"} currentColor,
                0 0 ${state === "responding" ? "60px" : state === "thinking" ? "45px" : "24px"} currentColor
              `,
              filter: `blur(${state === "responding" ? "0.8px" : state === "thinking" ? "0.5px" : "0px"})`,
              fontWeight: 900,
              transition: state === "responding" ? "none" : "all 0.1s ease-out",
            }}
          >
            {particle.code}
          </div>
        ))}
      </div>

      <div
        className={`absolute inset-0 rounded-full p-0.5 transition-all duration-300 ${
          state === "thinking"
            ? "shadow-2xl shadow-purple-500/70 ring-2 ring-purple-500/30"
            : state === "responding"
              ? "shadow-2xl shadow-cyan-500/80 ring-4 ring-cyan-500/40 animate-pulse"
              : "shadow-lg shadow-accent/30"
        }`}
        style={{
          transform: state === "responding" ? "scale(1.1)" : state === "thinking" ? "scale(1.05)" : "scale(1)",
          opacity: avatarOpacity,
        }}
      >
        <Image
          src="/crowe-logic-logo.png"
          alt="Crowe Logic AI"
          width={size}
          height={size}
          className={`rounded-full border-2 ${
            state === "responding" 
              ? "border-cyan-500/70" 
              : state === "thinking"
                ? "border-purple-500/50"
                : "border-accent/50"
          }`}
        />
      </div>
    </div>
  )
}
