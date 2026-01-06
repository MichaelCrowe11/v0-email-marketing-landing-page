"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const MyceliumIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path
      d="M12 3v18M12 12c-3 0-6-2-8-4M12 12c3 0 6-2 8-4M12 8c-2 0-4-1.5-5.5-3M12 8c2 0 4-1.5 5.5-3M12 16c-2.5 0-5 1.5-7 3M12 16c2.5 0 5 1.5 7 3"
      strokeLinecap="round"
    />
  </svg>
)

const SporeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="4" r="1.5" />
    <circle cx="12" cy="20" r="1.5" />
    <circle cx="4" cy="12" r="1.5" />
    <circle cx="20" cy="12" r="1.5" />
    <circle cx="6" cy="6" r="1" />
    <circle cx="18" cy="6" r="1" />
    <circle cx="6" cy="18" r="1" />
    <circle cx="18" cy="18" r="1" />
  </svg>
)

const SubstrateIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" />
    <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" strokeLinecap="round" />
  </svg>
)

const FruitingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <ellipse cx="12" cy="8" rx="6" ry="4" />
    <path d="M12 12v8M8 20h8" strokeLinecap="round" />
    <path d="M9 6c0-2 1.5-3 3-3s3 1 3 3" />
  </svg>
)

const HarvestIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 3c-4 0-7 3-7 7 0 2.5 1.5 4.5 3.5 5.5L8 21h8l-.5-5.5c2-1 3.5-3 3.5-5.5 0-4-3-7-7-7z" />
    <path d="M12 3v4M9 7h6" strokeLinecap="round" />
  </svg>
)

const TerminalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9l3 3-3 3M12 15h5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SensorIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" />
    <path
      d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      strokeLinecap="round"
    />
  </svg>
)

interface TerminalLine {
  text: string
  type: "success" | "info" | "warning"
}

interface CultivationStage {
  id: string
  title: string
  status: "pending" | "active" | "complete"
  progress: number
  icon: React.ReactNode
}

export function OrchestratedHero() {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [stages, setStages] = useState<CultivationStage[]>([
    {
      id: "1",
      title: "Substrate Sterilization",
      status: "pending",
      progress: 0,
      icon: <SubstrateIcon className="w-5 h-5" />,
    },
    {
      id: "2",
      title: "Inoculation & Spawn Run",
      status: "pending",
      progress: 0,
      icon: <SporeIcon className="w-5 h-5" />,
    },
    {
      id: "3",
      title: "Fruiting Initiation",
      status: "pending",
      progress: 0,
      icon: <FruitingIcon className="w-5 h-5" />,
    },
    {
      id: "4",
      title: "Harvest Optimization",
      status: "pending",
      progress: 0,
      icon: <HarvestIcon className="w-5 h-5" />,
    },
  ])

  const terminalMessages: TerminalLine[] = useMemo(
    () => [
      { text: "[INIT] Crowe Mycology System v3.1.2 online...", type: "info" },
      { text: "[SENSOR] Temperature: 75.2°F | Humidity: 92% | CO2: 850ppm", type: "info" },
      { text: "[CAMERA] Analyzing growth chamber A for contamination...", type: "info" },
      { text: "[SUCCESS] No contaminants detected - culture is clean", type: "success" },
      { text: "[AI] Predicting optimal harvest window...", type: "info" },
      { text: "[WARN] Humidity slightly low in chamber B - adjusting", type: "warning" },
      { text: "[RESULT] Estimated yield: 3.2kg in 4 days", type: "success" },
      { text: "[SYSTEM] All cultivation systems nominal", type: "success" },
    ],
    [],
  )

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

  useEffect(() => {
    let currentStage = 0
    const interval = setInterval(() => {
      setStages((prev) => {
        const updated = prev.map((stage, idx) => ({ ...stage }))
        if (currentStage < updated.length) {
          if (updated[currentStage].status === "pending") {
            updated[currentStage].status = "active"
          } else if (updated[currentStage].status === "active") {
            updated[currentStage].progress += 20
            if (updated[currentStage].progress >= 100) {
              updated[currentStage].status = "complete"
              currentStage++
            }
          }
        } else {
          setTimeout(() => {
            currentStage = 0
            updated.forEach((stage) => {
              stage.status = "pending"
              stage.progress = 0
            })
          }, 2000)
        }
        return updated
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/8 via-accent/5 to-transparent blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent/8 blur-[80px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 space-y-8">
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/40 shadow-xl shadow-primary/20">
                <Image src="/crowe-avatar.png" alt="Crowe Mycology" fill className="object-cover" priority />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold animate-fade-in hover:bg-primary/15 transition-colors cursor-default">
            <MyceliumIcon className="w-4 h-4" />
            <span className="tracking-wide">AI-Powered Cultivation Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground animate-slide-up-fade font-display leading-[0.95]">
            Crowe Mycology
          </h1>

          <p className="text-2xl md:text-3xl font-medium text-primary/90 animate-slide-up-fade animation-delay-100 font-display tracking-tight">
            Grow with Intelligence
          </p>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up-fade animation-delay-200">
            Professional mushroom cultivation platform with automated contamination detection, real-time environmental
            monitoring, and AI-driven yield optimization.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up-fade animation-delay-400 pt-2">
            <Button
              size="lg"
              className="text-lg px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] font-semibold rounded-xl"
              asChild
            >
              <Link href="/chat">Start Growing</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 h-14 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 bg-transparent transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-semibold rounded-xl"
              asChild
            >
              <Link href="/crowe-vision">Analyze Cultures</Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto animate-scale-in animation-delay-600">
          {/* Terminal Card */}
          <div className="relative group rounded-2xl h-[420px] overflow-hidden border border-border/50 bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <span className="ml-2 text-xs font-mono text-muted-foreground tracking-wide">cultivation-monitor</span>
              </div>
              <TerminalIcon className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="p-6 font-mono text-sm h-full overflow-hidden relative">
              <div className="space-y-2.5">
                {terminalLines.map((line, i) =>
                  line ? (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-primary/60 select-none font-bold">$</span>
                      <span
                        className={`${
                          line.type === "success"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : line.type === "warning"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-foreground/90"
                        }`}
                      >
                        {line.text}
                      </span>
                    </div>
                  ) : null,
                )}
                <div className="flex gap-3 items-center">
                  <span className="text-primary/60 select-none font-bold">$</span>
                  <span className="w-2.5 h-5 bg-primary rounded-sm animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Card */}
          <div className="relative group rounded-2xl h-[420px] overflow-hidden border border-border/50 bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-3">
                <MyceliumIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground tracking-wide">Growth Pipeline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-muted-foreground font-medium">Active</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {stages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {index < stages.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-[-20px] w-0.5 bg-border">
                      <div
                        className={`w-full bg-primary transition-all duration-700 ${
                          stage.status === "complete" ? "h-full" : "h-0"
                        }`}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div
                      className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                        stage.status === "complete"
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : stage.status === "active"
                            ? "border-primary bg-primary/10 text-primary animate-fruiting-pulse"
                            : "border-muted-foreground/30 bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {stage.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span
                          className={`text-sm font-semibold ${
                            stage.status === "active"
                              ? "text-primary"
                              : stage.status === "complete"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-foreground"
                          }`}
                        >
                          {stage.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {stage.status === "complete" ? "100%" : `${stage.progress}%`}
                        </span>
                      </div>

                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            stage.status === "complete" ? "bg-emerald-500" : "bg-primary"
                          }`}
                          style={{ width: `${stage.progress}%` }}
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
