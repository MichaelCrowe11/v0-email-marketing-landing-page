"use client"

import { useEffect, useState } from "react"

export function TechShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [codeLines, setCodeLines] = useState<string[]>([])

  const codeSnippets = [
    "// Initializing Neural Network...",
    "const model = await tf.loadLayersModel('mycology-classifier')",
    "",
    "async function analyzeSporePattern(image: ImageData) {",
    "  const features = extractMorphology(image)",
    "  const prediction = await model.predict(features)",
    "  return {",
    "    species: prediction.species,",
    "    confidence: prediction.confidence,",
    "    characteristics: features.details",
    "  }",
    "}",
    "",
    "// Processing 10,000+ species database...",
    "const match = await crossReference(dnaSequence)",
    "console.log('Match found:', match.scientificName)",
    "",
    "// Generating comprehensive report...",
    "export const report = generateInsights(analysis)",
  ]

  const problems = [
    { title: "DNA Sequence Analysis", status: "✓ Complete", time: "0.3s" },
    { title: "Spore Pattern Recognition", status: "⚡ Processing", time: "1.2s" },
    { title: "Species Classification", status: "⚡ Processing", time: "0.8s" },
    { title: "Cross-referencing 10k+ Database", status: "✓ Complete", time: "0.5s" },
    { title: "Generating AI Insights", status: "⏳ Queued", time: "—" },
    { title: "3D Model Reconstruction", status: "✓ Complete", time: "2.1s" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % problems.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [problems.length])

  useEffect(() => {
    let currentLine = 0
    const typeInterval = setInterval(() => {
      if (currentLine < codeSnippets.length) {
        setCodeLines((prev) => [...prev, codeSnippets[currentLine]])
        currentLine++
      } else {
        setCodeLines([])
        currentLine = 0
      }
    }, 600)
    return () => clearInterval(typeInterval)
  }, [])

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-accent/10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
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

      <div className="absolute inset-0 overflow-hidden">
        {["{ }", "< />", "=>", "AI", "fn", "()", "[]", "ML", "DNA", "async"].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-foreground/70 font-mono text-base font-bold animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-8 w-full max-w-6xl">
        {/* Code output panel - left side */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="bg-background/95 backdrop-blur-sm border border-accent/30 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-accent/30">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-foreground/90 ml-2 font-mono font-semibold">mycology-ai.ts</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-foreground/70">Running</span>
              </div>
            </div>
            <div className="font-mono text-xs space-y-1 h-40 overflow-hidden">
              {codeLines.slice(-8).map((line, i) => (
                <div
                  key={i}
                  className="text-foreground animate-fade-in leading-relaxed"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {line || "\u00A0"}
                </div>
              ))}
              <div className="inline-block w-2 h-4 bg-accent animate-pulse" />
            </div>
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/40 to-accent/20 blur-3xl animate-pulse" />
          <div className="relative bg-background/90 backdrop-blur-sm p-8 rounded-2xl border-2 border-accent/30 shadow-2xl">
            <img
              src="/crowe-logic-logo.png"
              alt="Crowe Logic AI"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-accent/60 animate-pulse-slow"
            />
            <div className="absolute inset-0 pointer-events-none">
              {[
                { symbol: "</>", color: "text-foreground" },
                { symbol: "{AI}", color: "text-foreground" },
                { symbol: "fn()", color: "text-foreground" },
                { symbol: "ML", color: "text-foreground" },
                { symbol: "=>", color: "text-foreground" },
                { symbol: "DNA", color: "text-foreground" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`absolute ${item.color} font-mono text-base font-bold drop-shadow-lg`}
                  style={{
                    animation: `orbit ${5 + i * 0.5}s linear infinite`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                >
                  {item.symbol}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-accent/40 animate-ping-slow" />
          <div
            className="absolute inset-0 rounded-2xl border-2 border-accent/30 animate-ping-slow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="flex-1 w-full lg:w-auto">
          <div className="bg-background/95 backdrop-blur-sm border border-accent/30 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-accent/30">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-foreground font-bold">AI Processing Pipeline</span>
            </div>
            <div className="space-y-2">
              {problems.map((problem, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2.5 rounded transition-all duration-500 ${
                    i === activeIndex
                      ? "bg-accent/20 border border-accent/50 shadow-lg"
                      : "opacity-70 border border-transparent"
                  }`}
                >
                  <span className="text-sm font-semibold">{problem.status}</span>
                  <span className="text-xs text-foreground flex-1 font-medium">{problem.title}</span>
                  <span className="text-xs text-foreground/60 font-mono">{problem.time}</span>
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
          50% { opacity: 0.8; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(90px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}
