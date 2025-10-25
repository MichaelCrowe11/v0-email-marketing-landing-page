"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

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
    { id: "1", title: "Contamination Detection", status: "pending", progress: 0 },
    { id: "2", title: "Species Classification", status: "pending", progress: 0 },
    { id: "3", title: "Substrate Optimization", status: "pending", progress: 0 },
    { id: "4", title: "Yield Prediction Model", status: "pending", progress: 0 },
  ])

  const codeSnippets = useMemo(
    () => [
      "genome.sequence()",
      "species.classify()",
      "neural.predict()",
      "genetic.optimize()",
      "dna.analyze()",
      "quantum.compute()",
      "ai.process()",
      "model.train()",
    ],
    [],
  )

  const colors = useMemo(
    () => ["text-cyan-400", "text-purple-400", "text-pink-400", "text-green-400", "text-yellow-400"],
    [],
  )

  const terminalMessages: TerminalLine[] = useMemo(
    () => [
      { text: "[INIT] Crowe Logic Engine v2.5.0 starting...", type: "info" },
      { text: "[DNA] Analyzing Pleurotus ostreatus genome...", type: "info" },
      { text: "[VISION] Processing contamination scan: 2048x2048px", type: "info" },
      { text: "[AI] Species identified: 99.2% confidence", type: "success" },
      { text: "[NEURAL] Substrate optimization: pH 6.5, moisture 65%", type: "success" },
      { text: "[QUANTUM] Environmental parameters calculated", type: "info" },
      { text: "[GENETIC] Yield prediction: 2.3kg per block", type: "success" },
      { text: "[SYSTEM] All cultivation systems nominal", type: "success" },
    ],
    [],
  )

  const updateParticles = useCallback(() => {
    setParticles((prev) =>
      prev.map((p) => ({
        ...p,
        angle: p.angle + p.speed * 0.01,
      })),
    )
  }, [])

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

    let animationFrame: number

    const animate = () => {
      updateParticles()
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [codeSnippets, colors, updateParticles])

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
  }, [terminalMessages])

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
                className={`absolute font-mono text-sm font-bold ${particle.color} whitespace-nowrap will-change-transform`}
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
                alt="Crowe Logic AI"
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

        {/* Bottom Section: Terminal and Enhanced Pipeline */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left: Advanced Terminal */}
          <div className="relative group bg-card/95 backdrop-blur-sm border-2 border-accent/40 rounded-xl p-5 shadow-2xl h-[350px] hover:border-accent/60 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-accent/30">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse" />
                <span className="text-sm font-mono font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  AI Processing Terminal
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-mono text-green-600 dark:text-green-400 font-semibold">ONLINE</span>
                </div>
              </div>
              <div className="font-mono text-xs space-y-2 overflow-y-auto h-[270px]">
                {terminalLines
                  .filter((line) => line)
                  .map((line, i) => (
                    <div
                      key={i}
                      className={`font-semibold animate-in fade-in slide-in-from-left-2 duration-300 ${
                        line?.type === "success"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent"
                          : line?.type === "warning"
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
                      }`}
                    >
                      {line?.text || ""}
                    </div>
                  ))}
                <div className="inline-block w-2 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right: Enhanced Pipeline Visualization */}
          <div className="relative group bg-card/95 backdrop-blur-sm border-2 border-accent/40 rounded-xl p-5 shadow-2xl h-[350px] hover:border-accent/60 transition-all duration-300 overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-accent/30">
                <Image
                  src="/crowe-avatar.png"
                  alt="Crowe Logic AI"
                  width={24}
                  height={24}
                  className="rounded-full border-2 border-accent/50 animate-pulse"
                />
                <span className="text-sm font-mono font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Neural Processing Pipeline
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-mono text-accent font-semibold">ACTIVE</span>
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto h-[270px]">
                {codeBlocks.map((block, index) => (
                  <div key={block.id} className="relative">
                    {/* Animated connection line with data flow */}
                    {index < codeBlocks.length - 1 && (
                      <div className="absolute left-8 top-full h-4 w-0.5 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-b from-accent/50 to-transparent" />
                        {block.status === "complete" && (
                          <div className="absolute top-0 w-full h-2 bg-gradient-to-b from-accent to-transparent animate-pulse" />
                        )}
                      </div>
                    )}

                    <div
                      className={`relative p-3 rounded-lg border-2 transition-all duration-300 ${
                        block.status === "complete"
                          ? "border-green-500/60 bg-gradient-to-br from-green-500/10 to-emerald-500/5 shadow-lg shadow-green-500/20"
                          : block.status === "generating"
                            ? "border-accent/60 bg-gradient-to-br from-accent/10 to-purple-500/5 shadow-lg shadow-accent/20"
                            : "border-foreground/20 bg-background/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative flex-shrink-0">
                          {block.status === "generating" && (
                            <>
                              <div className="absolute inset-0 bg-accent/30 rounded-full blur-lg animate-pulse" />
                              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full opacity-50 blur-sm animate-pulse" />
                            </>
                          )}
                          <Image
                            src="/crowe-avatar.png"
                            alt="Processing"
                            width={36}
                            height={36}
                            className={`relative rounded-full border-2 transition-all duration-300 ${
                              block.status === "generating"
                                ? "border-accent shadow-lg shadow-accent/50 animate-spin-slow"
                                : block.status === "complete"
                                  ? "border-green-500 shadow-lg shadow-green-500/50"
                                  : "border-foreground/20 opacity-50"
                            }`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">
                            {block.title}
                          </div>
                          {block.status === "generating" && (
                            <div className="text-xs font-mono text-accent/80">Processing neural pathways...</div>
                          )}
                          {block.status === "complete" && (
                            <div className="text-xs font-mono text-green-600 dark:text-green-400">
                              Analysis complete ✓
                            </div>
                          )}
                        </div>

                        <div className="text-2xl">
                          {block.status === "complete" ? (
                            <span className="text-green-500">✓</span>
                          ) : block.status === "generating" ? (
                            <span className="text-accent animate-pulse">⚡</span>
                          ) : (
                            <span className="text-foreground/30">○</span>
                          )}
                        </div>
                      </div>

                      {block.status === "generating" && (
                        <div className="relative h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-200 relative overflow-hidden"
                            style={{ width: `${block.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                          </div>
                          {/* Floating particles */}
                          <div className="absolute inset-0 flex items-center">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 h-1 rounded-full bg-white/60 animate-pulse"
                                style={{
                                  marginLeft: `${(i + 1) * 25}%`,
                                  animationDelay: `${i * 0.2}s`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 space-y-6">
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Twenty years of professional mycology expertise, distilled into AI-powered cultivation intelligence
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/pricing">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/chat">Try Free Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
