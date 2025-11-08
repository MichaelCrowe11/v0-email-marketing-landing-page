"use client"

import { useState, useEffect } from "react"
import { OrchestratedHero } from "@/components/orchestrated-hero"
import { BenefitsBand } from "@/components/benefits-band"
import { ProofSection } from "@/components/proof-section"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CodeGenerationIntro } from "@/components/code-generation-intro"
import { BrandFamilyBanner } from "@/components/brand-family-banner"
import { SynapseLangShowcase } from "@/components/synapse-lang-showcase"

export default function Home() {
  const [showIntro, setShowIntro] = useState(false)
  const [hasSeenIntro, setHasSeenIntro] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const demo = params.get("demo")
    const resetIntro = params.get("reset-intro")
    const enableIntro = params.get("intro")

    if (resetIntro === "true") {
      localStorage.removeItem("crowe-intro-seen")
      window.location.href = "/"
      return
    }

    if (enableIntro === "true") {
      const introSeen = localStorage.getItem("crowe-intro-seen")
      if (introSeen !== "true" && demo !== "true") {
        setShowIntro(true)
        setHasSeenIntro(false)
      }
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    setHasSeenIntro(true)
    localStorage.setItem("crowe-intro-seen", "true")
  }

  if (showIntro && !hasSeenIntro) {
    return <CodeGenerationIntro onComplete={handleIntroComplete} />
  }

  return (
    <main className="min-h-screen" id="main-content">
      <OrchestratedHero />
      <ScrollReveal>
        <BrandFamilyBanner />
      </ScrollReveal>
      <ScrollReveal>
        <SynapseLangShowcase />
      </ScrollReveal>
      <ScrollReveal>
        <Features />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ProofSection />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <BenefitsBand />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <FAQ />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <BrandFamilyBanner />
      </ScrollReveal>
      <footer className="relative py-16 md:py-20 text-center border-t border-border bg-card/30">
        <div className="relative z-10 space-y-6 px-4 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="relative">
              <img
                src="/crowe-logic-logo.png"
                alt="Crowe Logic"
                className="w-20 h-20 rounded-full ring-1 ring-border shadow-lg object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-foreground tracking-tight mb-1">Crowe Logic</div>
              <div className="text-sm text-muted-foreground">The Platform for Biological Systems</div>
            </div>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Production-validated AI models, developer tools, and datasets built on 18 years of domain expertise and
            commercial scale operations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-border/50">
            <a
              href="https://southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Southwest Mushrooms
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="mailto:michael@crowelogic.com"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact Michael
            </a>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">© 2025 All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
