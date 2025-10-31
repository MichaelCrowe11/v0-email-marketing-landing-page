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
}

type AvatarState = "idle" | "thinking" | "responding"

interface AIAvatarUltimateProps {
    state: AvatarState
    size?: number
    particleCount?: number
    enableMovement?: boolean
}

export function AIAvatarUltimate({
    state,
    size = 60,
    particleCount = 24,
    enableMovement = false,
}: AIAvatarUltimateProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const timeRef = useRef(0)
    const animationRef = useRef<number>()
    const [isBlinking, setIsBlinking] = useState(false)
    const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: 0 })
    const [avatarOpacity, setAvatarOpacity] = useState(1)

    const codeSnippets = [
        "AI", "ML", "NN", "{}", "<>", "fn", "=>", "if",
        "&&", "||", "++", "==", "!=", "[]", "()", "//",
        "/*", "*/", ";;", "λ", "Σ", "∫", "∂",
        "Φ", "Ψ", "Ω", "α", "β", "γ", "δ", "θ",
    ]

    const colors = [
        "rgb(236, 72, 153)",   // pink-500
        "rgb(168, 85, 247)",   // purple-500
        "rgb(59, 130, 246)",    // blue-500
        "rgb(34, 211, 238)",    // cyan-400
        "rgb(74, 222, 128)",    // green-400
        "rgb(250, 204, 21)",    // yellow-400
        "rgb(251, 146, 60)",    // orange-400
        "rgb(239, 68, 68)",     // red-500
    ]

    const createParticle = useCallback((index: number, total: number): Particle => {
        const angle = (index / total) * Math.PI * 2
        const radius = size * 0.8 + Math.random() * (size * 0.4)
        const speed =
            state === "thinking" ? 2 + Math.random() * 3 :
                state === "responding" ? 0.5 + Math.random() * 1 :
                    0.5 + Math.random() * 1

        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            vx: 0,
            vy: 0,
            angle,
            radius,
            speed,
            color: colors[index % colors.length],
            opacity: 1,
            scale: 1,
            code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
            life: 0,
            maxLife: 300 + Math.random() * 200,
        }
    }, [size, state, codeSnippets, colors])

    // Initialize particles
    useEffect(() => {
        const count =
            state === "thinking" ? particleCount :
                state === "responding" ? Math.floor(particleCount * 0.75) :
                    Math.floor(particleCount * 0.5)

        particlesRef.current = Array.from({ length: count }, (_, i) =>
            createParticle(i, count)
        )
    }, [particleCount, state, createParticle])

    // Blinking effect with dramatic opacity changes
    useEffect(() => {
        if (state === "thinking" || state === "responding") {
            const blinkInterval = setInterval(() => {
                setIsBlinking(true)
                setAvatarOpacity(0.3)

                setTimeout(() => setAvatarOpacity(1), 150)
                setTimeout(() => setAvatarOpacity(0.5), 300)
                setTimeout(() => {
                    setAvatarOpacity(1)
                    setIsBlinking(false)
                }, 450)
            }, state === "thinking" ? 1200 : 2000)

            return () => clearInterval(blinkInterval)
        } else {
            setAvatarOpacity(1)
            setIsBlinking(false)
        }
    }, [state])

    // Avatar movement across screen
    useEffect(() => {
        if (!enableMovement || state === "idle") {
            setAvatarPosition({ x: 0, y: 0 })
            return
        }

        let movementFrame: number
        let movementTime = 0

        const animateMovement = () => {
            movementTime += 0.02

            if (state === "thinking") {
                // Zip back and forth dramatically
                const x = Math.sin(movementTime * 2) * 15
                const y = Math.cos(movementTime * 1.5) * 10
                setAvatarPosition({ x, y })
            } else if (state === "responding") {
                // Gentle sway
                const x = Math.sin(movementTime) * 5
                const y = Math.cos(movementTime * 0.8) * 3
                setAvatarPosition({ x, y })
            }

            movementFrame = requestAnimationFrame(animateMovement)
        }

        animateMovement()
        return () => cancelAnimationFrame(movementFrame)
    }, [state, enableMovement])

    // Main animation loop - DRAMATIC CODE STORM
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d", { alpha: true })
        if (!ctx) return

        const centerX = size / 2
        const centerY = size / 2

        const animate = () => {
            timeRef.current += state === "thinking" ? 0.05 : state === "responding" ? 0.03 : 0.02

            // Clear canvas
            ctx.clearRect(0, 0, size, size)

            const particles = particlesRef.current
            const time = timeRef.current

            // Update and draw particles
            particles.forEach((p, index) => {
                p.life += 1

                // Update angle
                p.angle += p.speed * 0.02

                let wobble = 0
                let newRadius = p.radius

                if (state === "thinking") {
                    // AGGRESSIVE STORM MODE - Chaotic movement with pulsing
                    wobble = Math.sin(time * 3 + p.life * 0.1) * (size * 0.3) +
                        Math.cos(time * 2 + p.life * 0.05) * (size * 0.2)
                    newRadius = p.radius + Math.sin(time * 4 + p.life * 0.1) * (size * 0.3)
                    p.opacity = 0.7 + Math.sin(time * 5 + p.life * 0.1) * 0.3
                    p.scale = 1 + Math.sin(time * 3 + p.life * 0.1) * 0.3
                } else if (state === "responding") {
                    // Flowing spiral inward
                    const spiralFactor = Math.sin(time * 2 + p.life * 0.1) * 0.3
                    newRadius = p.radius * (0.8 + spiralFactor)
                    p.opacity = 0.8 + Math.sin(time * 3 + p.life * 0.1) * 0.2
                    p.scale = 1 + Math.sin(time * 4 + p.life * 0.1) * 0.2
                    wobble = Math.sin(time * 2 + p.life * 0.1) * (size * 0.15)
                } else {
                    // Gentle rainbow swirl
                    wobble = Math.sin(time * 2 + p.life * 0.1) * (size * 0.15)
                    p.opacity = 0.6 + Math.sin(time * 1.5 + p.life * 0.1) * 0.4
                    p.scale = 1 + Math.sin(time * 2 + p.life * 0.1) * 0.1
                }

                // Calculate position
                p.x = Math.cos(p.angle) * (newRadius + wobble)
                p.y = Math.sin(p.angle) * (newRadius + wobble)

                // Respawn if needed
                if (p.life > p.maxLife) {
                    Object.assign(p, createParticle(index, particles.length))
                }

                // Draw particle
                const x = centerX + p.x
                const y = centerY + p.y

                ctx.save()
                ctx.translate(x, y)
                ctx.scale(p.scale, p.scale)

                // Dramatic glow effect
                const glowSize = state === "thinking" ? 20 : state === "responding" ? 12 : 8
                ctx.shadowBlur = glowSize
                ctx.shadowColor = p.color
                ctx.globalAlpha = p.opacity * (isBlinking ? 0.3 : 1)

                // Draw text with extra glow
                ctx.font = `bold ${Math.max(10, size * 0.15)}px 'Fira Code', 'Courier New', monospace`
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillStyle = p.color
                ctx.fillText(p.code, 0, 0)

                // Extra glow layer for thinking state
                if (state === "thinking") {
                    ctx.shadowBlur = 30
                    ctx.globalAlpha = (p.opacity * 0.5) * (isBlinking ? 0.3 : 1)
                    ctx.fillText(p.code, 0, 0)
                }

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
    }, [state, size, isBlinking, createParticle])

    return (
        <div
            ref={containerRef}
            className="relative transition-transform duration-200"
            style={{
                width: size,
                height: size,
                transform: `translate(${avatarPosition.x}px, ${avatarPosition.y}px)`,
            }}
        >
            {/* Canvas for particles */}
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                className="absolute inset-0 pointer-events-none"
                style={{ width: size, height: size }}
            />

            {/* Avatar image with dramatic effects */}
            <div
                className={`absolute inset-0 rounded-full p-0.5 transition-all duration-300 ${state === "thinking"
                        ? "shadow-lg shadow-purple-500/50"
                        : state === "responding"
                            ? "shadow-lg shadow-cyan-500/50"
                            : "shadow-lg shadow-accent/30"
                    }`}
                style={{
                    transform: state === "thinking" ? "scale(1.05)" : "scale(1)",
                    opacity: avatarOpacity,
                }}
            >
                <Image
                    src="/crowe-logic-logo.png"
                    alt="Crowe Logic AI"
                    width={size}
                    height={size}
                    className="rounded-full border-2 border-accent/50"
                />
            </div>
        </div>
    )
}
