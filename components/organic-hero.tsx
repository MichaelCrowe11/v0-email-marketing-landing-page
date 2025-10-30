"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function OrganicHero() {
  return (
    <section className="relative min-h-screen pt-20 pb-12 px-4 overflow-hidden bg-gradient-to-b from-background via-background to-accent/5">
      <div className="mx-auto max-w-7xl">
        {/* Hero Content - Clean and Direct */}
        <div className="text-center max-w-4xl mx-auto space-y-12">
          {/* Avatar and Identity */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              {/* Subtle organic glow */}
              <div className="absolute inset-0 bg-purple-600/10 rounded-full blur-3xl" />
              
              <Image
                src="/crowe-avatar.png"
                alt="Michael Crowe"
                width={140}
                height={140}
                className="relative rounded-full border-4 border-purple-500/20 shadow-2xl"
                priority
              />
            </div>

            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
                Michael Crowe AI
              </h1>
              <p className="text-xl text-muted-foreground">
                20+ years of mushroom cultivation expertise
              </p>
              <p className="text-lg text-muted-foreground/80 mt-2">
                Southwest Mushrooms • Phoenix, Arizona
              </p>
            </div>
          </div>

          {/* Value Proposition - Direct and Clear */}
          <div className="space-y-6">
            <p className="text-2xl md:text-3xl text-foreground leading-relaxed">
              I've spent two decades solving contamination, dialing in substrates, and troubleshooting yields in commercial production.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Now that experience is available 24/7 to help you grow better mushrooms.
            </p>
          </div>

          {/* What I Can Help With - Practical and Specific */}
          <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-purple-500/50 transition-colors">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Contamination Triage
              </h3>
              <p className="text-sm text-muted-foreground">
                Rapid ID and remediation plans from thousands of real cases
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-purple-500/50 transition-colors">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Substrate Optimization
              </h3>
              <p className="text-sm text-muted-foreground">
                Formulations and BE calculations that actually work in production
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-purple-500/50 transition-colors">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Production Troubleshooting
              </h3>
              <p className="text-sm text-muted-foreground">
                Real solutions from someone who's been on the cultivation floor
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700 shadow-lg" 
              asChild
            >
              <Link href="/pricing">Start Growing Better</Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6" 
              asChild
            >
              <Link href="/chat">Try Free Demo</Link>
            </Button>
          </div>

          {/* Trust Indicator */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Built from real production data at Southwest Mushrooms
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
