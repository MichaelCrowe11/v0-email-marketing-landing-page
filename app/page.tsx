"use client"
import { AdvancedTerminal } from "@/components/advanced-terminal"

// Simplified homepage: only research terminal(s) as requested.
export default function Home() {
  return (
    <main className="min-h-screen" aria-label="Research terminal workspace">
      <div style={{ padding: "32px 24px 64px", maxWidth: 1080, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        <AdvancedTerminal />
        {/* Duplicate terminal instance optional: uncomment if multiple parallel feeds desired */}
        {/* <AdvancedTerminal /> */}
      </div>
    </main>
  )
}
