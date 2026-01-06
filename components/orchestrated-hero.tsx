"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Activity, Sprout, Terminal, Thermometer, Droplets } from "lucide-react"

interface TerminalLine {
  text: string
  type: "success" | "info" | "warning"
}

interface CultivationStage {
  id: string
  title: string
  status: "pending" | "active" | "complete"
  progress: number
}

export function OrchestratedHero() {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [stages, setStages] = useState<CultivationStage[]>([
    { id: "1", title: "Substrate Sterilization", status: "pending", progress: 0 },
    { id: "2", title: "Inoculation & Spawn Run", status: "pending", progress: 0 },
    { id: "3", title: "Fruiting Initiation", status: "pending", progress: 0 },
    { id: "4", title: "Harvest Optimization", status: "pending", progress: 0 },
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
        const updated = [...prev]
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 space-y-6">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 bg-[#f5f0e8] shadow-lg shadow-primary/10">
              <Image
                src="/southwest-mushrooms-logo.png"
                alt="Southwest Mushrooms"
                fill
                className="object-contain p-1"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in hover:bg-primary/15 transition-colors cursor-default">
            <Sprout className="w-4 h-4" />
            <span>Southwest Mushrooms + Crowe Mycology</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-slide-up-fade font-display">
            Crowe Mycology <br />
            <span className="text-primary">AI-Powered Growth</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up-fade animation-delay-200">
            Professional mushroom cultivation platform with automated contamination detection, real-time environmental
            monitoring, and AI-driven yield optimization.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up-fade animation-delay-400">
            <Button
              size="lg"
              className="text-lg px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="/chat">Start Growing</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-12 border-primary/20 hover:bg-primary/5 bg-transparent transition-all hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="/crowe-vision">Analyze Cultures</Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto animate-scale-in animation-delay-600">
          <div className="relative group rounded-xl h-[400px] overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/40" />
                  <div className="w-3 h-3 rounded-full bg-muted border border-border" />
                  <div className="w-3 h-3 rounded-full bg-muted border border-border" />
                </div>
                <span className="ml-3 text-xs font-mono text-muted-foreground">cultivation-monitor — bash — 80x24</span>
              </div>
              <Terminal className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="p-6 font-mono text-sm h-full overflow-hidden relative">
              <div className="space-y-2">
                {terminalLines.map((line, i) =>
                  line ? (
                    <div key={i} className="flex gap-3">
                      <span className="text-muted-foreground select-none">$</span>
                      <span
                        className={`${
                          line.type === "success"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : line.type === "warning"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-foreground"
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

          <div className="relative group rounded-xl h-[400px] overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Growth Pipeline Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {stages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {index < stages.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-border">
                      <div
                        className={`w-full bg-primary transition-all duration-1000 ${
                          stage.status === "complete" ? "h-full" : "h-0"
                        }`}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div
                      className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        stage.status === "complete"
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : stage.status === "active"
                            ? "border-primary bg-primary/10 text-primary animate-fruiting-pulse"
                            : "border-muted bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {stage.status === "complete" ? (
                        <Activity className="w-6 h-6" />
                      ) : stage.status === "active" ? (
                        <Thermometer className="w-6 h-6" />
                      ) : (
                        <Droplets className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            stage.status === "active" ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {stage.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {stage.status === "complete" ? "100%" : `${stage.progress}%`}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            stage.status === "complete"
                              ? "bg-emerald-500"
                              : "bg-primary animate-growth-shimmer bg-gradient-to-r from-primary via-primary/80 to-primary"
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
