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
    // Scale particle count based on size for performance
    const baseCount = size > 100 ? 1.5 : 1
    const particleCount = Math.floor(
      state === "thinking" ? 32 * baseCount : state === "responding" ? 48 * baseCount : 12 * baseCount
    )
    
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
            ? 5 + Math.random() * 6  // Even faster during responding
            : 0.5 + Math.random() * 1,
      angle: (i / particleCount) * Math.PI * 2 + Math.random() * 0.5,
      radius: size * 0.8 + Math.random() * (size * 0.7),
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
            // APOCALYPTIC STORM - particles explode outward with extreme chaos
            const explosionWave = Math.sin(time * 4 + p.id * 0.2) * 2.0
            const spiralChaos = Math.cos(time * 5 + p.id * 0.5) * 1.2
            const pulseIntensity = Math.sin(time * 6 + p.id * 0.8) * 0.8
            
            wobble = Math.sin(time * 6 + p.id) * (size * 1.2) + Math.cos(time * 5 + p.id * 0.4) * (size * 0.9)
            newRadius = p.radius * (1.5 + explosionWave + spiralChaos + pulseIntensity)
            newOpacity = 0.95 + Math.sin(time * 8 + p.id) * 0.05
            newScale = 1.5 + Math.sin(time * 6 + p.id) * 0.8
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
            className="absolute font-mono text-[12px] font-black whitespace-nowrap pointer-events-none will-change-transform"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale}) rotate(${particle.angle * 57.3}deg)`,
              color: particle.color,
              opacity: particle.opacity * (isBlinking ? 0.3 : 1),
              textShadow: state === "responding" 
                ? `0 0 25px currentColor, 0 0 50px currentColor, 0 0 75px currentColor, 0 0 100px ${particle.color}40`
                : state === "thinking"
                  ? `0 0 18px currentColor, 0 0 36px currentColor, 0 0 54px currentColor`
                  : `0 0 10px currentColor, 0 0 20px currentColor`,
              filter: `blur(${state === "responding" ? "1px" : state === "thinking" ? "0.6px" : "0px"}) brightness(${state === "responding" ? "1.3" : "1"})`,
              fontWeight: 900,
              transition: state === "responding" ? "none" : "all 0.1s ease-out",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            {particle.code}
          </div>
        ))}
      </div>

      <div
        className={`absolute inset-0 rounded-full p-0.5 transition-all duration-300 will-change-transform ${
          state === "thinking"
            ? "shadow-[0_0_60px_rgba(168,85,247,0.8)] ring-4 ring-purple-500/40"
            : state === "responding"
              ? "shadow-[0_0_80px_rgba(34,211,238,1)] ring-8 ring-cyan-500/60 animate-pulse"
              : "shadow-lg shadow-accent/30"
        }`}
        style={{
          transform: state === "responding" ? "scale(1.15)" : state === "thinking" ? "scale(1.08)" : "scale(1)",
          opacity: avatarOpacity,
          filter: state === "responding" ? "brightness(1.2)" : "brightness(1)",
        }}
      >
        {/* Inner glow */}
        {state === "responding" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-xl animate-pulse" />
        )}
        
        <Image
          src="/crowe-logic-logo.png"
          alt="Crowe Logic Interface"
          width={size}
          height={size}
          className={`rounded-full border-4 relative z-10 ${
            state === "responding" 
              ? "border-cyan-400/90 shadow-[0_0_30px_rgba(34,211,238,0.8)]" 
              : state === "thinking"
                ? "border-purple-400/70 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                : "border-accent/50"
          }`}
          priority={size > 100}
        />
      </div>
    </div>
  )
}
