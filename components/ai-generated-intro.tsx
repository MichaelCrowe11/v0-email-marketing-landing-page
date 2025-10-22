"use client"

import { useState, useEffect } from "react"

export function AIGeneratedIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<"logo" | "analysis" | "generation" | "complete">("logo")
  const [analysisItems, setAnalysisItems] = useState<string[]>([])
  const [generatedItems, setGeneratedItems] = useState<string[]>([])
  const [metrics, setMetrics] = useState({ species: 0, accuracy: 0, speed: 0 })
  const [progress, setProgress] = useState(0)
  const [codeStreams, setCodeStreams] = useState<
    Array<{ id: number; code: string; color: string; x: number; delay: number }>
  >([])
  const [statusText, setStatusText] = useState("Initializing AI Systems...")

  // Stage 1: AI Analysis Process
  const analysisSequence = [
    { icon: "🔬", title: "Species Identification", desc: "Neural network analyzing 15,000+ species", color: "blue" },
    { icon: "🧬", title: "DNA Pattern Recognition", desc: "Processing genetic markers in real-time", color: "purple" },
    { icon: "📊", title: "Growth Optimization", desc: "AI calculating optimal cultivation parameters", color: "green" },
    { icon: "🎯", title: "Contamination Detection", desc: "Computer vision scanning for threats", color: "red" },
  ]

  // Stage 2: Code Generation Process
  const generationSequence = [
    { icon: "⚡", title: "Smart Dashboard", desc: "Real-time monitoring & analytics", color: "yellow" },
    { icon: "💬", title: "AI Chat Assistant", desc: "Expert knowledge at your fingertips", color: "blue" },
    { icon: "📚", title: "Knowledge Base", desc: "20+ years of research compiled", color: "purple" },
    { icon: "🌐", title: "Community Forum", desc: "Connect with expert mycologists", color: "green" },
  ]

  const codeSnippets = [
    { code: "import { NeuralNetwork } from '@ai/core'", color: "text-purple-400" },
    { code: "const species = await analyzeImage(sample)", color: "text-blue-400" },
    { code: "if (contamination.detected) alert(user)", color: "text-red-400" },
    { code: "export async function identifySpecies() {", color: "text-green-400" },
    { code: "  const model = loadMycologyModel()", color: "text-cyan-400" },
    { code: "  return prediction.confidence > 0.95", color: "text-yellow-400" },
    { code: "class MycologyAI extends BaseModel {", color: "text-pink-400" },
    { code: "  async train(dataset: Species[]) {", color: "text-orange-400" },
    { code: "const dna = sequence.map(gene => gene.id)", color: "text-indigo-400" },
    { code: "await db.insert({ species, confidence })", color: "text-teal-400" },
    { code: "vision.detect(image).then(results =>", color: "text-lime-400" },
    { code: "const growth = optimize(temperature, pH)", color: "text-fuchsia-400" },
    { code: "interface MycologyData { id: string }", color: "text-violet-400" },
    { code: "return { accuracy: 99.2, speed: 45ms }", color: "text-emerald-400" },
    { code: "neural.predict(features).confidence", color: "text-sky-400" },
    { code: "export const cultivate = (params) => {", color: "text-rose-400" },
  ]

  const statusMessages = [
    "Initializing AI Systems...",
    "Loading Neural Networks...",
    "Analyzing 15,000+ Species...",
    "Training Computer Vision...",
    "Optimizing Growth Parameters...",
    "Deploying Expert Knowledge...",
    "Finalizing Platform...",
  ]

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Stage 1: Logo (2s)
    timers.push(setTimeout(() => setStage("analysis"), 2000))

    // Stage 2: Analysis items
    analysisSequence.forEach((_, index) => {
      timers.push(
        setTimeout(
          () => {
            setAnalysisItems((prev) => [...prev, analysisSequence[index].title])
          },
          2500 + index * 800,
        ),
      )
    })

    // Animate metrics during analysis
    timers.push(
      setTimeout(() => {
        const interval = setInterval(() => {
          setMetrics((prev) => ({
            species: Math.min(prev.species + 500, 15000),
            accuracy: Math.min(prev.accuracy + 3, 99),
            speed: Math.min(prev.speed + 5, 100),
          }))
        }, 50)
        timers.push(setTimeout(() => clearInterval(interval), 2000) as any)
      }, 3000),
    )

    // Stage 3: Generation
    timers.push(setTimeout(() => setStage("generation"), 6000))

    generationSequence.forEach((_, index) => {
      timers.push(
        setTimeout(
          () => {
            setGeneratedItems((prev) => [...prev, generationSequence[index].title])
          },
          6500 + index * 700,
        ),
      )
    })

    // Complete
    timers.push(
      setTimeout(() => {
        setStage("complete")
        setTimeout(onComplete, 500)
      }, 10000),
    )

    const streamInterval = setInterval(() => {
      const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      const newStream = {
        id: Date.now() + Math.random(),
        code: randomSnippet.code,
        color: randomSnippet.color,
        x: Math.random() * 95, // Keep within viewport
        delay: Math.random() * 0.5,
      }
      setCodeStreams((prev) => [...prev.slice(-30), newStream]) // Keep more streams visible
    }, 100) // Faster generation for denser effect

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1

        // Update status text based on progress
        const statusIndex = Math.floor((newProgress / 100) * statusMessages.length)
        if (statusIndex < statusMessages.length) {
          setStatusText(statusMessages[statusIndex])
        }

        if (newProgress >= 100) {
          clearInterval(progressInterval)
          clearInterval(streamInterval)
          setTimeout(onComplete, 800)
          return 100
        }
        return newProgress
      })
    }, 50) // 5 second total duration

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(streamInterval)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  if (progress >= 100) return null

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <div className="absolute inset-0">
        {codeStreams.map((stream) => (
          <div
            key={stream.id}
            className={`absolute font-mono text-base font-semibold ${stream.color} whitespace-nowrap animate-stream`}
            style={{
              left: `${stream.x}%`,
              top: "-50px",
              animation: `stream 4s linear forwards`,
              animationDelay: `${stream.delay}s`,
              textShadow: "0 0 10px currentColor",
            }}
          >
            {stream.code}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/60 to-black pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Logo with animated glow */}
        <div
          className="relative mb-8"
          style={{
            filter: `drop-shadow(0 0 ${20 + progress / 5}px rgba(255,255,255,${0.3 + progress / 200}))`,
          }}
        >
          <img
            src="/crowe-logic-logo.png"
            alt="Crowe Logic"
            className="h-40 w-40 rounded-full mx-auto ring-4 ring-white/20"
            style={{
              transform: `scale(${1 + progress / 1000})`,
              transition: "transform 0.3s ease-out",
            }}
          />

          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-white"
              style={{
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 45 + progress * 3.6}deg) translateY(-80px)`,
                opacity: 0.6 + Math.sin((progress + i * 45) * 0.1) * 0.4,
                transition: "all 0.1s linear",
              }}
            />
          ))}
        </div>

        {/* Title */}
        <h1 className="text-7xl font-bold text-white mb-3 tracking-tight">Crowe Logic</h1>
        <p className="text-3xl text-white/90 mb-12 font-light">AI-Powered Mycology Intelligence</p>

        {/* Status text */}
        <p className="text-xl text-white/70 mb-8 font-mono">{statusText}</p>

        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-sm text-white/60 mb-3 font-mono">
            <span>Loading Platform</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-cyan-500 transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: `0 0 20px rgba(139, 92, 246, ${progress / 100})`,
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-white"
              style={{
                opacity: 0.3 + (Math.sin(progress * 0.1 + i * 1.2) + 1) * 0.35,
                transform: `scale(${1 + (Math.sin(progress * 0.1 + i * 1.2) + 1) * 0.15})`,
                transition: "all 0.1s ease-out",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes stream {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
