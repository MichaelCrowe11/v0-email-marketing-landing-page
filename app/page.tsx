"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { BenefitsBand } from "@/components/benefits-band"
import { ProofSection } from "@/components/proof-section"
import { StreamingChatDemo } from "@/components/streaming-chat-demo"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { StickyBar } from "@/components/sticky-bar"
import { AIGeneratedIntro } from "@/components/ai-generated-intro"
import { PremiumNav } from "@/components/premium-nav"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro && <AIGeneratedIntro onComplete={() => setShowIntro(false)} />}
      <PremiumNav />
      <main className="min-h-screen pt-16 md:pt-20">
        <Hero />
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
        <ScrollReveal delay={200}>
          <Pricing />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <FAQ />
        </ScrollReveal>
        <StickyBar />
        <footer className="relative py-12 md:py-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
          <div className="relative z-10 space-y-4 px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <img
                src="/crowe-logic-logo.png"
                alt="Crowe Logic"
                className="h-12 w-12 md:h-16 md:w-16 rounded-full ring-2 md:ring-4 ring-primary/30 shadow-glass"
              />
              <div className="text-center sm:text-left">
                <div className="text-lg md:text-xl font-black text-gradient-purple">Crowe Logic AI</div>
                <div className="text-xs md:text-sm text-foreground/80">Powered by Southwest Mushrooms</div>
              </div>
            </div>
            <p className="text-xs md:text-sm text-foreground/80 max-w-2xl mx-auto px-4">
              20+ years of professional mycology expertise, distilled into an AI that thinks like Michael Crowe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
              <a
                href="https://southwestmushrooms.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm font-bold text-primary hover:text-primary-hover transition-colors"
              >
                Southwest Mushrooms
              </a>
              <span className="hidden sm:inline text-foreground/60">•</span>
              <span className="text-xs md:text-sm text-foreground/80">© 2025 All Rights Reserved</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
