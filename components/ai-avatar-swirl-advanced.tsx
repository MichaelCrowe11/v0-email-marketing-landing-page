"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  radius: number
  speed: number
  color: string
  opacity: number
  scale: number
  code: string
  life: number
  maxLife: number
  trail: { x: number; y: number; opacity: number }[]
}

type AvatarState = "idle" | "thinking" | "responding"

interface AIAvatarSwirlAdvancedProps {
  state: AvatarState
  size?: number
  particleCount?: number
  showNeuralConnections?: boolean
  enableTrails?: boolean
  reactToMouse?: boolean
}

export function AIAvatarSwirlAdvanced({
  state,
  size = 200,
  particleCount = 150,
  showNeuralConnections = true,
  enableTrails = true,
  reactToMouse = true,
}: AIAvatarSwirlAdvancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const timeRef = useRef(0)
  const animationRef = useRef<number>()
  const [isBlinking, setIsBlinking] = useState(false)

  const codeSnippets = [
    "AI", "ML", "NN", "{}", "<>", "fn", "=>", "if",
    "&&", "||", "++", "==", "!=", "[]", "()", "//",
    "λ", "Σ", "∫", "∂", "Φ", "Ψ", "Ω", "α",
    "β", "γ", "δ", "θ",
  ]

  const colorPalettes = {
    thinking: [
      { r: 236, g: 72, b: 153 },   // pink
      { r: 168, g: 85, b: 247 },   // purple
      { r: 139, g: 92, b: 246 },   // violet
      { r: 99, g: 102, b: 241 },   // indigo
    ],
    responding: [
      { r: 34, g: 211, b: 238 },   // cyan
      { r: 59, g: 130, b: 246 },   // blue
      { r: 14, g: 165, b: 233 },   // sky
      { r: 6, g: 182, b: 212 },    // cyan
    ],
    idle: [
      { r: 74, g: 222, b: 128 },   // green
      { r: 34, g: 211, b: 238 },   // cyan
      { r: 59, g: 130, b: 246 },   // blue
      { r: 168, g: 85, b: 247 },   // purple
    ],
  }

  const getColorForState = useCallback((state: AvatarState, index: number) => {
    const palette = colorPalettes[state]
    const color = palette[index % palette.length]
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }, [])

  const createParticle = useCallback((index: number, total: number): Particle => {
    const angle = (index / total) * Math.PI * 2
    const radius = size * 0.35 + Math.random() * (size * 0.15)
    const speed = 
      state === "thinking" ? 0.8 + Math.random() * 1.2 : 
      state === "responding" ? 0.3 + Math.random() * 0.5 : 
      0.2 + Math.random() * 0.3

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      angle,
      radius,
      speed,
      color: getColorForState(state, index),
      opacity: 0.8 + Math.random() * 0.2,
      scale: 0.8 + Math.random() * 0.4,
      code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      life: 0,
      maxLife: 300 + Math.random() * 200,
      trail: [],
    }
  }, [size, state, getColorForState, codeSnippets])

  // Initialize particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: particleCount }, (_, i) =>
      createParticle(i, particleCount)
    )
  }, [particleCount, createParticle])

  // Blinking effect
  useEffect(() => {
    if (state === "thinking" || state === "responding") {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      }, state === "thinking" ? 800 : 1500)
      return () => clearInterval(blinkInterval)
    } else {
      setIsBlinking(false)
    }
  }, [state])

  // Mouse tracking
  useEffect(() => {
    if (!reactToMouse) return

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left - size / 2,
        y: e.clientY - rect.top - size / 2,
        active: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [reactToMouse, size])

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const centerX = size / 2
    const centerY = size / 2

    const animate = () => {
      timeRef.current += 1

      // Clear with trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, size, size)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Update physics
      particles.forEach((p, i) => {
        p.life += 1

        // Orbital motion
        p.angle += p.speed * 0.01

        // State-specific behavior
        let targetRadius = p.radius
        let wobbleIntensity = 0

        if (state === "thinking") {
          // Chaotic storm with expansion/contraction
          wobbleIntensity = Math.sin(timeRef.current * 0.03 + i) * (size * 0.15)
          targetRadius = p.radius + Math.sin(timeRef.current * 0.02 + i * 0.5) * (size * 0.1)
          p.opacity = 0.6 + Math.sin(timeRef.current * 0.05 + i) * 0.4
          p.scale = 1 + Math.sin(timeRef.current * 0.04 + i) * 0.3
        } else if (state === "responding") {
          // Flowing spiral inward
          const spiralFactor = Math.sin(timeRef.current * 0.02 + i * 0.3) * 0.2
          targetRadius = p.radius * (0.85 + spiralFactor)
          wobbleIntensity = Math.sin(timeRef.current * 0.025 + i) * (size * 0.08)
          p.opacity = 0.7 + Math.sin(timeRef.current * 0.03 + i) * 0.3
          p.scale = 1 + Math.sin(timeRef.current * 0.035 + i) * 0.15
        } else {
          // Idle gentle swirl
          wobbleIntensity = Math.sin(timeRef.current * 0.02 + i) * (size * 0.1)
          p.opacity = 0.5 + Math.sin(timeRef.current * 0.015 + i) * 0.5
          p.scale = 0.9 + Math.sin(timeRef.current * 0.02 + i) * 0.2
        }

        // Calculate position
        const baseX = Math.cos(p.angle) * (targetRadius + wobbleIntensity)
        const baseY = Math.sin(p.angle) * (targetRadius + wobbleIntensity)

        // Mouse interaction
        if (mouse.active && reactToMouse) {
          const dx = mouse.x - baseX
          const dy = mouse.y - baseY
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = size * 0.3

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 0.3
            p.vx -= (dx / dist) * force
            p.vy -= (dy / dist) * force
          }
        }

        // Apply velocity with damping
        p.vx *= 0.95
        p.vy *= 0.95
        p.x = baseX + p.vx
        p.y = baseY + p.vy

        // Update trail
        if (enableTrails && state !== "idle") {
          p.trail.push({ x: p.x, y: p.y, opacity: p.opacity })
          if (p.trail.length > 8) p.trail.shift()
        }

        // Respawn particle if life exceeded
        if (p.life > p.maxLife) {
          Object.assign(p, createParticle(i, particles.length))
        }
      })

      // Draw neural connections
      if (showNeuralConnections && state !== "idle") {
        ctx.strokeStyle = 
          state === "thinking" ? "rgba(168, 85, 247, 0.15)" : "rgba(34, 211, 238, 0.15)"
        ctx.lineWidth = 1

        particles.forEach((p1, i) => {
          particles.forEach((p2, j) => {
            if (i >= j) return

            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < size * 0.25) {
              const opacity = (1 - dist / (size * 0.25)) * 0.3
              ctx.globalAlpha = opacity
              ctx.beginPath()
              ctx.moveTo(centerX + p1.x, centerY + p1.y)
              ctx.lineTo(centerX + p2.x, centerY + p2.y)
              ctx.stroke()
            }
          })
        })
        ctx.globalAlpha = 1
      }

      // Draw trails
      if (enableTrails) {
        particles.forEach((p) => {
          if (p.trail.length < 2) return

          ctx.strokeStyle = p.color
          ctx.lineWidth = 2

          p.trail.forEach((t, i) => {
            if (i === 0) return

            const prevT = p.trail[i - 1]
            const trailOpacity = (i / p.trail.length) * 0.3 * t.opacity
            ctx.globalAlpha = trailOpacity
            ctx.beginPath()
            ctx.moveTo(centerX + prevT.x, centerY + prevT.y)
            ctx.lineTo(centerX + t.x, centerY + t.y)
            ctx.stroke()
          })

          ctx.globalAlpha = 1
        })
      }

      // Draw particles
      ctx.font = `bold ${Math.max(8, size * 0.05)}px 'Fira Code', 'Courier New', monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      particles.forEach((p) => {
        const x = centerX + p.x
        const y = centerY + p.y

        ctx.save()
        ctx.translate(x, y)
        ctx.scale(p.scale, p.scale)

        // Glow effect
        const glowSize = 
          state === "thinking" ? 15 : 
          state === "responding" ? 10 : 6
        ctx.shadowBlur = glowSize
        ctx.shadowColor = p.color
        ctx.globalAlpha = p.opacity * (isBlinking ? 0.3 : 1)

        // Draw text
        ctx.fillStyle = p.color
        ctx.fillText(p.code, 0, 0)

        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [state, size, isBlinking, showNeuralConnections, enableTrails, reactToMouse, createParticle])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ width: size, height: size }}
      />

      {/* Avatar image */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          state === "thinking"
            ? "drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            : state === "responding"
            ? "drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
            : "drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]"
        }`}
        style={{
          transform: state === "thinking" ? "scale(1.08)" : "scale(1)",
          opacity: isBlinking ? 0.4 : 1,
        }}
      >
        <div
          className="relative rounded-full border-2 overflow-hidden"
          style={{
            width: size * 0.35,
            height: size * 0.35,
            borderColor:
              state === "thinking"
                ? "rgba(168, 85, 247, 0.5)"
                : state === "responding"
                ? "rgba(34, 211, 238, 0.5)"
                : "rgba(74, 222, 128, 0.3)",
          }}
        >
          <Image
            src="/crowe-logic-logo.png"
            alt="Crowe Logic AI"
            width={size * 0.35}
            height={size * 0.35}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* State indicator ring */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500"
        style={{
          background:
            state === "thinking"
              ? "radial-gradient(circle, transparent 30%, rgba(168, 85, 247, 0.1) 70%, transparent 100%)"
              : state === "responding"
              ? "radial-gradient(circle, transparent 30%, rgba(34, 211, 238, 0.1) 70%, transparent 100%)"
              : "radial-gradient(circle, transparent 30%, rgba(74, 222, 128, 0.05) 70%, transparent 100%)",
          transform: state === "thinking" ? "scale(1.1)" : "scale(1)",
          opacity: state === "idle" ? 0.5 : 1,
        }}
      />
    </div>
  )
}
