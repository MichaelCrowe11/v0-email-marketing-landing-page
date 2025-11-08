"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

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
              width={120}
              height={120}
              className="relative rounded-full border-3 border-border/50 shadow-lg"
              priority
            />
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Production-Validated • $470K Annual Revenue
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              The AI Platform for
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-green-500 bg-clip-text text-transparent">
                Biological Systems
              </span>
            </h1>
            <p className="text-xl font-medium text-muted-foreground max-w-2xl">
              Build, train, and deploy specialized AI agents with domain-expert precision.
            </p>
            <p className="text-base text-muted-foreground/80 max-w-xl">
              From hypothesis to deployment—everything you need to build biological AI applications
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {/* Left: Platform Metrics */}
          <div className="relative group rounded-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Platform Metrics
                </h3>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-muted-foreground">Pre-trained Agents</span>
                  <span className="text-foreground text-xl font-semibold tabular-nums">150+</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-muted-foreground">Discovery Timeline</span>
                  <span className="text-foreground text-xl font-semibold tabular-nums">15y → 12w</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-muted-foreground">Validated Revenue</span>
                  <span className="text-foreground text-xl font-semibold tabular-nums">$470K/yr</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-muted-foreground">Production Scale</span>
                  <span className="text-foreground text-xl font-semibold tabular-nums">7 Continents</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Platform Status</span>
                <span className="text-green-500 font-semibold">PRODUCTION</span>
              </div>
            </div>
          </div>

          {/* Right: Full-Stack Ecosystem */}
          <div className="relative group rounded-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-border">
                <Image src="/crowe-logic-logo.png" alt="Crowe Logic" width={24} height={24} className="rounded-full" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Full-Stack Ecosystem
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-mono text-sm font-bold">01</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">AI Models Marketplace</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        150+ pre-trained specialist agents. CriOS Nova drug discovery, agricultural intelligence, and
                        more
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-mono text-sm font-bold">02</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Developer Tools</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Synapse-lang, Research IDE, Crowe Code AI assistant. Express research hypotheses directly in
                        code
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-mono text-sm font-bold">03</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Data & Hardware</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Research-grade datasets from 18+ years. Crowe-Sense IoT sensors for real-time monitoring
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
            Not just AI. Domain intelligence. Every model is battle-tested at commercial scale with real-world
            production validation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/marketplace">Browse AI Models</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/workbench">Try Research IDE</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
