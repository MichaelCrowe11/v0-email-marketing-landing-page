"use client"

import { Hero } from "@/components/hero"
import Link from "next/link"
import { MessageSquare, Camera, BookOpen, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen" id="main-content">
      <Hero />

      {/* Core Features — 3 premium cards */}
      <section className="px-4 py-10 md:py-16 -mt-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/chat"
              className="group relative rounded-2xl border border-border/60 bg-gradient-to-b from-card to-card/80 p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">AI Assistant</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Ask anything about mushroom cultivation. Powered by 18+ years of Michael Crowe's commercial growing expertise.
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                  Start chatting <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link
              href="/crowe-vision"
              className="group relative rounded-2xl border border-border/60 bg-gradient-to-b from-card to-card/80 p-7 transition-all duration-300 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <Camera className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">Crowe Vision</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Upload a photo for instant contamination detection, species identification, and growth stage analysis.
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                  Analyze a photo <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link
              href="/species-library"
              className="group relative rounded-2xl border border-border/60 bg-gradient-to-b from-card to-card/80 p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Reference Library</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  100+ species profiles and a comprehensive contamination field guide with identification and remediation.
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                  Browse species <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-border/20 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/crowe-avatar.png"
              alt="Crowe Logic AI"
              className="w-9 h-9 rounded-full ring-2 ring-primary/30"
            />
            <div className="text-left">
              <div className="font-bold text-sm text-foreground">Crowe Logic AI</div>
              <div className="text-[10px] text-muted-foreground">by Michael Crowe</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a
              href="https://southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Southwest Mushrooms
            </a>
            <span className="text-border/50">|</span>
            <a
              href="https://buy.southwestmushrooms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Get The Book
            </a>
            <span className="text-border/50">|</span>
            <a
              href="mailto:michael@crowelogic.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground/60">
            © 2026 Michael Crowe / Southwest Mushrooms. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
