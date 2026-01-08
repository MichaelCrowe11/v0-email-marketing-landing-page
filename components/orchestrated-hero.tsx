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
    { id: "1", title: "Substrate Prep", status: "pending", progress: 0, icon: <SubstrateIcon className="w-4 h-4" /> },
    { id: "2", title: "Inoculation", status: "pending", progress: 0, icon: <SporeIcon className="w-4 h-4" /> },
    { id: "3", title: "Fruiting", status: "pending", progress: 0, icon: <FruitingIcon className="w-4 h-4" /> },
    { id: "4", title: "Harvest", status: "pending", progress: 0, icon: <HarvestIcon className="w-4 h-4" /> },
  ])

  const terminalMessages: TerminalLine[] = useMemo(
    () => [
      { text: "[INIT] Crowe Mycology v3.2 online...", type: "info" },
      { text: "[SENSOR] Temp: 75°F | RH: 92% | CO2: 850ppm", type: "info" },
      { text: "[CAMERA] Scanning for contamination...", type: "info" },
      { text: "[OK] Culture is clean", type: "success" },
      { text: "[AI] Calculating harvest window...", type: "info" },
      { text: "[WARN] Humidity low in chamber B", type: "warning" },
      { text: "[RESULT] Est. yield: 3.2kg in 4 days", type: "success" },
      { text: "[SYSTEM] All systems nominal", type: "success" },
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
        const updated = prev.map((stage) => ({ ...stage }))
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
    <section className="relative min-h-[90vh] pt-20 pb-8 px-4 overflow-hidden bg-background">
      {/* Subtle background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 via-accent/3 to-transparent blur-[80px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-3 border-primary/50 shadow-2xl shadow-primary/25">
                <Image src="/crowe-avatar.png" alt="Crowe Mycology" fill className="object-cover" priority />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold animate-fade-in">
            <MyceliumIcon className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase">AI-Powered Cultivation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground animate-slide-up-fade leading-none">
            Crowe Mycology
          </h1>

          <p className="text-xl md:text-2xl font-medium text-primary animate-slide-up-fade animation-delay-100 tracking-tight">
            Grow with Intelligence
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed animate-slide-up-fade animation-delay-200">
            Professional mushroom cultivation with AI contamination detection, environmental monitoring, and yield
            optimization.
          </p>

          <div className="flex flex-wrap gap-3 justify-center animate-slide-up-fade animation-delay-400 pt-2">
            <Button
              size="lg"
              className="text-base px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold rounded-xl"
              asChild
            >
              <Link href="/chat">Start Growing</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 h-12 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold rounded-xl bg-transparent"
              asChild
            >
              <Link href="/crowe-vision">Analyze Cultures</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto animate-scale-in animation-delay-600">
          {/* Terminal Card - Compact */}
          <div className="relative rounded-xl h-[320px] overflow-hidden border border-border/50 bg-card/90 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                </div>
                <span className="ml-2 text-[10px] font-mono text-muted-foreground tracking-wide">
                  cultivation-monitor
                </span>
              </div>
              <TerminalIcon className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="p-4 font-mono text-xs h-full overflow-hidden">
              <div className="space-y-2">
                {terminalLines.map((line, i) =>
                  line ? (
                    <div key={i} className="flex gap-2 items-start">
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
                <div className="flex gap-2 items-center">
                  <span className="text-primary/60 select-none font-bold">$</span>
                  <span className="w-2 h-4 bg-primary rounded-sm animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Card - Compact */}
          <div className="relative rounded-xl h-[320px] overflow-hidden border border-border/50 bg-card/90 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <MyceliumIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground tracking-wide">Growth Pipeline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Active</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {index < stages.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-16px] w-0.5 bg-border">
                      <div
                        className={`w-full bg-primary transition-all duration-700 ${stage.status === "complete" ? "h-full" : "h-0"}`}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-300 ${
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
                      <div className="flex justify-between mb-1.5">
                        <span
                          className={`text-xs font-semibold ${
                            stage.status === "active"
                              ? "text-primary"
                              : stage.status === "complete"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-foreground"
                          }`}
                        >
                          {stage.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {stage.status === "complete" ? "100%" : `${stage.progress}%`}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${stage.status === "complete" ? "bg-emerald-500" : "bg-primary"}`}
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
