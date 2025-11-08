"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function OrchestratedHero() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-b from-background to-background/95">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex flex-col items-center justify-center mb-16 gap-8">
          <div className="relative">
            <Image
              src="/crowe-logic-logo.png"
              alt="Crowe Logic"
              width={140}
              height={140}
              className="relative rounded-full border border-border/50 shadow-2xl"
              priority
            />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
              The Platform for
              <br />
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-secondary bg-clip-text text-transparent">
                Biological Systems
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground/90 max-w-3xl">
              Build, train, and deploy specialized AI agents with domain-expert precision
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              From hypothesis to deployment—everything you need to build biological AI applications
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16">
          {/* Left: Platform Metrics */}
          <div className="enterprise-card p-8">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Platform Metrics</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50">
                <span className="text-sm text-muted-foreground">Pre-trained Agents</span>
                <span className="text-2xl font-bold tabular-nums text-foreground">150+</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50">
                <span className="text-sm text-muted-foreground">Discovery Timeline</span>
                <span className="text-2xl font-bold tabular-nums text-foreground">15y → 12w</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50">
                <span className="text-sm text-muted-foreground">Production Scale</span>
                <span className="text-2xl font-bold tabular-nums text-foreground">7 Continents</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Platform Status</span>
              <span className="text-secondary font-semibold">PRODUCTION</span>
            </div>
          </div>

          {/* Right: Full-Stack Ecosystem */}
          <div className="enterprise-card p-8">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
              <Image src="/crowe-logic-logo.png" alt="Crowe Logic" width={28} height={28} className="rounded-full" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Full-Stack Ecosystem
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-lg border border-border/50 bg-background/30 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-mono text-sm font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">AI Models Marketplace</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      150+ pre-trained specialist agents for drug discovery, agricultural intelligence, and biological
                      research
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg border border-border/50 bg-background/30 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-mono text-sm font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Developer Tools</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Synapse-lang, Research IDE, Crowe Code AI assistant. Express research hypotheses directly in code
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg border border-border/50 bg-background/30 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-mono text-sm font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Data & Hardware</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Research-grade datasets from 18+ years. Crowe-Sense IoT sensors for real-time monitoring
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-8">
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Domain intelligence, not just AI. Every model is battle-tested at commercial scale with real-world
            production validation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="btn-primary text-base h-12 px-8 shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/marketplace">Browse AI Models</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base h-12 px-8 border-border hover:bg-accent transition-all bg-transparent"
              asChild
            >
              <Link href="/workbench">Try Research IDE</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
