"use client"

import { useEffect, useState, useRef } from "react"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"

interface FlyingLetter {
  id: number
  char: string
  startX: number
  startY: number
  targetX: number
  targetY: number
  progress: number
  color: string
}

interface StreamingTextAnimationProps {
  text: string
  isStreaming: boolean
  onComplete?: () => void
}

export function StreamingTextAnimation({ text, isStreaming, onComplete }: StreamingTextAnimationProps) {
  const [flyingLetters, setFlyingLetters] = useState<FlyingLetter[]>([])
  const [displayedText, setDisplayedText] = useState("")
  const [avatarPosition, setAvatarPosition] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const colors = [
    "rgb(236, 72, 153)", // pink
    "rgb(168, 85, 247)", // purple
    "rgb(59, 130, 246)", // blue
    "rgb(34, 211, 238)", // cyan
    "rgb(74, 222, 128)", // green
    "rgb(250, 204, 21)", // yellow
  ]

  useEffect(() => {
    if (!isStreaming || !text) return

    const newChars = text.slice(displayedText.length)
    if (newChars.length === 0) return

    // Avatar zips across screen
    const zipAcross = () => {
      const startX = Math.random() * 60 + 20 // 20-80%
      const startY = Math.random() * 40 + 10 // 10-50%
      setAvatarPosition({ x: startX, y: startY })
    }

    zipAcross()

    // Create flying letters from avatar position
    const container = containerRef.current
    const textBox = textRef.current
    if (!container || !textBox) return

    const containerRect = container.getBoundingClientRect()
    const textRect = textBox.getBoundingClientRect()

    const newLetters: FlyingLetter[] = Array.from(newChars).map((char, i) => {
      const avatarX = (avatarPosition.x / 100) * containerRect.width
      const avatarY = (avatarPosition.y / 100) * containerRect.height

      return {
        id: Date.now() + i,
        char,
        startX: avatarX,
        startY: avatarY,
        targetX: textRect.left - containerRect.left + (displayedText.length + i) * 8,
        targetY: textRect.top - containerRect.top + 10,
        progress: 0,
        color: colors[i % colors.length],
      }
    })

    setFlyingLetters((prev) => [...prev, ...newLetters])

    // Animate letters flying to text box
    const animationDuration = 400 // ms
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      setFlyingLetters((prev) =>
        prev.map((letter) => ({
          ...letter,
          progress: Math.min(letter.progress + 0.05, 1),
        }))
      )

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Letters have landed, add to displayed text
        setDisplayedText(text)
        setFlyingLetters([])
        if (text === displayedText + newChars && onComplete) {
          onComplete()
        }
      }
    }

    requestAnimationFrame(animate)
  }, [text, isStreaming])

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[200px]">
      {/* Avatar zipping around */}
      {isStreaming && (
        <div
          className="absolute z-20 transition-all duration-300 ease-out"
          style={{
            left: `${avatarPosition.x}%`,
            top: `${avatarPosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <AIAvatarSwirl state="responding" size={64} />
        </div>
      )}

      {/* Flying letters */}
      {flyingLetters.map((letter) => {
        const currentX = letter.startX + (letter.targetX - letter.startX) * letter.progress
        const currentY = letter.startY + (letter.targetY - letter.startY) * letter.progress
        const easeProgress = letter.progress * (2 - letter.progress) // ease out

        return (
          <div
            key={letter.id}
            className="absolute font-mono text-lg font-bold pointer-events-none z-30"
            style={{
              left: currentX,
              top: currentY,
              color: letter.color,
              opacity: 1 - letter.progress * 0.3,
              transform: `scale(${1 + (1 - easeProgress) * 0.5}) rotate(${(1 - easeProgress) * 360}deg)`,
              textShadow: `0 0 20px ${letter.color}, 0 0 40px ${letter.color}`,
              transition: "none",
            }}
          >
            {letter.char}
          </div>
        )
      })}

      {/* Text box where letters land */}
      <div
        ref={textRef}
        className="relative z-10 p-4 bg-card border border-border rounded-lg min-h-[100px]"
      >
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
          {displayedText}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse" />
          )}
        </div>
      </div>
    </div>
  )
}
