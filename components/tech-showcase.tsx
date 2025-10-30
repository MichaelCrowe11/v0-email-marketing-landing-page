"use client"

import { useEffect, useState } from "react"
import { LiveCodeGenerator } from "./live-code-generator"
import { AdvancedTerminal } from "./advanced-terminal"

export function TechShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [terminalLines, setTerminalLines] = useState<string[]>([])

  const codeSnippets = [
    "// Initializing Mycology Neural Network...",
    "import { TensorFlow } from '@tensorflow/tfjs'",
    "import { DNASequencer } from './sequencer'",
    "",
    "const model = await tf.loadLayersModel({",
    "  modelUrl: 'mycology-classifier-v3',",
    "  species: 10847,",
    "  accuracy: 0.9847",
    "})",
    "",
    "async function analyzeSporePattern(img: ImageData) {",
    "  const morphology = extractFeatures(img)",
    "  const dna = await sequenceDNA(morphology)",
    "  const prediction = model.predict(dna)",
    "  ",
    "  return {",
    "    species: prediction.scientificName,",
    "    confidence: prediction.score,",
    "    characteristics: morphology.details,",
    "    habitat: prediction.environment",
    "  }",
    "}",
    "",
    "// Cross-referencing 10,847 species...",
    "const match = await db.query(dnaSequence)",
    "console.log('✓ Match:', match.name)",
  ]

  const terminalOutput = [
    "[AI] Loading neural network weights...",
    "[AI] ✓ Model loaded: 10,847 species",
    "[AI] Initializing DNA sequencer...",
    "[AI] ✓ Sequencer ready",
    "[AI] Processing spore patterns...",
    "[AI] ⚡ Analyzing morphology...",
    "[AI] ✓ Features extracted: 247 markers",
    "[AI] Cross-referencing database...",
    "[AI] ✓ Match found: 98.47% confidence",
    "[AI] Generating comprehensive report...",
    "[AI] ✓ Analysis complete",
  ]

  const problems = [
    { title: "DNA Sequence Analysis", status: "✓", time: "0.3s", color: "text-green-400" },
    { title: "Spore Pattern Recognition", status: "⚡", time: "1.2s", color: "text-yellow-400" },
    { title: "Species Classification", status: "⚡", time: "0.8s", color: "text-blue-400" },
    { title: "Database Cross-reference", status: "✓", time: "0.5s", color: "text-green-400" },
    { title: "AI Insight Generation", status: "⏳", time: "—", color: "text-gray-400" },
    { title: "3D Model Reconstruction", status: "✓", time: "2.1s", color: "text-green-400" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % problems.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [problems.length])

  useEffect(() => {
    let currentLine = 0
    const typeInterval = setInterval(() => {
      if (currentLine < codeSnippets.length) {
        setCodeLines((prev) => [...prev, codeSnippets[currentLine]])
        currentLine++
      } else {
        setTimeout(() => {
          setCodeLines([])
          currentLine = 0
        }, 2000)
      }
    }, 400)
    return () => clearInterval(typeInterval)
  }, [])

  useEffect(() => {
    let currentLine = 0
    const terminalInterval = setInterval(() => {
      if (currentLine < terminalOutput.length) {
        setTerminalLines((prev) => [...prev, terminalOutput[currentLine]])
        currentLine++
      } else {
        setTimeout(() => {
          setTerminalLines([])
          currentLine = 0
        }, 2000)
      }
    }, 800)
    return () => clearInterval(terminalInterval)
  }, [])

  return (
    <div className="relative w-full min-h-[600px] flex flex-col gap-8">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/50 via-purple-500/50 to-accent/50 blur-3xl animate-pulse" />
          <div className="relative bg-background/95 backdrop-blur-sm p-6 rounded-2xl border-2 border-accent/60 shadow-2xl">
            <img
              src="/crowe-logic-logo.png"
              alt="Crowe Logic AI"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-accent/70"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-background shadow-lg">
              LIVE
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <LiveCodeGenerator />
        <AdvancedTerminal />
      </div>
    </div>
  )
}
