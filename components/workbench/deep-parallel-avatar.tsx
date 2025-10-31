"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface QuantumParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
}

type ReasoningState = "idle" | "thinking" | "reasoning" | "complete"

interface DeepParallelAvatarProps {
  agentName: string
  avatarImage: string
  state: ReasoningState
  size?: number
  primaryColor?: string
  secondaryColor?: string
}

export function DeepParallelAvatar({
  agentName,
  avatarImage,
  state,
  size = 120,
  primaryColor = "#22D3EE", // cyan
  secondaryColor = "#3B82F6", // blue
}: DeepParallelAvatarProps) {
  const [particles, setParticles] = useState<QuantumParticle[]>([])
  const [fieldIntensity, setFieldIntensity] = useState(0)

  // Particle count based on state
  const particleCount = {
    idle: 20,
    thinking: 40,
    reasoning: 80,
    complete: 30,
  }[state]

  // Field intensity based on state
  useEffect(() => {
    const targetIntensity = {
      idle: 0.3,
      thinking: 0.6,
      reasoning: 1.0,
      complete: 0.4,
    }[state]

    const interval = setInterval(() => {
      setFieldIntensity(prev => {
        const diff = targetIntensity - prev
        return prev + diff * 0.1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [state])

  // Initialize particles
  useEffect(() => {
    const newParticles: QuantumParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * size * 2,
      y: (Math.random() - 0.5) * size * 2,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? primaryColor : secondaryColor,
      opacity: Math.random() * 0.8 + 0.2,
    }))
    setParticles(newParticles)
  }, [particleCount, size, primaryColor, secondaryColor])

  // Animate quantum field
  useEffect(() => {
    let animationFrame: number
    let time = 0

    const animate = () => {
      time += state === "reasoning" ? 0.15 : state === "thinking" ? 0.08 : 0.03

      setParticles(prev =>
        prev.map(p => {
          // Quantum field forces
          const centerDist = Math.sqrt(p.x * p.x + p.y * p.y)
          const maxDist = size * 1.5
          
          // Attraction to center with quantum fluctuation
          const attractionForce = (centerDist / maxDist) * fieldIntensity * 0.5
          const quantumNoise = (Math.random() - 0.5) * fieldIntensity * 2
          
          let newVx = p.vx - (p.x / centerDist) * attractionForce + quantumNoise
          let newVy = p.vy - (p.y / centerDist) * attractionForce + quantumNoise

          // Add orbital motion during reasoning
          if (state === "reasoning") {
            const orbitalForce = 0.05 * fieldIntensity
            newVx += -p.y * orbitalForce
            newVy += p.x * orbitalForce
          }

          // Damping
          newVx *= 0.98
          newVy *= 0.98

          let newX = p.x + newVx
          let newY = p.y + newVy

          // Bounce off boundaries
          if (Math.abs(newX) > maxDist) {
            newVx *= -0.8
            newX = Math.sign(newX) * maxDist
          }
          if (Math.abs(newY) > maxDist) {
            newVy *= -0.8
            newY = Math.sign(newY) * maxDist
          }

          return {
            ...p,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            opacity: 0.3 + Math.sin(time + p.id) * 0.3 * fieldIntensity,
          }
        })
      )

      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [state, size, fieldIntensity])

  return (
    <div className="relative will-change-transform" style={{ width: size, height: size }}>
      {/* Quantum Field Background - GPU accelerated */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500 will-change-transform"
        style={{
          background: `radial-gradient(circle, ${primaryColor}${Math.floor(fieldIntensity * 30).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: `blur(${20 * fieldIntensity}px)`,
          transform: `scale(${1 + fieldIntensity * 0.5})`,
        }}
      />

      {/* Quantum Particles - GPU accelerated */}
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full will-change-transform"
            style={{
              width: p.size,
              height: p.size,
              left: '50%',
              top: '50%',
              transform: `translate(${p.x}px, ${p.y}px)`,
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 ${10 * fieldIntensity}px ${p.color}, 0 0 ${20 * fieldIntensity}px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Energy Rings */}
      {state === "reasoning" && (
        <>
          <div
            className="absolute inset-0 rounded-full border-2 animate-ping"
            style={{
              borderColor: primaryColor,
              opacity: 0.4,
              animationDuration: "1s",
            }}
          />
          <div
            className="absolute inset-0 -m-4 rounded-full border-2 animate-ping"
            style={{
              borderColor: secondaryColor,
              opacity: 0.3,
              animationDuration: "1.5s",
            }}
          />
        </>
      )}

      {/* Avatar - GPU accelerated */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300 will-change-transform"
        style={{
          transform: `scale(${1 + fieldIntensity * 0.1}) rotate(${state === "reasoning" ? "360deg" : "0deg"})`,
          transition: state === "reasoning" ? "transform 2s linear infinite" : "transform 0.3s ease",
        }}
      >
        <div
          className="relative rounded-full overflow-hidden border-4 transition-all duration-300"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            borderColor: state === "reasoning" ? primaryColor : secondaryColor,
            boxShadow: `0 0 ${30 * fieldIntensity}px ${primaryColor}, 0 0 ${60 * fieldIntensity}px ${secondaryColor}`,
          }}
        >
          <Image
            src={avatarImage}
            alt={agentName}
            width={size * 0.6}
            height={size * 0.6}
            className="object-cover"
          />
        </div>
      </div>

      {/* Agent Name */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="text-xs font-bold text-center" style={{ color: primaryColor }}>
          {agentName}
        </div>
        <div className="text-[10px] text-muted-foreground text-center capitalize">
          {state}
        </div>
      </div>
    </div>
  )
}
