"use client"

import { useEffect, useState } from "react"
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
  const [dataMetrics, setDataMetrics] = useState({
    datasets: 0,
    cultivations: 0,
    strains: 0,
    analyses: 0,
  })

  // Animate the metrics counting up
  useEffect(() => {
    const targets = {
      datasets: 847,
      cultivations: 2341,
      strains: 156,
      analyses: 9843,
    }

    const duration = 2000
    const steps = 60
    const stepTime = duration / steps

    let step = 0
    const interval = setInterval(() => {
      step++
      const progress = step / steps

      setDataMetrics({
        datasets: Math.floor(targets.datasets * progress),
        cultivations: Math.floor(targets.cultivations * progress),
        strains: Math.floor(targets.strains * progress),
        analyses: Math.floor(targets.analyses * progress),
      })

      if (step >= steps) {
        clearInterval(interval)
        setDataMetrics(targets)
      }
    }, stepTime)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen pt-20 pb-12 px-4 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Top Section: Logo and Title */}
        <div className="relative flex flex-col items-center justify-center mb-12 gap-6">
          <div className="relative">
            <Image
              src="/crowe-logic-logo.png"
              alt="Crowe Logic"
              width={160}
              height={160}
              className="relative rounded-full border-4 border-primary/20 shadow-2xl"
              priority
            />
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Crowe Logic</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">Professional Mycology Intelligence Platform</p>
            <p className="text-base text-muted-foreground/80 max-w-xl">
              20+ years of cultivation expertise distilled into precision data analysis
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {/* Left: Research Data Overview */}
          <div className="relative group rounded-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
                  Platform Metrics
                </h3>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-muted-foreground">Active Datasets</span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {dataMetrics.datasets.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-muted-foreground">Cultivation Cycles</span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {dataMetrics.cultivations.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-muted-foreground">Documented Strains</span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {dataMetrics.strains.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-muted-foreground">Completed Analyses</span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {dataMetrics.analyses.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>System Status</span>
                <span className="text-green-500 font-semibold">OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* Right: Core Capabilities */}
          <div className="relative group rounded-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <Image src="/crowe-logic-logo.png" alt="Crowe Logic" width={24} height={24} className="rounded-full" />
                <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
                  Core Capabilities
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-mono text-xs font-bold">01</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Environmental Analysis</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Real-time monitoring and optimization of temperature, humidity, CO2, and contamination
                        indicators
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-mono text-xs font-bold">02</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Strain Classification</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Automated species identification and genetic analysis with pharmaceutical-grade accuracy
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-mono text-xs font-bold">03</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Yield Forecasting</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Statistical models predicting harvest outcomes based on substrate composition and environmental
                        data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From hobbyist to commercial operations. Professional cultivation intelligence powered by decades of field
            research.
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
