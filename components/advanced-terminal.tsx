"use client"

import { useEffect, useState } from "react"

export function AdvancedTerminal() {
  const [lines, setLines] = useState<string[]>([])

  const terminalOutput = [
    "[SYSTEM] Initializing Crowe Logic Analysis Engine...",
    "[DATABASE] Connected to cultivation database",
    "[SPECIES] Loading species identification model",
    "[SPECIES] Model loaded: 10,847 species indexed",
    "[ANALYSIS] Processing environmental data...",
    "[ANALYSIS] Temperature: 22.5°C | Humidity: 85% | CO2: 800ppm",
    "[CONTAMINATION] Running contamination detection...",
    "[CONTAMINATION] No contamination detected",
    "[YIELD] Calculating yield predictions...",
    "[YIELD] Estimated yield: 2.4 kg | Confidence: 94%",
    "[HARVEST] Optimal harvest window: 5-7 days",
    "[SYSTEM] Analysis complete",
  ]

  useEffect(() => {
    let currentLine = 0
    const interval = setInterval(() => {
      if (currentLine < terminalOutput.length) {
        setLines((prev) => [...prev, terminalOutput[currentLine]])
        currentLine++
      } else {
        setTimeout(() => {
          setLines([])
          currentLine = 0
        }, 3000)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black border border-border rounded-lg p-5 shadow-lg h-[400px] overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/20">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-mono font-bold text-white">Research Terminal</span>
        <div className="ml-auto text-xs font-mono text-white/60">Real-time Analysis</div>
      </div>
      <div className="font-mono text-xs space-y-1 overflow-y-auto h-[320px]">
        {lines.map((line, i) => {
          if (!line) return null

          return (
            <div
              key={i}
              className={`leading-relaxed ${
                line.includes("✓") || line.includes("complete")
                  ? "text-green-400"
                  : line.includes("[CONTAMINATION]")
                    ? "text-yellow-400"
                    : line.includes("[ERROR]")
                      ? "text-red-400"
                      : "text-white"
              }`}
            >
              {line}
            </div>
          )
        })}
        <div className="inline-block w-2 h-4 bg-white animate-pulse" />
      </div>
    </div>
  )
}
