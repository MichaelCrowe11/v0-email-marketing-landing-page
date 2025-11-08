"use client"
import { AdvancedTerminal } from "@/components/advanced-terminal"
import { HeroSection } from "@/components/HeroSection"
import React, { useEffect, useState } from "react"

// Homepage: hero for impact, then research terminal workspace.
export default function Home() {
  const [isDual, setIsDual] = useState(false)
  const [showSecond, setShowSecond] = useState(false)

  // Lazy-mount second terminal after first finishes one cycle or when user toggles to Dual
  useEffect(() => {
    if (isDual) {
      const id = window.setTimeout(() => setShowSecond(true), 250)
      return () => clearTimeout(id)
    } else {
      setShowSecond(false)
    }
  }, [isDual])
  return (
    <main className="min-h-screen" aria-label="Research workspace">
      <div style={{ padding: "32px 24px", maxWidth: 1320, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
        <HeroSection />
        {/* Terminal Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Terminals</div>
          <div style={{ display: 'inline-flex', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }} role="group" aria-label="Terminal count toggle">
            <button
              type="button"
              onClick={() => setIsDual(false)}
              aria-pressed={!isDual}
              style={{
                padding: '6px 10px', fontSize: 12, cursor: 'pointer',
                background: !isDual ? 'var(--surface-primary)' : 'transparent',
                color: 'var(--text-primary)', border: 'none', borderRight: '1px solid var(--border-subtle)'
              }}
            >Single</button>
            <button
              type="button"
              onClick={() => setIsDual(true)}
              aria-pressed={isDual}
              style={{ padding: '6px 10px', fontSize: 12, cursor: 'pointer', background: isDual ? 'var(--surface-primary)' : 'transparent', color: 'var(--text-primary)', border: 'none' }}
            >Dual</button>
          </div>
        </div>
        {/* Dual terminals responsive: stack on small, side-by-side on large */}
        <div style={{ display: 'grid', gap: 32, gridTemplateColumns: '1fr', alignItems: 'start' }} className="dual-terminal-wrapper">
          <div style={{ width: '100%' }}>
            <AdvancedTerminal onCycleComplete={() => setIsDual(true)} />
          </div>
          {isDual && showSecond && (
            <div style={{ width: '100%' }}>
              <AdvancedTerminal />
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 1100px) {
          .dual-terminal-wrapper { grid-template-columns: ${isDual ? "1fr 1fr" : "1fr"}; }
        }
        .dual-terminal-wrapper > div { min-width:0 }
      `}</style>
    </main>
  )
}
