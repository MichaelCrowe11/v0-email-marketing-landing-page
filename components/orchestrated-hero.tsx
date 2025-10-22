"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CodeParticle {
  id: number
  code: string
  angle: number
  radius: number
  color: string
  speed: number
}

interface TerminalLine {
  text: string
  type: "success" | "info" | "warning"
}

interface CodeBlock {
  id: string
  title: string
  status: "pending" | "generating" | "complete"
  progress: number
}

export function OrchestratedHero() {
  const [particles, setParticles] = useState<CodeParticle[]>([])
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([
    { id: "1", title: "DNA Sequencing", status: "pending", progress: 0 },
    { id: "2", title: "Species Classification", status: "pending", progress: 0 },
    { id: "3", title: "Neural Network", status: "pending", progress: 0 },
    { id: "4", title: "Genetic Algorithm", status: "pending", progress: 0 },
  ])

  const codeSnippets = [
    "genome.sequence()",
    "species.classify()",
    "neural.predict()",
    "genetic.optimize()",
    "dna.analyze()",
    "quantum.compute()",
    "ai.process()",
    "model.train()",
  ]

  const colors = ["text-cyan-400", "text-purple-400", "text-pink-400", "text-green-400", "text-yellow-400"]

  const terminalMessages: TerminalLine[] = [
    { text: "[AI] Initializing Crowe Logic Engine...", type: "info" },
    { text: "[DNA] Sequencing genome: 10,847 base pairs", type: "info" },
    { text: "[NEURAL] Model loaded: 98.47% accuracy", type: "success" },
    { text: "[GENETIC] Optimization complete", type: "success" },
    { text: "[QUANTUM] Qubits entangled: 256", type: "info" },
    { text: "[SYSTEM] All systems operational", type: "success" },
  ]

  // Initialize code particles
  useEffect(() => {
    const newParticles: CodeParticle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      angle: (i / 20) * Math.PI * 2,
      radius: 120 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.3 + Math.random() * 0.5,
    }))
    setParticles(newParticles)

    let time = 0
    let animationFrame: number

    const animate = () => {
      time += 0.01
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          angle: p.angle + p.speed * 0.01,
        })),
      )
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Terminal animation
  useEffect(() => {
    let lineIndex = 0
    const interval = setInterval(() => {
      if (lineIndex < terminalMessages.length) {
        setTerminalLines((prev) => [...prev, terminalMessages[lineIndex]])
        lineIndex++
      } else {
        setTimeout(() => {
          setTerminalLines([])
          lineIndex = 0
        }, 3000)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  // Code blocks animation
  useEffect(() => {
    let currentBlock = 0
    const interval = setInterval(() => {
      setCodeBlocks((prev) => {
        const updated = [...prev]
        if (currentBlock < updated.length) {
          if (updated[currentBlock].status === "pending") {
            updated[currentBlock].status = "generating"
          } else if (updated[currentBlock].status === "generating") {
            updated[currentBlock].progress += 20
            if (updated[currentBlock].progress >= 100) {
              updated[currentBlock].status = "complete"
              currentBlock++
            }
          }
        } else {
          setTimeout(() => {
            currentBlock = 0
            updated.forEach((block) => {
              block.status = "pending"
              block.progress = 0
            })
          }, 2000)
        }
        return updated
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen pt-20 pb-12 px-4 overflow-hidden bg-gradient-to-b from-background via-background to-accent/5">
      <div className="mx-auto max-w-7xl">
        {/* Top Section: Code Swirl with Avatar */}
        <div className="relative h-[400px] flex items-center justify-center mb-8">
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Floating code particles */}
          {particles.map((particle) => {
            const x = Math.cos(particle.angle) * particle.radius
            const y = Math.sin(particle.angle) * particle.radius
            return (
              <div
                key={particle.id}
                className={`absolute font-mono text-sm font-bold ${particle.color} whitespace-nowrap`}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  textShadow: "0 0 10px currentColor",
                }}
              >
                {particle.code}
              </div>
            )
          })}

          {/* Center: Crowe Logic Avatar */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl animate-pulse" />
              <Image
                src="/crowe-logic-logo.png"
                alt="Crowe Logic"
                width={120}
                height={120}
                className="relative rounded-full border-4 border-accent/50 shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                LIVE
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Crowe Logic AI</h1>
              <p className="text-lg text-foreground/80">Advanced Mycology Intelligence</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Terminal and Code Generation Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left: Advanced Terminal */}
          <div className="bg-black/95 backdrop-blur-sm border-2 border-accent/40 rounded-xl p-5 shadow-2xl h-[350px]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-accent/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-400 font-mono font-bold">AI Processing Terminal</span>
            </div>
            <div className="font-mono text-xs space-y-2 overflow-y-auto h-[270px]">
              {terminalLines
                .filter((line) => line)
                .map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line?.type === "success"
                        ? "text-green-400"
                        : line?.type === "warning"
                          ? "text-yellow-400"
                          : "text-cyan-400"
                    }`}
                  >
                    {line?.text || ""}
                  </div>
                ))}
              <div className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
            </div>
          </div>

          {/* Right: Live Code Generation */}
          <div className="bg-background/50 backdrop-blur-sm border-2 border-accent/40 rounded-xl p-5 shadow-2xl h-[350px]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-accent/30">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-accent font-mono font-bold">Live Code Generation</span>
            </div>
            <div className="space-y-3 overflow-y-auto h-[270px]">
              {codeBlocks.map((block) => (
                <div
                  key={block.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    block.status === "complete"
                      ? "border-green-500/60 bg-green-500/10"
                      : block.status === "generating"
                        ? "border-accent/60 bg-accent/10"
                        : "border-foreground/20 bg-background/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{block.title}</span>
                    <span className="text-xs font-mono text-foreground/70">
                      {block.status === "complete" ? "✓" : block.status === "generating" ? "⚡" : "⏳"}
                    </span>
                  </div>
                  {block.status === "generating" && (
                    <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-200"
                        style={{ width: `${block.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 space-y-6">
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto">
            Experience the power of AI-driven mycology research with 20+ years of expertise
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
