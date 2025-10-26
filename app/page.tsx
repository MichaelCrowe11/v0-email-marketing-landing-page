"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { BenefitsBand } from "@/components/benefits-band"
import { ProofSection } from "@/components/proof-section"
import { StreamingChatDemo } from "@/components/streaming-chat-demo"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AIGeneratedIntro } from "@/components/ai-generated-intro"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for demo mode URL parameter
    const params = new URLSearchParams(window.location.search)
    const demo = params.get("demo")
    const resetIntro = params.get("reset-intro")

    if (demo === "true") {
      setIsDemoMode(true)
      setIsAuthenticated(true) // Bypass auth in demo mode
    }

    // Admin: Reset intro if requested
    if (resetIntro === "true") {
      localStorage.removeItem("crowe-intro-seen")
      window.location.href = "/"
      return
    }

    // Check if user has seen intro before
    const introSeen = localStorage.getItem("crowe-intro-seen")
    if (introSeen === "true") {
      setShowIntro(false)
      setHasSeenIntro(true)
    }

    // Check authentication status (skip if demo mode)
    if (!demo) {
      const checkAuth = async () => {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
        setIsCheckingAuth(false)
      }
      checkAuth()
    } else {
      setIsCheckingAuth(false)
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    setHasSeenIntro(true)
    localStorage.setItem("crowe-intro-seen", "true")

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      setTimeout(() => {
        router.push("/auth/login")
      }, 500)
    }
  }

  // Show intro if user hasn't seen it yet
  if (showIntro && !hasSeenIntro) {
    return <AIGeneratedIntro onComplete={handleIntroComplete} />
  }

  // Show loading while checking auth (only if intro has been seen)
  if (isCheckingAuth && hasSeenIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Require authentication to view the platform
  if (!isAuthenticated && hasSeenIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <img
            src="/crowe-logic-logo.png"
            alt="Crowe Logic"
            className="h-32 w-32 rounded-full mx-auto mb-6 ring-4 ring-primary/20"
          />
          <h1 className="text-3xl font-bold mb-3">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access Crowe Logic AI platform
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
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
      <ScrollReveal delay={100}>
        <FAQ />
      </ScrollReveal>
      <footer className="relative py-16 md:py-20 text-center overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/30 via-muted/10 to-transparent" />
        <div className="relative z-10 space-y-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              <img
                src="/crowe-avatar.png"
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
  )
}
