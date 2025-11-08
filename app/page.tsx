"use client"
import { AdvancedTerminal } from "@/components/advanced-terminal"
import { HeroSection } from "@/components/HeroSection"

// Homepage: hero for impact, then research terminal workspace.
export default function Home() {
  return (
    <main className="min-h-screen" aria-label="Research workspace">
      <div style={{ padding: "32px 24px", maxWidth: 1080, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        <HeroSection />
        <AdvancedTerminal />
      </div>
    </main>
  )
}
