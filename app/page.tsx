"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { BenefitsBand } from "@/components/benefits-band"
import { ProofSection } from "@/components/proof-section"
import { StreamingChatDemo } from "@/components/streaming-chat-demo"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CodeGenerationIntro } from "@/components/code-generation-intro"
import { BrandFamilyBanner } from "@/components/brand-family-banner"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  useEffect(() => {
    // Check for demo mode URL parameter
    const params = new URLSearchParams(window.location.search)
    const demo = params.get("demo")
    const resetIntro = params.get("reset-intro")

    // Admin: Reset intro if requested
    if (resetIntro === "true") {
      localStorage.removeItem("crowe-intro-seen")
      window.location.href = "/"
      return
    }

    // Check if user has seen intro before
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

  // Show intro if user hasn't seen it yet
  if (showIntro && !hasSeenIntro) {
    return <CodeGenerationIntro onComplete={handleIntroComplete} />
  }

  // Users can explore the platform and sign up when ready
  return (
    <main className="min-h-screen" id="main-content">
      <Hero />
      <ScrollReveal>
        <BrandFamilyBanner />
      </ScrollReveal>
      <ScrollReveal>
        <BenefitsBand />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <StreamingChatDemo />
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
      <footer className="relative py-16 sm:py-20 md:py-24 text-center overflow-hidden border-t border-border/30 bg-noise">
        {/* Atmospheric footer background */}
        <div className="absolute inset-0 bg-gradient-to-t from-muted/40 via-muted/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6 sm:space-y-8 px-4 max-w-4xl mx-auto">
          {/* Brand identity */}
          <div className="flex flex-col items-center gap-5 mb-6 sm:mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <img
                  src="/crowe-avatar.png"
                  alt="Crowe Logic"
                  className="w-full h-full rounded-full ring-4 ring-border/50 shadow-2xl hover:ring-primary/30 transition-all duration-500 object-cover hover-lift"
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 font-display tracking-tight">Crowe Mycology</div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">
                AI-Powered Mushroom Cultivation Platform
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Empowering mushroom cultivators with AI-driven contamination detection, cultivation guidance, and
            comprehensive mycology resources. From species selection to harvest optimization, we provide the tools for successful cultivation.
          </p>

          {/* Links with refined styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6">
            <a
              href="https://southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
            >
              Southwest Mushrooms
            </a>
            <span className="hidden sm:inline text-border">|</span>
            <a
              href="mailto:michael@crowelogic.com"
              className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Michael
            </a>
          </div>

          {/* Copyright with refined styling */}
          <div className="pt-8 border-t border-border/30">
            <span className="text-xs sm:text-sm text-muted-foreground/80">© 2026 Crowe Mycology. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
