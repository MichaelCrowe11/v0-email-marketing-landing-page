"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface SporeParticle {
  id: number
  symbol: string
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
  const [particles, setParticles] = useState<SporeParticle[]>([])
  const [avatarOpacity, setAvatarOpacity] = useState(1)

  const sporeSymbols = [
    "◦", // Spore
    "⚬", // Mycelium node
    "○", // Fruiting body
    "◉", // Mature spore
    "⊙", // Spore cluster
    "◌", // Young mycelium
    "⊚", // Colonizing
    "⊕", // Growth point
  ]

  const naturalColors = [
    "rgb(212, 196, 168)", // Mycelium beige
    "rgb(156, 116, 86)", // Mushroom brown
    "rgb(74, 124, 89)", // Growth green
    "rgb(184, 152, 118)", // Substrate tan
    "rgb(245, 243, 240)", // White mycelium
    "rgb(107, 93, 79)", // Dark soil
  ]

  useEffect(() => {
    if (state === "thinking" || state === "responding") {
      const breatheInterval = setInterval(
        () => {
          setAvatarOpacity(0.7)
          setTimeout(() => setAvatarOpacity(1), 300)
          setTimeout(() => setAvatarOpacity(0.85), 600)
          setTimeout(() => setAvatarOpacity(1), 900)
        },
        state === "thinking" ? 2000 : 3000,
      )
      return () => clearInterval(breatheInterval)
    } else {
      setAvatarOpacity(1)
    }
  }, [state])

  useEffect(() => {
    const particleCount = state === "thinking" ? 16 : state === "responding" ? 12 : 8
    const newParticles: SporeParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      symbol: sporeSymbols[Math.floor(Math.random() * sporeSymbols.length)],
      x: 0,
      y: 0,
      color: naturalColors[i % naturalColors.length],
      speed:
        state === "thinking"
          ? 1 + Math.random() * 1.5
          : state === "responding"
            ? 0.3 + Math.random() * 0.7
            : 0.3 + Math.random() * 0.5,
      angle: (i / particleCount) * Math.PI * 2,
      radius: size * 0.75 + Math.random() * (size * 0.3),
      opacity: 1,
      scale: 1,
    }))
    setParticles(newParticles)
  }, [state, size])

  useEffect(() => {
    let animationFrame: number
    let time = 0

    const animate = () => {
      time += state === "thinking" ? 0.03 : state === "responding" ? 0.02 : 0.015

      setParticles((prev) =>
        prev.map((p, index) => {
          const newAngle = p.angle + p.speed * 0.015
          let drift = 0
          let newRadius = p.radius
          let newOpacity = p.opacity
          let newScale = 1

          if (state === "thinking") {
            drift = Math.sin(time * 2 + p.id) * (size * 0.2) + Math.cos(time * 1.5 + p.id * 0.3) * (size * 0.15)
            newRadius = p.radius + Math.sin(time * 2.5 + p.id) * (size * 0.2)
            newOpacity = 0.6 + Math.sin(time * 3 + p.id) * 0.4
            newScale = 0.8 + Math.sin(time * 2 + p.id) * 0.3
          } else if (state === "responding") {
            const spiralFactor = Math.sin(time * 1.5 + p.id * 0.4) * 0.2
            newRadius = p.radius * (0.85 + spiralFactor)
            newOpacity = 0.7 + Math.sin(time * 2 + p.id) * 0.3
            newScale = 0.9 + Math.sin(time * 2.5 + p.id) * 0.2
            drift = Math.sin(time * 1.5 + p.id) * (size * 0.1)
          } else {
            drift = Math.sin(time * 1.5 + p.id) * (size * 0.12)
            newOpacity = 0.5 + Math.sin(time + p.id) * 0.3
            newScale = 0.9 + Math.sin(time * 1.5 + p.id) * 0.15
          }

          return {
            ...p,
            angle: newAngle,
            radius: newRadius,
            opacity: newOpacity,
            scale: newScale,
            x: Math.cos(newAngle) * (newRadius + drift),
            y: Math.sin(newAngle) * (newRadius + drift),
          }
        }),
      )
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [state, size])

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-sm font-light whitespace-nowrap transition-all duration-150 pointer-events-none"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`,
              color: particle.color,
              opacity: particle.opacity * avatarOpacity,
              textShadow: `0 0 ${state === "thinking" ? "8px" : "4px"} currentColor`,
              filter: "blur(0.3px)",
            }}
          >
            {particle.symbol}
          </div>
        ))}
      </div>

      <div
        className={`absolute inset-0 rounded-full p-0.5 transition-all duration-300`}
        style={{
          transform: state === "thinking" ? "scale(1.03)" : "scale(1)",
          opacity: avatarOpacity,
          boxShadow:
            state === "thinking"
              ? "0 0 16px rgba(156, 116, 86, 0.4)"
              : state === "responding"
                ? "0 0 12px rgba(74, 124, 89, 0.3)"
                : "0 0 8px rgba(124, 93, 63, 0.2)",
        }}
      >
        <Image
          src="/crowe-avatar.png"
          alt="Crowe Mycology AI"
          width={size}
          height={size}
          className="rounded-full border-2 border-primary/30 object-cover"
          priority
          quality={95}
        />
      </div>
    </div>
  )
}
