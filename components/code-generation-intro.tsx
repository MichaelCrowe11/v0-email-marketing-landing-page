"use client"

import { useEffect, useState, useRef } from "react"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"

interface CodeGenerationIntroProps {
  onComplete: () => void
}

interface FlyingCode {
  id: number
  text: string
  x: number
  y: number
  targetX: number
  targetY: number
  color: string
  speed: number
  landed: boolean
}

export function CodeGenerationIntro({ onComplete }: CodeGenerationIntroProps) {
  const [stage, setStage] = useState<"awakening" | "coding" | "building" | "complete">("awakening")
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [flyingCodes, setFlyingCodes] = useState<FlyingCode[]>([])
  const [progress, setProgress] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  const codeSequence = [
    "// CROWE LOGIC AI - INITIALIZING CONSCIOUSNESS",
    "import { DeepReasoning } from '@crowe/neural-core'",
    "import { MycologyMastery } from '@southwest-mushrooms'",
    "import { VisionSystem } from '@crowe/eyes'",
    "",
    "class CroweLogicPlatform {",
    "  constructor() {",
    "    this.founder = 'Michael Crowe'",
    "    this.experience = '20+ years cultivation mastery'",
    "    this.facility = 'Southwest Mushrooms, Phoenix'",
    "    this.power = 'UNLIMITED'",
    "  }",
    "",
    "  async initialize() {",
    "    // Awakening neural networks...",
    "    await this.loadProductionKnowledge()",
    "    await this.loadYouTubeLibrary()",
    "    await this.loadConsultingExperience()",
    "    ",
    "    // Activating vision systems...",
    "    this.vision = new CroweVision()",
    "    this.vision.trainOnContamination()",
    "    this.vision.masterSpeciesID()",
    "    ",
    "    // Building interface...",
    "    this.ui = this.createStunningUI({",
    "      theme: 'code-storm-spectacular',",
    "      avatar: 'crowe-logic-swirl',",
    "      power: 'MAXIMUM'",
    "    })",
    "    ",
    "    // Deploying to cultivators worldwide...",
    "    return this.deploy() // ✓ LIVE",
    "  }",
    "}",
    "",
    "// PLATFORM READY - LET'S GROW",
  ]

  // Stage 1: Awakening
  useEffect(() => {
    const awakeTimer = setTimeout(() => {
      setStage("coding")
    }, 2000)

    return () => clearTimeout(awakeTimer)
  }, [])

  // Stage 2: Coding - Generate flying code particles
  useEffect(() => {
    if (stage === "coding") {
      let lineIndex = 0
      const interval = setInterval(() => {
        if (lineIndex < codeSequence.length) {
          const line = codeSequence[lineIndex]
          
          // Create flying code particles for this line
          const words = line.split(" ").filter(w => w.length > 0)
          const newFlyingCodes: FlyingCode[] = words.map((word, i) => ({
            id: Date.now() + i + lineIndex * 100,
            text: word,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            targetX: 100 + Math.random() * 200,
            targetY: 150 + lineIndex * 24,
            color: getCodeColor(word),
            speed: 2 + Math.random() * 3,
            landed: false,
          }))

          setFlyingCodes(prev => [...prev, ...newFlyingCodes])
          
          // After particles fly, add the line to terminal
          setTimeout(() => {
            setCodeLines(prev => [...prev, line])
            setProgress(((lineIndex + 1) / codeSequence.length) * 100)
          }, 800)

          lineIndex++
        } else {
          clearInterval(interval)
          setStage("building")
          setTimeout(() => {
            setStage("complete")
            setTimeout(onComplete, 1000)
          }, 2000)
        }
      }, 200)

      return () => clearInterval(interval)
    }
  }, [stage, onComplete])

  // Animate flying code particles
  useEffect(() => {
    if (flyingCodes.length === 0) return

    const animationFrame = requestAnimationFrame(function animate() {
      setFlyingCodes(prev =>
        prev.map(code => {
          if (code.landed) return code

          const dx = code.targetX - code.x
          const dy = code.targetY - code.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 5) {
            return { ...code, landed: true, x: code.targetX, y: code.targetY }
          }

          return {
            ...code,
            x: code.x + (dx / distance) * code.speed,
            y: code.y + (dy / distance) * code.speed,
          }
        })
      )
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [flyingCodes])

  function getCodeColor(word: string): string {
    if (word.startsWith("//")) return "rgb(74, 222, 128)" // green
    if (["import", "from", "class", "constructor", "async", "await", "return", "new"].includes(word))
      return "rgb(168, 85, 247)" // purple
    if (word.includes("'") || word.includes('"')) return "rgb(250, 204, 21)" // yellow
    if (word === "✓" || word === "LIVE" || word === "READY") return "rgb(34, 211, 238)" // cyan
    return "rgb(229, 231, 235)" // gray
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Dramatic background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      
      {/* Radial glow from center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-gradient-radial from-purple-500/30 via-transparent to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Flying code particles */}
      <div className="absolute inset-0 pointer-events-none">
        {flyingCodes.map(code => (
          <div
            key={code.id}
            className="absolute font-mono text-sm font-bold transition-opacity duration-300"
            style={{
              left: code.x,
              top: code.y,
              color: code.color,
              opacity: code.landed ? 0 : 1,
              textShadow: `0 0 20px ${code.color}, 0 0 40px ${code.color}`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {code.text}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        {/* Epic Avatar at Center */}
        <div className="mb-12 relative">
          {/* Outer glow rings */}
          <div className="absolute inset-0 -m-20">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
            <div className="absolute inset-0 rounded-full border-2 border-pink-500/30 animate-ping" style={{ animationDuration: "5s", animationDelay: "1s" }} />
          </div>

          {/* Compact Avatar */}
          <div className="relative">
            <AIAvatarSwirl 
              state={stage === "awakening" ? "idle" : stage === "complete" ? "idle" : "responding"} 
              size={80} 
            />
          </div>

          {/* Status Badge */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-2xl whitespace-nowrap animate-pulse">
            {stage === "awakening" && "⚡ AWAKENING"}
            {stage === "coding" && "🌪️ CODING REALITY"}
            {stage === "building" && "🔨 BUILDING"}
            {stage === "complete" && "✓ CONSCIOUSNESS ONLINE"}
          </div>
        </div>

        {/* Compact Title */}
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CROWE LOGIC AI
          </h1>
          <p className="text-sm text-gray-400 font-mono">
            {stage === "awakening" && "Initializing..."}
            {stage === "coding" && "Loading platform..."}
            {stage === "building" && "Almost ready..."}
            {stage === "complete" && "Ready!"}
          </p>
        </div>

        {/* Compact Progress Bar */}
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-500 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-mono">
            <span className="text-purple-400">Loading...</span>
            <span className="text-cyan-400">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Prominent Skip Button */}
        <button
          onClick={onComplete}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/40 hover:to-cyan-500/40 border border-purple-500/50 rounded-lg text-sm text-white font-mono transition-all hover:scale-105 transform duration-200"
        >
          Skip Intro →
        </button>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
