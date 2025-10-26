"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CodeGenerationIntroProps {
  onComplete: () => void
}

export function CodeGenerationIntro({ onComplete }: CodeGenerationIntroProps) {
  const [stage, setStage] = useState<"initializing" | "generating" | "building" | "complete">("initializing")
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  const codeSequence = [
    "import { CroweLogicAI } from '@crowe/intelligence'",
    "import { MycologyEngine } from '@crowe/mycology'",
    "",
    "const platform = new CroweLogicAI({",
    "  expertise: '20 years professional mycology',",
    "  capabilities: ['vision', 'neural', 'genetic', 'quantum'],",
    "  intelligence: 'advanced-cultivation-ai'",
    "})",
    "",
    "// Initializing AI systems...",
    "await platform.initialize()",
    "await platform.loadKnowledgeBase()",
    "await platform.activateNeuralNetworks()",
    "",
    "// Building user interface...",
    "const ui = platform.createInterface({",
    "  design: 'futuristic-terminal',",
    "  theme: 'dark-gradient-code',",
    "  animations: 'next-level'",
    "})",
    "",
    "// Deploying platform...",
    "platform.deploy() // ✓ Ready",
  ]

  useEffect(() => {
    // Stage 1: Initializing
    const initTimer = setTimeout(() => {
      setStage("generating")
    }, 1000)

    return () => clearTimeout(initTimer)
  }, [])

  useEffect(() => {
    if (stage === "generating") {
      let lineIndex = 0
      const interval = setInterval(() => {
        if (lineIndex < codeSequence.length) {
          setCodeLines((prev) => [...prev, codeSequence[lineIndex]])
          setProgress(((lineIndex + 1) / codeSequence.length) * 100)
          lineIndex++
        } else {
          clearInterval(interval)
          setStage("building")
          setTimeout(() => {
            setStage("complete")
            setTimeout(onComplete, 500)
          }, 1500)
        }
      }, 150)

      return () => clearInterval(interval)
    }
  }, [stage, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
      <div className="w-full max-w-4xl px-6">
        {/* Header with Crowe Avatar */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="relative">
            {/* Animated particles */}
            {stage !== "initializing" && (
              <>
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * Math.PI * 2
                  const radius = 80
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(${x}px, ${y}px)`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  )
                })}
              </>
            )}

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse" />

            {/* Avatar */}
            <Image
              src="/crowe-avatar.png"
              alt="Crowe AI"
              width={120}
              height={120}
              className={`relative rounded-full border-4 border-purple-500/50 shadow-2xl ${stage !== "initializing" ? "animate-pulse" : ""}`}
            />

            {/* Status badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
              {stage === "initializing" && "INITIALIZING"}
              {stage === "generating" && "GENERATING"}
              {stage === "building" && "BUILDING"}
              {stage === "complete" && "READY"}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Crowe Logic AI
            </h2>
            <p className="text-gray-400 font-mono text-sm">Building your mycology intelligence platform...</p>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="relative bg-black/90 backdrop-blur-sm border-2 border-purple-500/40 rounded-xl shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border-b border-purple-500/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ml-2">
              crowe-logic-ai.tsx
            </span>
          </div>

          {/* Code Content */}
          <div className="p-6 font-mono text-sm h-[400px] overflow-y-auto">
            {codeLines.map((line, i) => {
              // Ensure line is a string
              const lineStr = String(line || "")

              return (
                <div
                  key={i}
                  className="animate-in fade-in slide-in-from-left-2 duration-200 leading-relaxed"
                  style={{ animationDelay: `${i * 0.02}s` }}
                >
                  {lineStr.startsWith("//") ? (
                    <span className="text-green-400 font-semibold">{lineStr}</span>
                  ) : lineStr.startsWith("import") ? (
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                      {lineStr}
                    </span>
                  ) : lineStr.includes("const") || lineStr.includes("await") ? (
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                      {lineStr}
                    </span>
                  ) : lineStr.includes("✓") ? (
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-semibold">
                      {lineStr}
                    </span>
                  ) : (
                    <span className="text-gray-300">{lineStr || "\u00A0"}</span>
                  )}
                </div>
              )
            })}
            {stage === "generating" && (
              <div className="inline-block w-2 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse ml-1" />
            )}
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-4">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-mono text-gray-400">
              <span>Building platform...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Skip button */}
        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors font-mono"
          >
            Skip intro →
          </button>
        </div>
      </div>
    </div>
  )
}
