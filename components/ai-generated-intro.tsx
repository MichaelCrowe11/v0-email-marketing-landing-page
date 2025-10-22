"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AIGeneratedIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<"logo" | "code" | "ui" | "complete">("logo")
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [uiElements, setUIElements] = useState<string[]>([])

  const codeSequence = [
    "import { CroweLogic } from '@/ai/reasoning'",
    "const engine = new CroweLogic({ years: 20 })",
    "engine.loadKnowledge('mycology', 'cultivation')",
    "const ui = engine.generateInterface()",
    "ui.render({ theme: 'premium', style: 'vercel' })",
  ]

  const uiSequence = ["Navigation", "Hero Section", "Chat Interface", "Features Grid", "Pricing Cards", "Documentation"]

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Stage 1: Show logo (1.5s)
    timers.push(
      setTimeout(() => {
        setStage("code")
      }, 1500),
    )

    // Stage 2: Type code lines (5s)
    codeSequence.forEach((line, index) => {
      timers.push(
        setTimeout(
          () => {
            setCodeLines((prev) => [...prev, line])
          },
          2000 + index * 800,
        ),
      )
    })

    // Stage 3: Build UI elements (4s)
    timers.push(
      setTimeout(() => {
        setStage("ui")
      }, 6500),
    )

    uiSequence.forEach((element, index) => {
      timers.push(
        setTimeout(
          () => {
            setUIElements((prev) => [...prev, element])
          },
          7000 + index * 500,
        ),
      )
    })

    // Stage 4: Complete (10s)
    timers.push(
      setTimeout(() => {
        setStage("complete")
        setTimeout(onComplete, 300)
      }, 10000),
    )

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      {stage !== "complete" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
            {/* Logo Stage */}
            {stage === "logo" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.img
                  src="/crowe-logic-logo.png"
                  alt="Crowe Logic"
                  className="h-32 w-32 rounded-full ring-2 ring-white/10"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255, 255, 255, 0.3)",
                      "0 0 40px rgba(255, 255, 255, 0.5)",
                      "0 0 20px rgba(255, 255, 255, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <h1 className="text-4xl font-bold text-white">Crowe Logic</h1>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-white"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Code Generation Stage */}
            {stage === "code" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <img
                    src="/crowe-logic-logo.png"
                    alt="Crowe Logic"
                    className="h-12 w-12 rounded-full ring-2 ring-white/10"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Initializing Crowe Logic</h2>
                    <p className="text-sm text-gray-300">Generating your experience...</p>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-gray-400 text-xs">crowe-logic.ts</span>
                  </div>
                  <div className="space-y-2">
                    {codeLines.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3"
                      >
                        <span className="text-gray-500 select-none">{index + 1}</span>
                        <span className="text-gray-300">{line}</span>
                      </motion.div>
                    ))}
                    {codeLines.length > 0 && codeLines.length < codeSequence.length && (
                      <motion.div
                        className="flex gap-3"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <span className="text-gray-500">{codeLines.length + 1}</span>
                        <span className="text-white">▊</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* UI Building Stage */}
            {stage === "ui" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <img
                    src="/crowe-logic-logo.png"
                    alt="Crowe Logic"
                    className="h-12 w-12 rounded-full ring-2 ring-white/10"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Building Interface</h2>
                    <p className="text-sm text-gray-300">Assembling components...</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {uiElements.map((element, index) => (
                    <motion.div
                      key={element}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{element}</div>
                        <div className="text-xs text-gray-400">Ready</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="bg-zinc-900 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-zinc-400 to-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(uiElements.length / uiSequence.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
