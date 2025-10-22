"use client"

import { useEffect, useState } from "react"

export function TechShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [terminalLines, setTerminalLines] = useState<string[]>([])

  const codeSnippets = [
    "// Initializing Mycology Neural Network...",
    "import { TensorFlow } from '@tensorflow/tfjs'",
    "import { DNASequencer } from './sequencer'",
    "",
    "const model = await tf.loadLayersModel({",
    "  modelUrl: 'mycology-classifier-v3',",
    "  species: 10847,",
    "  accuracy: 0.9847",
    "})",
    "",
    "async function analyzeSporePattern(img: ImageData) {",
    "  const morphology = extractFeatures(img)",
    "  const dna = await sequenceDNA(morphology)",
    "  const prediction = model.predict(dna)",
    "  ",
    "  return {",
    "    species: prediction.scientificName,",
    "    confidence: prediction.score,",
    "    characteristics: morphology.details,",
    "    habitat: prediction.environment",
    "  }",
    "}",
    "",
    "// Cross-referencing 10,847 species...",
    "const match = await db.query(dnaSequence)",
    "console.log('✓ Match:', match.name)",
  ]

  const terminalOutput = [
    "[AI] Loading neural network weights...",
    "[AI] ✓ Model loaded: 10,847 species",
    "[AI] Initializing DNA sequencer...",
    "[AI] ✓ Sequencer ready",
    "[AI] Processing spore patterns...",
    "[AI] ⚡ Analyzing morphology...",
    "[AI] ✓ Features extracted: 247 markers",
    "[AI] Cross-referencing database...",
    "[AI] ✓ Match found: 98.47% confidence",
    "[AI] Generating comprehensive report...",
    "[AI] ✓ Analysis complete",
  ]

  const problems = [
    { title: "DNA Sequence Analysis", status: "✓", time: "0.3s", color: "text-green-400" },
    { title: "Spore Pattern Recognition", status: "⚡", time: "1.2s", color: "text-yellow-400" },
    { title: "Species Classification", status: "⚡", time: "0.8s", color: "text-blue-400" },
    { title: "Database Cross-reference", status: "✓", time: "0.5s", color: "text-green-400" },
    { title: "AI Insight Generation", status: "⏳", time: "—", color: "text-gray-400" },
    { title: "3D Model Reconstruction", status: "✓", time: "2.1s", color: "text-green-400" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % problems.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [problems.length])

  useEffect(() => {
    let currentLine = 0
    const typeInterval = setInterval(() => {
      if (currentLine < codeSnippets.length) {
        setCodeLines((prev) => [...prev, codeSnippets[currentLine]])
        currentLine++
      } else {
        setTimeout(() => {
          setCodeLines([])
          currentLine = 0
        }, 2000)
      }
    }, 400)
    return () => clearInterval(typeInterval)
  }, [])

  useEffect(() => {
    let currentLine = 0
    const terminalInterval = setInterval(() => {
      if (currentLine < terminalOutput.length) {
        setTerminalLines((prev) => [...prev, terminalOutput[currentLine]])
        currentLine++
      } else {
        setTimeout(() => {
          setTerminalLines([])
          currentLine = 0
        }, 2000)
      }
    }, 800)
    return () => clearInterval(terminalInterval)
  }, [])

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-accent/20 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--accent)) 1px, transparent 1px),
                             linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              animation: "grid-flow 20s linear infinite",
            }}
          />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["{ }", "< />", "=>", "AI", "fn", "()", "[]", "ML", "DNA", "async", "await", "const", "=>", "{}"].map(
          (symbol, i) => (
            <div
              key={i}
              className="absolute text-foreground/60 font-mono text-lg font-bold animate-float"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13) % 100}%`,
                animationDelay: `${(i * 0.5) % 3}s`,
                animationDuration: `${5 + (i % 3)}s`,
              }}
            >
              {symbol}
            </div>
          ),
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 p-4 md:p-8 w-full max-w-full">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/50 to-accent/30 blur-3xl animate-pulse" />
          <div className="relative bg-background/95 backdrop-blur-sm p-8 rounded-2xl border-2 border-accent/40 shadow-2xl">
            <img
              src="/crowe-logic-logo.png"
              alt="Crowe Logic AI"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-accent/70 animate-pulse-slow"
            />
            <div className="absolute inset-0 pointer-events-none">
              {[
                { symbol: "</>", color: "text-blue-400" },
                { symbol: "{AI}", color: "text-green-400" },
                { symbol: "fn()", color: "text-yellow-400" },
                { symbol: "ML", color: "text-purple-400" },
                { symbol: "=>", color: "text-pink-400" },
                { symbol: "DNA", color: "text-cyan-400" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`absolute ${item.color} font-mono text-lg font-bold drop-shadow-[0_0_8px_currentColor]`}
                  style={{
                    animation: `orbit ${6 + i * 0.5}s linear infinite`,
                    animationDelay: `${i * 1}s`,
                  }}
                >
                  {item.symbol}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-accent/50 animate-ping-slow" />
          <div
            className="absolute inset-0 rounded-2xl border-2 border-accent/40 animate-ping-slow"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
          {/* Code Editor Panel */}
          <div className="w-full">
            <div className="bg-background/95 backdrop-blur-sm border-2 border-accent/40 rounded-xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-accent/30">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-foreground ml-2 font-mono font-semibold">mycology-ai.ts</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-foreground/80 font-medium">Running</span>
                </div>
              </div>
              <div className="font-mono text-sm space-y-1 h-48 overflow-hidden">
                {codeLines.slice(-10).map((line, i) => (
                  <div
                    key={i}
                    className="text-foreground animate-fade-in leading-relaxed"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                <div className="inline-block w-2 h-5 bg-accent animate-pulse" />
              </div>
            </div>
          </div>

          {/* Terminal Output Panel */}
          <div className="w-full">
            <div className="bg-black/95 backdrop-blur-sm border-2 border-accent/40 rounded-xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-accent/30">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm text-green-400 font-mono font-bold">Terminal</span>
              </div>
              <div className="font-mono text-sm space-y-1.5 h-48 overflow-hidden">
                {terminalLines.slice(-8).map((line, i) => (
                  <div
                    key={i}
                    className="text-green-400 animate-fade-in leading-relaxed"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {line}
                  </div>
                ))}
                <div className="inline-block w-2 h-5 bg-green-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl">
          <div className="bg-background/95 backdrop-blur-sm border-2 border-accent/40 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-accent/30">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
              <span className="text-base text-foreground font-bold">AI Processing Pipeline</span>
              <div className="ml-auto text-xs text-foreground/70 font-mono">Real-time</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {problems.map((problem, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    i === activeIndex
                      ? "bg-accent/20 border-2 border-accent/60 shadow-lg scale-105"
                      : "opacity-70 border-2 border-transparent bg-accent/5"
                  }`}
                >
                  <span className={`text-lg font-bold ${problem.color}`}>{problem.status}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground font-medium truncate">{problem.title}</div>
                    <div className="text-xs text-foreground/60 font-mono">{problem.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-150px) translateX(40px); opacity: 0; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 0.4; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}
