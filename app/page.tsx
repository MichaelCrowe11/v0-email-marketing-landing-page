"use client"

import { Hero } from "@/components/hero"
import Link from "next/link"
import { MessageSquare, Camera, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen" id="main-content">
      <Hero />

      {/* Core Features — 3 cards */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/chat"
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
            >
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ask anything about mushroom cultivation. Powered by 18+ years of Michael Crowe's commercial growing expertise.
              </p>
            </Link>

            <Link
              href="/crowe-vision"
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
            >
              <Camera className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Crowe Vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload a photo for instant contamination detection, species identification, and growth stage analysis.
              </p>
            </Link>

            <Link
              href="/species-library"
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
            >
              <BookOpen className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Reference Library</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                100+ species profiles and a comprehensive contamination field guide with identification and remediation.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 text-center border-t border-border/30 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/crowe-avatar.png"
              alt="Crowe Logic AI"
              className="w-10 h-10 rounded-full ring-2 ring-primary/30"
            />
            <div className="text-left">
              <div className="font-bold text-foreground">Crowe Logic AI</div>
              <div className="text-xs text-muted-foreground">by Michael Crowe</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a
              href="https://southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Southwest Mushrooms
            </a>
            <span className="text-border">|</span>
            <a
              href="https://buy.southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Get The Book
            </a>
            <span className="text-border">|</span>
            <a
              href="mailto:michael@crowelogic.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Michael Crowe / Southwest Mushrooms. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
