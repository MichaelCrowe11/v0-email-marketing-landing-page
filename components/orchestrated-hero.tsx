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
  baseRadius: number
}

interface TerminalLine {
  text: string
  type: "success" | "info" | "warning"
  command?: string
  output?: string
}

interface CodeBlock {
  id: string
  title: string
  status: "pending" | "generating" | "complete"
  progress: number
  description?: string
  metrics?: {
    accuracy?: string
    processingTime?: string
    dataPoints?: string
  }
}

export function OrchestratedHero() {
  const [particles, setParticles] = useState<CodeParticle[]>([])
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([
    { 
      id: "1", 
      title: "Contamination Detection", 
      status: "pending", 
      progress: 0,
      description: "Analyzing substrate for bacterial and fungal contaminants using computer vision",
      metrics: { accuracy: "99.2%", processingTime: "1.2s", dataPoints: "2048" }
    },
    { 
      id: "2", 
      title: "Species Classification", 
      status: "pending", 
      progress: 0,
      description: "Identifying mushroom species through morphological analysis and genetic markers",
      metrics: { accuracy: "98.7%", processingTime: "0.8s", dataPoints: "1536" }
    },
    { 
      id: "3", 
      title: "Substrate Optimization", 
      status: "pending", 
      progress: 0,
      description: "Calculating optimal substrate composition for maximum yield and colonization",
      metrics: { accuracy: "97.5%", processingTime: "2.1s", dataPoints: "3072" }
    },
    { 
      id: "4", 
      title: "Yield Prediction Model", 
      status: "pending", 
      progress: 0,
      description: "Forecasting harvest yields based on environmental parameters and growth patterns",
      metrics: { accuracy: "96.8%", processingTime: "1.5s", dataPoints: "2560" }
    },
  ])
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)

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
      { 
        text: "[INIT] Crowe Logic Engine v2.5.0 starting...", 
        type: "info",
        command: "INIT",
        output: "Crowe Logic Engine v2.5.0 starting..."
      },
      { 
        text: "[DNA] Analyzing Pleurotus ostreatus genome...", 
        type: "info",
        command: "DNA",
        output: "Analyzing Pleurotus ostreatus genome..."
      },
      { 
        text: "[VISION] Processing contamination scan: 2048x2048px", 
        type: "info",
        command: "VISION",
        output: "Processing contamination scan: 2048x2048px"
      },
      { 
        text: "[AI] Species identified: 99.2% confidence", 
        type: "success",
        command: "AI",
        output: "Species identified: 99.2% confidence"
      },
      { 
        text: "[NEURAL] Substrate optimization: pH 6.5, moisture 65%", 
        type: "success",
        command: "NEURAL",
        output: "Substrate optimization: pH 6.5, moisture 65%"
      },
      { 
        text: "[QUANTUM] Environmental parameters calculated", 
        type: "info",
        command: "QUANTUM",
        output: "Environmental parameters calculated"
      },
      { 
        text: "[GENETIC] Yield prediction: 2.3kg per block", 
        type: "success",
        command: "GENETIC",
        output: "Yield prediction: 2.3kg per block"
      },
      { 
        text: "[SYSTEM] All cultivation systems nominal", 
        type: "success",
        command: "SYSTEM",
        output: "All cultivation systems nominal"
      },
    ],
    [],
  )

  // Detect mobile and reduced motion preferences
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    
    checkMobile()
    const cleanupReducedMotion = checkReducedMotion()
    
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      cleanupReducedMotion?.()
    }
  }, [])

  // Handle scroll for parallax effect
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prefersReducedMotion])

  const updateParticles = useCallback(() => {
    if (prefersReducedMotion) return
    
    setParticles((prev) =>
      prev.map((p) => ({
        ...p,
        angle: p.angle + p.speed * 0.01,
      })),
    )
  }, [prefersReducedMotion])

  // Initialize code particles
  useEffect(() => {
    // Optimize particle count for mobile: 10 on mobile, 20 on desktop
    const particleCount = isMobile ? 10 : 20
    const baseRadius = 120
    
    const newParticles: CodeParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      angle: (i / particleCount) * Math.PI * 2,
      radius: baseRadius + Math.random() * 60,
      baseRadius: baseRadius + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.3 + Math.random() * 0.5,
    }))
    setParticles(newParticles)

    if (prefersReducedMotion) return

    let animationFrame: number

    const animate = () => {
      updateParticles()
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [codeSnippets, colors, updateParticles, isMobile, prefersReducedMotion])

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
    <section className="relative min-h-screen pt-20 pb-12 px-4 overflow-hidden bg-gradient-to-b from-background via-background to-accent/5 mobile-contain-layout">
      <div className="mx-auto max-w-7xl mobile-contain-content">
        {/* Top Section: Code Swirl with Avatar */}
        <div className="relative h-[400px] flex items-center justify-center mb-8">
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Floating code particles */}
          {particles.map((particle) => {
            // Apply parallax effect: particles move slower than scroll (0.3x speed)
            const parallaxOffset = prefersReducedMotion ? 0 : scrollY * 0.3
            const adjustedRadius = particle.baseRadius + parallaxOffset * 0.1
            
            const x = Math.cos(particle.angle) * adjustedRadius
            const y = Math.sin(particle.angle) * adjustedRadius - parallaxOffset
            
            return (
              <div
                key={particle.id}
                className={`absolute font-mono text-sm font-bold ${particle.color} whitespace-nowrap`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0)`,
                  textShadow: "0 0 10px currentColor",
                  willChange: prefersReducedMotion ? 'auto' : 'transform',
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
                alt="Crowe Logic AI - Created by Michael Crowe"
                width={120}
                height={120}
                className="relative rounded-full border-4 border-accent/50 shadow-2xl"
                priority
                quality={85}
              />
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                LIVE
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Crowe Logic AI</h1>
              <p className="text-lg text-foreground/80 mb-3">Advanced Mycology Intelligence</p>
              
              {/* Credentials Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">Created by Michael Crowe</span>
                </div>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-sm font-semibold text-purple-400">20+ Years Experience</span>
              </div>
              
              {/* Southwest Mushrooms Reference */}
              <p className="text-sm text-muted-foreground mt-2">
                Powered by{" "}
                <a 
                  href="https://southwestmushrooms.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors underline underline-offset-2"
                >
                  Southwest Mushrooms
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Terminal and Enhanced Pipeline */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left: Ultra-Premium AI Processing Terminal */}
          <div className="relative group rounded-2xl h-[350px] overflow-hidden terminal-mobile-optimized mobile-contain-paint">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/60 to-black/40 backdrop-blur-2xl rounded-2xl border border-white/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/10 to-pink-500/5 rounded-2xl" />

            {/* Holographic scan lines */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(120,119,198,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-purple-500/50 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-pink-500/50 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/50 rounded-br-2xl" />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col">
              {/* Enhanced header with holographic effect */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/30">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-md animate-pulse" />
                  <div className="relative w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50" />
                </div>
                <span className="text-sm font-code font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider">
                  AI PROCESSING TERMINAL
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                  <span className="text-xs font-code text-green-400 font-bold tracking-wider">ONLINE</span>
                </div>
              </div>

              {/* Terminal content with enhanced styling and syntax highlighting */}
              <div className="flex-1 font-code text-xs space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
                {terminalLines
                  .filter((line) => line)
                  .map((line, i) => (
                    <div
                      key={i}
                      className="font-semibold animate-in fade-in slide-in-from-left-2 duration-300 group/line"
                      style={{
                        lineHeight: '1.8',
                        willChange: 'transform',
                        transform: 'translate3d(0, 0, 0)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-purple-400 flex-shrink-0 font-bold">❯</span>
                        <div className="flex-1 leading-relaxed">
                          {/* Syntax highlighted command */}
                          <span className={`font-bold ${
                            line?.type === "success"
                              ? "text-green-400"
                              : line?.type === "warning"
                                ? "text-yellow-400"
                                : "text-cyan-400"
                          }`} style={{ textShadow: "0 0 8px currentColor" }}>
                            [{line?.command}]
                          </span>
                          {/* Output text with subtle color */}
                          <span className={`ml-2 ${
                            line?.type === "success"
                              ? "text-green-300/90"
                              : line?.type === "warning"
                                ? "text-yellow-300/90"
                                : "text-cyan-300/90"
                          }`}>
                            {line?.output}
                          </span>
                        </div>
                        {/* Holographic trailing effect */}
                        <div className="w-2 h-2 rounded-full bg-current opacity-0 group-hover/line:opacity-50 blur-sm transition-opacity" />
                      </div>
                    </div>
                  ))}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-purple-400 font-bold">❯</span>
                  <div className="inline-block w-2 h-4 bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse shadow-lg shadow-cyan-500/50" 
                       style={{ willChange: 'opacity' }} />
                </div>
              </div>

              {/* System stats overlay */}
              <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-code">
                <div className="flex items-center gap-4">
                  <span className="text-cyan-400">
                    CPU: <span className="text-green-400 font-bold">23%</span>
                  </span>
                  <span className="text-purple-400">
                    MEM: <span className="text-green-400 font-bold">1.2GB</span>
                  </span>
                  <span className="text-pink-400">
                    GPU: <span className="text-green-400 font-bold">45%</span>
                  </span>
                </div>
                <span className="text-cyan-400/60">v2.5.0</span>
              </div>
            </div>
          </div>

          {/* Right: Enhanced Pipeline Visualization */}
          <div className="relative group rounded-2xl h-[350px] overflow-hidden terminal-mobile-optimized mobile-contain-paint">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/60 to-black/40 backdrop-blur-2xl rounded-2xl border border-white/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/10 to-pink-500/5 rounded-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.15),transparent_70%)]" />

            <div className="relative z-10 p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-purple-500/30">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md animate-pulse" />
                  <Image
                    src="/crowe-avatar.png"
                    alt="Crowe Logic AI"
                    width={28}
                    height={28}
                    className="relative rounded-full border-2 border-purple-500/50 shadow-lg shadow-purple-500/30"
                    loading="lazy"
                    quality={75}
                  />
                </div>
                <span className="text-sm font-code font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
                  NEURAL PROCESSING PIPELINE
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-lg shadow-purple-400/50" />
                  <span className="text-xs font-code text-purple-400 font-bold tracking-wider">ACTIVE</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                {codeBlocks.map((block, index) => (
                  <div key={block.id} className="relative">
                    {/* Enhanced connection line with data flow particles */}
                    {index < codeBlocks.length - 1 && (
                      <div className="absolute left-[22px] top-full h-4 w-0.5 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-b from-purple-500/50 to-transparent" 
                             style={{ willChange: 'opacity' }} />
                        {block.status === "complete" && (
                          <>
                            <div className="absolute top-0 w-full h-2 bg-gradient-to-b from-green-400 to-transparent animate-pulse" 
                                 style={{ willChange: 'opacity' }} />
                            <div className="absolute top-0 w-1 h-1 bg-green-400 rounded-full animate-ping" 
                                 style={{ willChange: 'transform, opacity' }} />
                          </>
                        )}
                      </div>
                    )}

                    <div
                      onMouseEnter={() => setHoveredBlock(block.id)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm cursor-pointer ${
                        block.status === "complete"
                          ? "border-green-500/60 bg-gradient-to-br from-green-500/20 to-emerald-500/10 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 hover:scale-[1.02]"
                          : block.status === "generating"
                            ? "border-purple-500/60 bg-gradient-to-br from-purple-500/20 to-pink-500/10 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02]"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                      style={{
                        willChange: hoveredBlock === block.id ? 'transform, box-shadow' : 'auto',
                        transform: 'translate3d(0, 0, 0)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {block.status === "generating" && (
                            <>
                              <div className="absolute inset-0 bg-purple-500/40 rounded-full blur-xl animate-pulse" 
                                   style={{ willChange: 'opacity' }} />
                              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full opacity-60 blur-md animate-spin-slow" 
                                   style={{ willChange: 'transform' }} />
                            </>
                          )}
                          <Image
                            src="/crowe-avatar.png"
                            alt="Processing"
                            width={44}
                            height={44}
                            className={`relative rounded-full border-2 transition-all duration-300 ${
                              block.status === "generating"
                                ? "border-purple-500 shadow-2xl shadow-purple-500/60 animate-spin-slow"
                                : block.status === "complete"
                                  ? "border-green-500 shadow-2xl shadow-green-500/60"
                                  : "border-white/20 opacity-40"
                            }`}
                            style={{ willChange: block.status === "generating" ? 'transform' : 'auto' }}
                            loading="lazy"
                            quality={75}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-code font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                            {block.title}
                          </div>
                          {block.status === "generating" && (
                            <div className="text-xs font-code text-purple-400 animate-pulse" 
                                 style={{ willChange: 'opacity' }}>
                              Processing neural pathways...
                            </div>
                          )}
                          {block.status === "complete" && (
                            <div className="text-xs font-code text-green-400 font-semibold">Analysis complete ✓</div>
                          )}
                          {block.status === "pending" && (
                            <div className="text-xs font-code text-white/40">Waiting in queue...</div>
                          )}
                        </div>

                        <div className="text-3xl">
                          {block.status === "complete" ? (
                            <span className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">✓</span>
                          ) : block.status === "generating" ? (
                            <span className="text-purple-400 animate-pulse drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                                  style={{ willChange: 'opacity' }}>
                              ⚡
                            </span>
                          ) : (
                            <span className="text-white/20">○</span>
                          )}
                        </div>
                      </div>

                      {/* Hover details panel */}
                      {hoveredBlock === block.id && (
                        <div className="mt-3 pt-3 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                          <p className="text-xs text-white/70 leading-relaxed mb-2">
                            {block.description}
                          </p>
                          {block.metrics && (
                            <div className="flex items-center gap-4 text-[10px] font-code">
                              <div className="flex items-center gap-1">
                                <span className="text-cyan-400">Accuracy:</span>
                                <span className="text-green-400 font-bold">{block.metrics.accuracy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-purple-400">Time:</span>
                                <span className="text-green-400 font-bold">{block.metrics.processingTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-pink-400">Data:</span>
                                <span className="text-green-400 font-bold">{block.metrics.dataPoints}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {block.status === "generating" && (
                        <div className="relative mt-3 h-2 bg-black/40 rounded-full overflow-hidden border border-purple-500/30">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-200 relative overflow-hidden shadow-lg shadow-purple-500/50"
                            style={{ 
                              width: `${block.progress}%`,
                              willChange: 'width'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
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
            Twenty years of professional mycology expertise from <span className="text-purple-400 font-semibold">Michael Crowe</span> and <span className="text-purple-400 font-semibold">Southwest Mushrooms</span>, distilled into AI-powered cultivation intelligence
          </p>
          
          {/* CTA Buttons with improved hierarchy and mobile optimization */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center">
            {/* Primary CTA - More prominent styling */}
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 min-h-[44px] min-w-[200px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 font-semibold" 
              asChild
            >
              <Link href="/pricing">Get Started</Link>
            </Button>
            
            {/* Secondary CTA - Less prominent but still accessible */}
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 min-h-[44px] min-w-[200px] bg-transparent border-2 hover:bg-accent/10 transition-all duration-300" 
              asChild
            >
              <Link href="/chat">Try Free Demo</Link>
            </Button>
          </div>

          {/* Skip Animation option for reduced motion users */}
          {!prefersReducedMotion && (
            <div className="mt-4">
              <button
                onClick={() => setPrefersReducedMotion(true)}
                className="text-sm text-foreground/60 hover:text-foreground/90 underline underline-offset-4 transition-colors duration-200 min-h-[44px] px-4"
                aria-label="Skip animations and reduce motion"
              >
                Skip Animations
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
