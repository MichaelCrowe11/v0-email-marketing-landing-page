"use client"

import { useEffect, useState } from "react"

export function AdvancedTerminal() {
  const [lines, setLines] = useState<string[]>([])
  const [mode, setMode] = useState<"dark" | "light">("dark")

  const terminalOutput = [
    "[SYSTEM] Initializing Crowe Logic AI Engine v3.0...",
    "[GENETIC] Loading genetic algorithm optimizer...",
    "[GENETIC] Population size: 100 | Mutation rate: 0.01 | Generations: 1000",
    "[DNA] Sequencing mushroom genome: ATGCTAGCTAGC...",
    "[DNA] ✓ Sequence complete: 10,847 base pairs analyzed",
    "[NEURAL] Loading deep learning model...",
    "[NEURAL] ✓ Model loaded: 10,847 species | 98.47% accuracy",
    "[QUANTUM] Initializing quantum neural network...",
    "[QUANTUM] ✓ Qubits entangled: 256 | Coherence time: 100μs",
    "[PIPELINE] Starting AI processing pipeline...",
    "[PIPELINE] Stage 1/6: Spore pattern recognition... ✓ 0.3s",
    "[PIPELINE] Stage 2/6: DNA sequence analysis... ✓ 1.2s",
    "[PIPELINE] Stage 3/6: Morphological feature extraction... ✓ 0.8s",
    "[PIPELINE] Stage 4/6: Species classification... ✓ 0.5s",
    "[PIPELINE] Stage 5/6: Habitat prediction... ✓ 0.4s",
    "[PIPELINE] Stage 6/6: 3D model reconstruction... ✓ 2.1s",
    "[GENETIC] Running genetic algorithm optimization...",
    "[GENETIC] Generation 100: Best fitness = 0.847",
    "[GENETIC] Generation 200: Best fitness = 0.912",
    "[GENETIC] Generation 300: Best fitness = 0.956",
    "[GENETIC] ✓ Optimization complete: Optimal conditions found",
    "[SYSTEM] ✓ All systems operational | Ready for production",
  ]

  useEffect(() => {
    let currentLine = 0
    const interval = setInterval(() => {
      if (currentLine < terminalOutput.length) {
        setLines((prev) => [...prev, terminalOutput[currentLine]])
        currentLine++
      } else {
        setTimeout(() => {
          setLines([])
          currentLine = 0
        }, 3000)
      }
    }, 300)
    return () => clearInterval(interval)
  }, [])

  const isDark = mode === "dark"
  const containerStyle: React.CSSProperties = {
    background: isDark ? "#000" : "#fff",
    color: isDark ? "#fff" : "#000",
    border: `1px solid ${isDark ? "#2a2a2a" : "#e5e5e5"}`,
    borderRadius: 12,
    padding: 16,
    boxShadow: isDark
      ? "0 4px 18px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)"
      : "0 4px 18px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)",
    height: 400,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: 'var(--font-code, ui-monospace, SFMono-Regular, Menlo, monospace)'
  }

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: `1px solid ${isDark ? "#2a2a2a" : "#e5e5e5"}`,
    fontSize: 12,
    letterSpacing: 0.5
  }

  const lineColor = (line: string) => {
    if (line.includes("✓")) return isDark ? "#ffffff" : "#000000"
    if (line.includes("[SYSTEM]")) return isDark ? "#d0d0d0" : "#1a1a1a"
    if (line.includes("[PIPELINE]")) return isDark ? "#bcbcbc" : "#222"
    if (line.includes("[GENETIC]") || line.includes("[DNA]") || line.includes("[NEURAL]") || line.includes("[QUANTUM]")) return isDark ? "#c8c8c8" : "#202020"
    return isDark ? "#b5b5b5" : "#2a2a2a"
  }

  return (
    <div style={containerStyle} aria-label="Monochrome terminal" role="region">
      <div style={headerStyle}>
        <div style={{ display: "flex", gap: 6 }} aria-hidden="true">
          <span style={{ width: 8, height: 8, background: isDark ? "#1f1f1f" : "#e2e2e2", borderRadius: 4, display: "inline-block" }} />
          <span style={{ width: 8, height: 8, background: isDark ? "#1f1f1f" : "#e2e2e2", borderRadius: 4, display: "inline-block" }} />
          <span style={{ width: 8, height: 8, background: isDark ? "#1f1f1f" : "#e2e2e2", borderRadius: 4, display: "inline-block" }} />
        </div>
        <strong style={{ fontWeight: 600 }}>Crowe Logic Terminal</strong>
        <button
          onClick={() => setMode(isDark ? "light" : "dark")}
          style={{
            marginLeft: "auto",
            fontSize: 11,
            padding: "4px 10px",
            border: `1px solid ${isDark ? "#2a2a2a" : "#d0d0d0"}`,
            background: isDark ? "#111" : "#f7f7f7",
            color: isDark ? "#fff" : "#000",
            borderRadius: 6,
            cursor: "pointer"
          }}
          aria-label="Toggle terminal light/dark mode"
        >
          {isDark ? "Light" : "Dark"} Mode
        </button>
      </div>
      <div style={{ fontSize: 12, flex: 1, overflowY: "auto", paddingRight: 4 }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color: lineColor(line),
              fontWeight: line.includes("[SYSTEM]") || line.includes("✓") ? 600 : 500,
              opacity: 1,
              lineHeight: 1.4,
              animation: "fade-in 0.3s ease",
              whiteSpace: 'pre-wrap'
            }}
          >
            {line}
          </div>
        ))}
        <div style={{ width: 8, height: 14, background: isDark ? "#ffffff" : "#000000", marginTop: 4, animation: "cursor-breathe 1s ease-in-out infinite" }} aria-hidden="true" />
      </div>
    </div>
  )
}
