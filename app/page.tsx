"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { BenefitsBand } from "@/components/benefits-band"
import { ProofSection } from "@/components/proof-section"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CodeGenerationIntro } from "@/components/code-generation-intro"
import { BrandFamilyBanner } from "@/components/brand-family-banner"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const demo = params.get("demo")
    const resetIntro = params.get("reset-intro")

    if (resetIntro === "true") {
      localStorage.removeItem("crowe-intro-seen")
      window.location.href = "/"
      return
    }

    const introSeen = localStorage.getItem("crowe-intro-seen")
    if (introSeen === "true" || demo === "true") {
      setShowIntro(false)
      setHasSeenIntro(true)
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
      <Hero />
      <ScrollReveal>
        <BrandFamilyBanner />
      </ScrollReveal>
      <ScrollReveal>
        <BenefitsBand />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <ProofSection />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <Features />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <FAQ />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <BrandFamilyBanner />
      </ScrollReveal>
      <footer className="relative py-12 sm:py-16 md:py-20 text-center overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/30 via-muted/10 to-transparent" />
        <div className="relative z-10 space-y-4 sm:space-y-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20">
                <img
                  src="/crowe-avatar.png"
                  alt="Crowe Logic"
                  className="w-full h-full rounded-full ring-4 ring-border shadow-xl hover:ring-primary/20 transition-all duration-300 object-cover"
                />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-foreground mb-1">Crowe Logic</div>
              <div className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Powered by Southwest Mushrooms
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            20+ years of professional mycology expertise, powered by advanced AI.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            From substrate formulation to contamination analysis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-8 pt-4 sm:pt-6">
            <a
              href="https://southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors"
            >
              Southwest Mushrooms
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a
              href="mailto:michael@crowelogic.com"
              className="text-xs sm:text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors"
            >
              Contact Michael
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="text-xs sm:text-sm md:text-base text-muted-foreground">© 2025 All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
