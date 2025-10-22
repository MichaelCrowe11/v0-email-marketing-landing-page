"use client"

import { useEffect, useState } from "react"

export function AdvancedTerminal() {
  const [lines, setLines] = useState<string[]>([])

  const terminalOutput = [
    "[SYSTEM] Initializing Crowe Logic AI Engine v3.0...",
    "[GENETIC] Loading genetic algorithm optimizer...",
    "[GENETIC] Population size: 100 | Mutation rate: 0.01 | Generations: 1000",
    "[DNA] Sequencing mushroom genome: ATGCTAGCTAGC...",
    "[DNA] ✓ Sequence complete: 10,847 base pairs analyzed",
    "[NEURAL] Loading deep learning model...",
    "[NEURAL] ✓ Model loaded: 10,847 species | 98.47% accuracy",
    "[QUANTUM] Initializing quantum neural network...",
    "[QUANTUM] ✓ Qubits entangled: 256 | Coherence time: 100μs",
    "[PIPELINE] Starting AI processing pipeline...",
    "[PIPELINE] Stage 1/6: Spore pattern recognition... ✓ 0.3s",
    "[PIPELINE] Stage 2/6: DNA sequence analysis... ✓ 1.2s",
    "[PIPELINE] Stage 3/6: Morphological feature extraction... ✓ 0.8s",
    "[PIPELINE] Stage 4/6: Species classification... ✓ 0.5s",
    "[PIPELINE] Stage 5/6: Habitat prediction... ✓ 0.4s",
    "[PIPELINE] Stage 6/6: 3D model reconstruction... ✓ 2.1s",
    "[GENETIC] Running genetic algorithm optimization...",
    "[GENETIC] Generation 100: Best fitness = 0.847",
    "[GENETIC] Generation 200: Best fitness = 0.912",
    "[GENETIC] Generation 300: Best fitness = 0.956",
    "[GENETIC] ✓ Optimization complete: Optimal conditions found",
    "[BLOCKCHAIN] Verifying data integrity on distributed ledger...",
    "[BLOCKCHAIN] ✓ Block validated: Hash 0x7f3a9b2c...",
    "[EDGE-AI] Deploying model to edge devices...",
    "[EDGE-AI] ✓ Model deployed: 47ms inference time",
    "[FEDERATED] Aggregating knowledge from 1,247 nodes...",
    "[FEDERATED] ✓ Global model updated: +2.3% accuracy",
    "[VECTOR-DB] Indexing embeddings in vector database...",
    "[VECTOR-DB] ✓ 10,847 species indexed | Query time: 12ms",
    "[TRANSFORMER] Running attention mechanism...",
    "[TRANSFORMER] ✓ Context understood: 2,048 tokens processed",
    "[REINFORCEMENT] Training agent with PPO algorithm...",
    "[REINFORCEMENT] Episode 1000: Reward = 847.3",
    "[CRISPR] Analyzing gene editing possibilities...",
    "[CRISPR] ✓ Target sequences identified: 23 candidates",
    "[SYSTEM] ✓ All systems operational | Ready for production",
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
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black/95 backdrop-blur-sm border-2 border-accent/40 rounded-xl p-5 shadow-2xl h-[400px] overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-accent/30">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm text-green-400 font-mono font-bold">Crowe Logic Terminal</span>
        <div className="ml-auto text-xs text-green-400/70 font-mono">Advanced AI Systems</div>
      </div>
      <div className="font-mono text-xs space-y-1 overflow-y-auto h-[320px] scrollbar-thin scrollbar-thumb-accent/50">
        {lines.map((line, i) => {
          if (!line) return null

          return (
            <div
              key={i}
              className={`animate-fade-in leading-relaxed ${
                line.includes("✓")
                  ? "text-green-400"
                  : line.includes("[GENETIC]")
                    ? "text-purple-400"
                    : line.includes("[DNA]")
                      ? "text-cyan-400"
                      : line.includes("[QUANTUM]")
                        ? "text-pink-400"
                        : line.includes("[NEURAL]")
                          ? "text-blue-400"
                          : "text-green-300"
              }`}
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              {line}
            </div>
          )
        })}
        <div className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
      </div>
    </div>
  )
}
