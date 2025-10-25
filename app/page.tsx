"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { BenefitsBand } from "@/components/benefits-band"
import { ProofSection } from "@/components/proof-section"
import { StreamingChatDemo } from "@/components/streaming-chat-demo"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { StickyBar } from "@/components/sticky-bar"
import { AIGeneratedIntro } from "@/components/ai-generated-intro"
import { ScrollReveal } from "@/components/scroll-reveal"
import { InteractiveShowcase } from "@/components/interactive-showcase"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro && <AIGeneratedIntro onComplete={() => setShowIntro(false)} />}
      <main className="min-h-screen">
        <Hero />
        <ScrollReveal>
          <BenefitsBand />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <InteractiveShowcase />
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
        <StickyBar />
        <footer className="relative py-16 md:py-20 text-center overflow-hidden border-t border-border/50">
          <div className="absolute inset-0 bg-gradient-to-t from-muted/30 via-muted/10 to-transparent" />
          <div className="relative z-10 space-y-6 px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <img
                  src="/crowe-logic-logo.png"
                  alt="Crowe Logic"
                  className="relative h-16 w-16 md:h-20 md:w-20 rounded-full ring-4 ring-border shadow-xl hover:ring-primary/20 transition-all duration-300"
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl md:text-2xl font-black text-foreground mb-1">Crowe Logic AI</div>
                <div className="text-sm md:text-base text-muted-foreground">Powered by Southwest Mushrooms</div>
              </div>
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
              20+ years of professional mycology expertise, distilled into an AI that thinks like Michael Crowe.
              <br />
              From substrate formulation to contamination triage, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 pt-6">
              <a
                href="https://southwestmushrooms.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors"
              >
                Southwest Mushrooms
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a
                href="mailto:michael@crowelogic.com"
                className="text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors"
              >
                Contact Michael
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <span className="text-sm md:text-base text-muted-foreground">© 2025 All Rights Reserved</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
