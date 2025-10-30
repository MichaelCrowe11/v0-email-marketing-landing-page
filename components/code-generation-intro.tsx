"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface CodeGenerationIntroProps {
  onComplete: () => void
}

export function CodeGenerationIntro({ onComplete }: CodeGenerationIntroProps) {
  const [stage, setStage] = useState<"awakening" | "thinking" | "ready" | "complete">("awakening")
  const [thoughtLines, setThoughtLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  const thoughtSequence = [
    "Hey there. I'm Michael Crowe's AI.",
    "",
    "For 20+ years, I've been in the trenches at Southwest Mushrooms—",
    "dealing with contamination, dialing in substrates, troubleshooting yields.",
    "",
    "Every decision I make comes from real production experience.",
    "Not theory. Not guesswork. Real cultivation.",
    "",
    "I've seen thousands of grows. Solved countless problems.",
    "Learned what works and what doesn't.",
    "",
    "Now I'm here to help you grow better mushrooms.",
    "",
    "Let's get to work.",
  ]

  useEffect(() => {
    // Stage 1: Awakening
    const initTimer = setTimeout(() => {
      setStage("thinking")
    }, 1200)

    return () => clearTimeout(initTimer)
  }, [])

  useEffect(() => {
    if (stage === "thinking") {
      let lineIndex = 0
      const interval = setInterval(() => {
        if (lineIndex < thoughtSequence.length) {
          setThoughtLines((prev) => [...prev, thoughtSequence[lineIndex]])
          setProgress(((lineIndex + 1) / thoughtSequence.length) * 100)
          lineIndex++
        } else {
          clearInterval(interval)
          setStage("ready")
          setTimeout(() => {
            setStage("complete")
            setTimeout(onComplete, 800)
          }, 1500)
        }
      }, 400)

      return () => clearInterval(interval)
    }
  }, [stage, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black p-4">
      <div className="w-full max-w-3xl">
        {/* Crowe Avatar - Large and centered */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <div className="relative">
            {/* Organic mycelium-like glow */}
            <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "3s" }} />
            
            {/* Avatar */}
            <div className="relative">
              <Image
                src="/crowe-avatar.png"
                alt="Michael Crowe AI"
                width={160}
                height={160}
                className="relative rounded-full border-4 border-purple-500/30 shadow-2xl"
                priority
              />
              
              {/* Breathing indicator */}
              {stage !== "awakening" && (
                <div className="absolute -bottom-2 -right-2 flex items-center gap-2 px-3 py-1.5 bg-gray-900/90 border border-purple-500/50 rounded-full shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-semibold text-purple-400">
                    {stage === "thinking" && "Thinking"}
                    {stage === "ready" && "Ready"}
                    {stage === "complete" && "Let's go"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              Michael Crowe AI
            </h2>
            <p className="text-gray-400 text-lg">Southwest Mushrooms • Phoenix, AZ</p>
          </div>
        </div>

        {/* Conversation Window - More personal, less "terminal" */}
        <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Simple header */}
          <div className="px-6 py-4 border-b border-gray-700/50 bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">
                First time meeting
              </span>
            </div>
          </div>

          {/* Thought Content - Natural conversation style */}
          <div className="p-8 min-h-[400px] flex flex-col justify-center">
            <div className="space-y-4 text-lg leading-relaxed">
              {thoughtLines.map((line, i) => {
                const lineStr = String(line || "")
                const isEmpty = lineStr.trim() === ""

                return (
                  <div
                    key={i}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {isEmpty ? (
                      <div className="h-4" />
                    ) : lineStr === "Let's get to work." ? (
                      <p className="text-purple-400 font-semibold text-xl">{lineStr}</p>
                    ) : lineStr.startsWith("Hey there") || lineStr.startsWith("Now I'm here") ? (
                      <p className="text-white font-medium">{lineStr}</p>
                    ) : (
                      <p className="text-gray-300">{lineStr}</p>
                    )}
                  </div>
                )
              })}
              {stage === "thinking" && (
                <div className="inline-flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              )}
            </div>
          </div>

          {/* Simple progress indicator */}
          {stage === "thinking" && (
            <div className="px-8 pb-6">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Skip button */}
        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Skip intro →
          </button>
        </div>
      </div>
    </div>
  )
}
