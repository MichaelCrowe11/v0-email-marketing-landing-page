"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, Database, Terminal, Cpu, Network } from "lucide-react"

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
    { id: "1", title: "Genomic Sequencing", status: "pending", progress: 0 },
    { id: "2", title: "Protein Folding Analysis", status: "pending", progress: 0 },
    { id: "3", title: "CRISPR Target Identification", status: "pending", progress: 0 },
    { id: "4", title: "Drug Candidate Screening", status: "pending", progress: 0 },
  ])

  const codeSnippets = useMemo(
    () => [
      "import pandas as pd",
      "from Bio import SeqIO",
      "model.predict(sequence)",
      "crispr.target(dna)",
      "protein.fold(structure)",
      "genome.align(ref)",
      "data.pipeline(batch)",
      "torch.optim.Adam()",
    ],
    [],
  )

  const colors = useMemo(
    () => ["text-sky-400", "text-teal-400", "text-indigo-400", "text-cyan-400", "text-blue-400"],
    [],
  )

  const terminalMessages: TerminalLine[] = useMemo(
    () => [
      { text: "[INIT] Bio-Compute Engine v4.0.1 starting...", type: "info" },
      { text: "[DATA] Loading genomic dataset: HG38_ref.fa", type: "info" },
      { text: "[ANALYSIS] Processing sequence alignment...", type: "info" },
      { text: "[SUCCESS] Alignment complete: 99.9% coverage", type: "success" },
      { text: "[AI] Identifying potential off-target effects...", type: "info" },
      { text: "[WARN] Low complexity region detected at chr1:12345", type: "warning" },
      { text: "[RESULT] 3 high-confidence targets identified", type: "success" },
      { text: "[SYSTEM] Ready for synthesis simulation", type: "success" },
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
    let resetTimeout: NodeJS.Timeout | null = null

    const interval = setInterval(() => {
      if (lineIndex < terminalMessages.length) {
        const message = terminalMessages[lineIndex]
        if (message) {
          setTerminalLines((prev) => [...prev, message])
        }
        lineIndex++
      } else if (!resetTimeout) {
        // Only schedule reset if not already scheduled
        resetTimeout = setTimeout(() => {
          setTerminalLines([])
          lineIndex = 0
          resetTimeout = null
        }, 3000)
      }
    }, 800)

    return () => {
      clearInterval(interval)
      if (resetTimeout) clearTimeout(resetTimeout)
    }
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
    <section className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden bg-background bg-grid-pattern">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Top Section: Hero Text */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
            <Activity className="w-4 h-4" />
            <span>The Future of Biotech Development</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-slide-up-fade">
            Accelerate Discovery with <br />
            <span className="bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
              Intelligent Bio-Compute
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up-fade animation-delay-200">
            The ultimate platform for biotech innovation. Access state-of-the-art AI models, massive genomic datasets,
            and a professional coding environment designed for bioinformatics.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up-fade animation-delay-400">
            <Button
              size="lg"
              className="text-lg px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              asChild
            >
              <Link href="/ide">Launch IDE</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-12 border-primary/20 hover:bg-primary/5 bg-transparent"
              asChild
            >
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>

        {/* Bottom Section: Terminal and Enhanced Pipeline */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto animate-scale-in animation-delay-600">
          {/* Left: Ultra-Premium AI Processing Terminal */}
          <div className="relative group rounded-xl h-[400px] overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <span className="ml-3 text-xs font-mono text-muted-foreground">bio-engine — bash — 80x24</span>
              </div>
              <Terminal className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm h-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-2">
                {terminalLines.map((line, i) =>
                  line ? (
                    <div key={i} className="flex gap-3">
                      <span className="text-muted-foreground select-none">$</span>
                      <span
                        className={`${
                          line.type === "success"
                            ? "text-teal-400"
                            : line.type === "warning"
                              ? "text-yellow-400"
                              : "text-sky-400"
                        }`}
                      >
                        {line.text}
                      </span>
                    </div>
                  ) : null,
                )}
                <div className="flex gap-3">
                  <span className="text-muted-foreground select-none">$</span>
                  <span className="w-2 h-5 bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Enhanced Pipeline Visualization */}
          <div className="relative group rounded-xl h-[400px] overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Pipeline Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {codeBlocks.map((block, index) => (
                <div key={block.id} className="relative">
                  {/* Connection Line */}
                  {index < codeBlocks.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-border">
                      <div
                        className={`w-full bg-primary transition-all duration-1000 ${
                          block.status === "complete" ? "h-full" : "h-0"
                        }`}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div
                      className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        block.status === "complete"
                          ? "border-teal-500 bg-teal-500/10 text-teal-500"
                          : block.status === "generating"
                            ? "border-primary bg-primary/10 text-primary animate-pulse"
                            : "border-muted bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {block.status === "complete" ? (
                        <Activity className="w-6 h-6" />
                      ) : block.status === "generating" ? (
                        <Cpu className="w-6 h-6 animate-spin-slow" />
                      ) : (
                        <Database className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            block.status === "generating" ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {block.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {block.status === "complete" ? "100%" : `${block.progress}%`}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            block.status === "complete" ? "bg-teal-500" : "bg-primary"
                          }`}
                          style={{ width: `${block.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
