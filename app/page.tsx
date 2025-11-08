"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
// Replacing flashy orchestrated hero with professional research hero
import { AdvancedTerminal } from "@/components/advanced-terminal"
import { HeroSection } from "@/components/HeroSection"
import { ScrollReveal } from "@/components/scroll-reveal"
import { TrustIndicators } from "@/components/trust-indicators"

// Lazy load heavy components with code splitting
const BigBangIntro = dynamic(() => import("@/components/big-bang-intro").then(mod => ({ default: mod.BigBangIntro })), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />
})

const BrandFamilyBanner = dynamic(() => import("@/components/brand-family-banner").then(mod => ({ default: mod.BrandFamilyBanner })), {
  loading: () => <div className="h-32 bg-muted/10 animate-pulse" />
})

const BenefitsBand = dynamic(() => import("@/components/benefits-band").then(mod => ({ default: mod.BenefitsBand })), {
  loading: () => <div className="h-48 bg-muted/10 animate-pulse" />
})

const StreamingChatDemo = dynamic(() => import("@/components/streaming-chat-demo").then(mod => ({ default: mod.StreamingChatDemo })), {
  loading: () => <div className="h-96 bg-muted/10 animate-pulse rounded-lg" />
})

const ProofSection = dynamic(() => import("@/components/proof-section").then(mod => ({ default: mod.ProofSection })), {
  loading: () => <div className="h-96 bg-muted/10 animate-pulse" />
})

const Features = dynamic(() => import("@/components/features").then(mod => ({ default: mod.Features })), {
  loading: () => <div className="h-96 bg-muted/10 animate-pulse" />
})

const FAQ = dynamic(() => import("@/components/faq").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="h-96 bg-muted/10 animate-pulse" />
})

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
      localStorage.removeItem("crowe-bigbang-intro-seen")
      window.location.href = "/"
      return
    }

    // Check if user has seen intro before
    const introSeen = localStorage.getItem("crowe-bigbang-intro-seen")
    if (introSeen === "true" || demo === "true") {
      setShowIntro(false)
      setHasSeenIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    setHasSeenIntro(true)
    localStorage.setItem("crowe-bigbang-intro-seen", "true")
  }

  // Show intro if user hasn't seen it yet
  if (showIntro && !hasSeenIntro) {
    return <BigBangIntro onComplete={handleIntroComplete} />
  }

  // Users can explore the platform and sign up when ready
  return (
    <main className="min-h-screen">
      {/* Above-the-fold: Critical content loads immediately */}
      <div className="critical-content" style={{ padding: "24px 24px 48px", maxWidth: 1080, margin: "0 auto" }}>
        {/* Monochrome hero (reintroduced) */}
        <HeroSection />
        <div style={{ height: 24 }} />
        {/* Terminal-focused intro (monochrome, with local light/dark toggle) */}
        <AdvancedTerminal />
      </div>
      
      {/* Below-the-fold: Lazy loaded with CSS containment for performance */}
      <div className="below-fold mobile-contain-content">
        <ScrollReveal>
          <BrandFamilyBanner />
        </ScrollReveal>
      </div>
      <div className="below-fold mobile-contain-content">
        <ScrollReveal>
          <BenefitsBand />
        </ScrollReveal>
      </div>
      <div className="below-fold mobile-contain-content">
        <ScrollReveal delay={100}>
          <StreamingChatDemo />
        </ScrollReveal>
      </div>
      <div className="below-fold mobile-contain-content">
        <ScrollReveal delay={200}>
          <ProofSection />
        </ScrollReveal>
      </div>
      <div className="below-fold mobile-contain-content">
        <ScrollReveal delay={150}>
          <TrustIndicators />
        </ScrollReveal>
      </div>
      <div className="below-fold mobile-contain-content">
        <ScrollReveal delay={100}>
          <Features />
        </ScrollReveal>
      </div>
      <div className="below-fold mobile-contain-content">
        <ScrollReveal delay={100}>
          <FAQ />
        </ScrollReveal>
      </div>
      <div className="below-fold mobile-contain-content">
        <ScrollReveal delay={100}>
          <BrandFamilyBanner />
        </ScrollReveal>
      </div>
    </main>
  )
}
