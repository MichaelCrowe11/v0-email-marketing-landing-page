"use client"

import { useState, useEffect } from "react"
import { OrchestratedHero } from "@/components/orchestrated-hero"
import { BenefitsBand } from "@/components/benefits-band"
import { ProofSection } from "@/components/proof-section"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CodeGenerationIntro } from "@/components/code-generation-intro"
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
        <SynapseLangShowcase />
      </ScrollReveal>
      <ScrollReveal>
        <Features />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ProofSection />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <BenefitsBand />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <FAQ />
      </ScrollReveal>
      <footer className="relative py-12 md:py-16 text-center border-t border-border">
        <div className="relative z-10 space-y-4 px-4 max-w-3xl mx-auto">
          <div className="text-xl font-semibold text-foreground tracking-tight">Crowe Logic</div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Production-validated AI platform for biological systems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-sm">
            <a
              href="https://southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Southwest Mushrooms
            </a>
            <span className="text-border">•</span>
            <a
              href="mailto:michael@crowelogic.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <span className="text-border">•</span>
            <span className="text-muted-foreground">© 2025 All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
