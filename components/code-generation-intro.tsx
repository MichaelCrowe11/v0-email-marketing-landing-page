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
    "  expertise: '18+ years professional mycology',",
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
    "  theme: 'southwest-mushrooms',",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1916] backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl">
        {/* Header with Crowe Avatar - centered */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="relative flex items-center justify-center">
            {/* Animated particles — teal & golden */}
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
                      className="absolute w-2 h-2 rounded-full animate-pulse"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        animationDelay: `${i * 0.1}s`,
                        background: i % 2 === 0 ? "#3d9a9a" : "#d4a843",
                      }}
                    />
                  )
                })}
              </>
            )}

            {/* Glow effect — teal */}
            <div className="absolute inset-0 rounded-full blur-2xl animate-pulse" style={{ background: "radial-gradient(circle, rgba(61,154,154,0.4) 0%, rgba(212,168,67,0.2) 60%, transparent 100%)" }} />

            {/* Avatar - perfectly centered */}
            <div className="relative">
              <Image
                src="/crowe-avatar.png"
                alt="Crowe AI"
                width={120}
                height={120}
                className={`relative rounded-full border-4 shadow-2xl ${stage !== "initializing" ? "animate-pulse" : ""}`}
                style={{ borderColor: "rgba(61,154,154,0.5)" }}
              />
            </div>

            {/* Status badge — teal to golden gradient */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #3d9a9a, #4db8b8, #d4a843)" }}
            >
              {stage === "initializing" && "INITIALIZING"}
              {stage === "generating" && "GENERATING"}
              {stage === "building" && "BUILDING"}
              {stage === "complete" && "READY"}
            </div>
          </div>

          <div className="text-center">
            <h2
              className="text-3xl font-bold bg-clip-text text-transparent mb-2"
              style={{ backgroundImage: "linear-gradient(135deg, #3d9a9a, #4db8b8, #d4a843)" }}
            >
              Crowe Logic AI
            </h2>
            <p className="text-[#6b6560] font-mono text-sm">Building your mycology intelligence platform...</p>
          </div>
        </div>

        {/* Terminal Window — teal border */}
        <div className="relative backdrop-blur-sm border-2 rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: "rgba(26,25,22,0.95)", borderColor: "rgba(61,154,154,0.4)" }}>
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ backgroundColor: "rgba(45,42,38,0.5)", borderColor: "rgba(61,154,154,0.3)" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#d4a843" }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3d9a9a" }} />
            </div>
            <span
              className="text-xs font-mono font-semibold bg-clip-text text-transparent ml-2"
              style={{ backgroundImage: "linear-gradient(135deg, #3d9a9a, #4db8b8, #d4a843)" }}
            >
              crowe-logic-ai.tsx
            </span>
          </div>

          {/* Code Content */}
          <div className="p-6 font-mono text-sm h-[400px] overflow-y-auto">
            {codeLines.map((line, i) => {
              const lineStr = String(line || "")

              return (
                <div
                  key={i}
                  className="animate-in fade-in slide-in-from-left-2 duration-200 leading-relaxed"
                  style={{ animationDelay: `${i * 0.02}s` }}
                >
                  {lineStr.startsWith("//") ? (
                    <span className="font-semibold" style={{ color: "#4db8b8" }}>{lineStr}</span>
                  ) : lineStr.startsWith("import") ? (
                    <span className="font-semibold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #d4a843, #e5b84d)" }}>
                      {lineStr}
                    </span>
                  ) : lineStr.includes("const") || lineStr.includes("await") ? (
                    <span className="font-semibold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #3d9a9a, #4db8b8)" }}>
                      {lineStr}
                    </span>
                  ) : lineStr.includes("✓") ? (
                    <span className="font-semibold" style={{ color: "#4db8b8" }}>
                      {lineStr}
                    </span>
                  ) : (
                    <span style={{ color: "#f5f0e8" }}>{lineStr || "\u00A0"}</span>
                  )}
                </div>
              )
            })}
            {stage === "generating" && (
              <div className="inline-block w-2 h-4 animate-pulse ml-1" style={{ background: "linear-gradient(180deg, #3d9a9a, #d4a843)" }} />
            )}
          </div>

          {/* Progress Bar — teal to golden */}
          <div className="px-6 pb-4">
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#2d2a26" }}>
              <div
                className="h-full transition-all duration-300 relative"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3d9a9a, #4db8b8, #d4a843)" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-mono" style={{ color: "#6b6560" }}>
              <span>Building platform...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Skip button */}
        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="text-sm transition-colors font-mono hover:opacity-80"
            style={{ color: "#6b6560" }}
          >
            Skip intro →
          </button>
        </div>
      </div>
    </div>
  )
}
