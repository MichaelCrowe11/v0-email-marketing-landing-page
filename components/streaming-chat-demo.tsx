"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

interface Message {
  role: "user" | "assistant"
  content: string
  thinking?: string
  timestamp?: string
  image?: string
  vrs?: {
    question: string
    top_hypothesis: string
    proposed_actions: string[]
    CroweLayerTags: string
  }
  evidenceLedger?: Array<{
    artifact_id: string
    type: string
    species?: string
    symptoms?: string
    hypothesis?: string
    confidence_pct?: number
  }>
}

const DEMO_CONVERSATIONS = [
  {
    user: "I found contamination in my petri dish. What should I do?",
    userImage: "/contamination-original.jpeg",
    thinking:
      "🔍 Analyzing image for contamination patterns...\n📊 Detecting bacterial bloom zones...\n🧪 Mapping safe transfer regions...\n🎯 Calculating optimal wedge positions...",
    vrs: {
      question: "Contamination detected in petri dish—where can I safely transfer from?",
      top_hypothesis:
        "Bacterial contamination in center with wet halo; leading edge mycelium still viable for transfer",
      proposed_actions: [
        "Transfer from marked zones A1-A3 (top colony) and B1-B3 (bottom colony)",
        "Take 2-3mm wedges from leading edge farthest from contaminated tissue",
        "AVOID center area (possible bacteria) and shiny/wet halo zones",
        "Cut at marked positions to maximize distance from contamination",
        "Work quickly to prevent cross-contamination during transfer",
      ],
      CroweLayerTags: "[PROBLEM:Contamination][URGENCY:High][ACTION:Transfer]",
    },
    evidenceLedger: [
      {
        artifact_id: "IMG-CONTAM-001",
        type: "visual_analysis",
        symptoms: "Central bacterial bloom with wet halo; viable mycelium at leading edges",
        hypothesis: "Bacterial contamination in center with wet halo; leading edge mycelium still viable for transfer",
        confidence_pct: 92,
      },
    ],
    responseImage: "/contamination-analysis.png",
  },
  {
    user: "Lion's Mane forms coral-like blobs with tan freckles near the base—what's the fastest remediation without sacrificing yield?",
    thinking:
      "🔍 Searching contamination edge case database...\n📊 Analyzing substrate moisture patterns...\n🧪 Cross-referencing diagnostic protocols...",
    vrs: {
      question:
        "Lion's Mane forms coral-like blobs with tan freckles near the base—what's the fastest remediation without sacrificing yield?",
      top_hypothesis: "Subclinical bacterial bloom at drain channel + over-misting leading to hydromat formation",
      proposed_actions: [
        "Stop direct surface misting; maintain RH via ambient control",
        "Increase FAE in small increments (10-15%); observe morphology 12-24h",
        "Spot-dry base; rotate block to side-fruit; harvest at spine length 10-15mm",
        "Run Q-tip glide test at freckles (slimy streak confirms bacterial)",
      ],
      CroweLayerTags: "[SPECIES:Hericium][PROBLEM:Contamination][URGENCY:Medium]",
    },
    evidenceLedger: [
      {
        artifact_id: "CCB-LM-001",
        type: "edgecase",
        species: "Hericium erinaceus",
        symptoms:
          "White spines stalling at 3-5mm; surface turns slightly matted, subtle citrus-like odor; tiny tan freckles at block base",
        hypothesis: "Subclinical bacterial bloom at drain channel + over-misting leading to hydromat formation",
        confidence_pct: 78,
      },
    ],
  },
  {
    user: "Shiitake block day 45 with no popcorning; what diagnostic confirms nutrient overheating vs moisture error?",
    thinking:
      "🔬 Analyzing incubation parameters...\n🌡️ Checking thermal profiles...\n📋 Reviewing substrate formulation data...",
    vrs: {
      question:
        "Shiitake block day 45 with no popcorning; what diagnostic confirms nutrient overheating vs moisture error?",
      top_hypothesis: "Nutrient oversupplementation → overheating micro-pockets preventing proper browning",
      proposed_actions: [
        "Insert clean probe to check core vs ambient (+≥3°C indicates overheating)",
        "Cross-section ribbon test for moisture gradient",
        "Next batch: reduce supplement to 12-15%, lower stack height",
        "If browning stalled, apply 12-18°C cold shock",
      ],
      CroweLayerTags: "[SPECIES:Lentinula][PHASE:Incubation][URGENCY:Low]",
    },
    evidenceLedger: [
      {
        artifact_id: "CCB-SH-004",
        type: "edgecase",
        species: "Lentinula edodes",
        symptoms: "Popcorning absent day 45; block leathery, faint almond smell; slight caramel discoloration at edges",
        hypothesis: "Nutrient oversupplementation → overheating micro-pockets preventing proper browning",
        confidence_pct: 72,
      },
    ],
  },
]

export function StreamingChatDemo() {
  const [currentConvo, setCurrentConvo] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const { theme } = useTheme()

  const formatTime = useCallback(() => {
    const now = new Date()
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }, [])

  const convo = useMemo(() => DEMO_CONVERSATIONS[currentConvo], [currentConvo])

  const startConversation = useCallback(async () => {
    setMessages([])
    setIsThinking(false)
    setStreamingText("")
    setIsStreaming(false)

    // Show user message
    await new Promise((resolve) => setTimeout(resolve, 500))
    setMessages([
      {
        role: "user",
        content: convo.user,
        timestamp: formatTime(),
        image: convo.userImage,
      },
    ])

    // Show thinking state
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsThinking(true)
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        thinking: convo.thinking,
        timestamp: formatTime(),
      },
    ])

    // Start streaming VRS
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setIsThinking(false)
    setIsStreaming(true)

    // Stream the VRS summary
    const vrsText = convo.responseImage
      ? `👁️ Visual Analysis Complete\n\n🎯 Diagnosis:\n${convo.vrs.top_hypothesis}\n\n✅ Transfer Instructions:\n${convo.vrs.proposed_actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\n🏷️ ${convo.vrs.CroweLayerTags}`
      : `👁️ Visible Reasoning Summary\n\n🎯 Top Hypothesis:\n${convo.vrs.top_hypothesis}\n\n✅ Proposed Actions:\n${convo.vrs.proposed_actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\n🏷️ ${convo.vrs.CroweLayerTags}`

    const chars = vrsText.split("")
    let currentText = ""

    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i]
      setStreamingText(currentText)
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: currentText,
          vrs: convo.vrs,
          evidenceLedger: convo.evidenceLedger,
          timestamp: formatTime(),
          image: convo.responseImage,
        }
        return newMessages
      })
      await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 25))
    }

    setIsStreaming(false)

    // Wait before next conversation
    await new Promise((resolve) => setTimeout(resolve, 6000))
    setCurrentConvo((prev) => (prev + 1) % DEMO_CONVERSATIONS.length)
  }, [convo, formatTime])

  useEffect(() => {
    startConversation()
  }, [startConversation])

  const handleNextConvo = useCallback(() => {
    setCurrentConvo((prev) => (prev + 1) % DEMO_CONVERSATIONS.length)
  }, [])

  return (
    <section className="relative px-4 py-16 bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden">
      {/* Animated particle background */}
      <div className="particle-bg opacity-50" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-3000" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
            See Crowe Logic AI{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              think
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch the AI solve complex cultivation problems in real-time with Michael's 20 years of expertise
          </p>
        </div>

        <div className="mx-auto max-w-md md:max-w-lg perspective-1000">
          {/* 3D Phone Container with realistic depth and shadows */}
          <div
            className="relative transform-gpu transition-transform duration-500 hover:scale-105"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateY(-5deg) rotateX(2deg)",
            }}
          >
            {/* Phone shadow */}
            <div className="absolute inset-0 bg-black/40 blur-3xl transform translate-y-8 scale-95 rounded-[3rem]" />

            {/* Phone body with realistic materials */}
            <div
              className={`relative rounded-[3rem] overflow-hidden transition-all duration-500 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black border-8 border-gray-900 shadow-2xl shadow-purple-500/20"
                  : "bg-gradient-to-br from-gray-100 via-white to-gray-200 border-8 border-gray-300 shadow-2xl shadow-gray-400/40"
              }`}
            >
              {/* Realistic phone bezel with metallic effect */}
              <div
                className={`absolute inset-0 rounded-[3rem] pointer-events-none ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-gray-700/20 via-transparent to-gray-900/20"
                    : "bg-gradient-to-br from-white/40 via-transparent to-gray-300/20"
                }`}
              />

              {/* Screen reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-[3rem]" />

              {/* Phone notch and status bar */}
              <div
                className={`relative h-8 flex items-center justify-center ${theme === "dark" ? "bg-black" : "bg-gray-900"}`}
              >
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl ${theme === "dark" ? "bg-black" : "bg-gray-900"}`}
                />
                <div
                  className={`absolute top-2 left-4 flex items-center gap-1 text-xs ${theme === "dark" ? "text-white" : "text-gray-300"}`}
                >
                  <span>9:41</span>
                </div>
                <div
                  className={`absolute top-2 right-4 flex items-center gap-1 text-xs ${theme === "dark" ? "text-white" : "text-gray-300"}`}
                >
                  <span>📶</span>
                  <span>📡</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Chat header with enhanced styling */}
              <div
                className={`border-b px-4 py-3 flex items-center gap-3 ${
                  theme === "dark"
                    ? "bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700"
                    : "bg-gradient-to-b from-gray-50 to-white border-gray-200"
                }`}
              >
                <button className="text-primary text-lg" aria-label="Back">
                  ‹
                </button>
                <div className="relative">
                  {/* Enhanced Crowe avatar with blinking animation */}
                  <motion.div
                    animate={{
                      opacity: isThinking ? [1, 0.3, 1] : 1,
                      scale: isThinking ? [1, 0.92, 1] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isThinking ? Number.POSITIVE_INFINITY : 0,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    {/* Colorful code swirl effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-md opacity-75 animate-spin-slow" />
                    <img
                      src="/crowe-avatar.png"
                      alt="Crowe Logic AI"
                      className="relative w-10 h-10 rounded-full ring-2 ring-purple-500/50 shadow-lg"
                    />
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: isThinking ? [1, 1.3, 1] : 1,
                      opacity: isThinking ? [1, 0.4, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isThinking ? Number.POSITIVE_INFINITY : 0,
                    }}
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${theme === "dark" ? "border-gray-900" : "border-white"}`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Crowe Logic AI
                  </h3>
                  <p className="text-xs text-green-400">Active now</p>
                </div>
                <button onClick={handleNextConvo} className="text-primary text-sm font-medium">
                  Next →
                </button>
              </div>

              {/* Chat messages area with theme support */}
              <div
                className={`p-4 space-y-3 min-h-[600px] max-h-[600px] overflow-y-auto ${
                  theme === "dark"
                    ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
                    : "bg-gradient-to-b from-gray-50 via-white to-gray-50"
                }`}
              >
                <AnimatePresence mode="wait">
                  {messages.map((message, index) => (
                    <motion.div
                      key={`${currentConvo}-${index}`}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <motion.div
                          animate={{
                            opacity: isThinking && index === messages.length - 1 ? [1, 0.4, 1] : 1,
                            scale: isThinking && index === messages.length - 1 ? [1, 0.85, 1] : 1,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: isThinking && index === messages.length - 1 ? Number.POSITIVE_INFINITY : 0,
                          }}
                          className="relative"
                        >
                          {isThinking && index === messages.length - 1 && (
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-md opacity-50 animate-spin-slow" />
                          )}
                          <img
                            src="/crowe-avatar.png"
                            alt="Crowe Logic AI"
                            className="relative w-8 h-8 rounded-full flex-shrink-0 shadow-lg ring-2 ring-purple-500/30 mt-1"
                          />
                        </motion.div>
                      )}

                      <div className={`max-w-[75%] ${message.role === "user" ? "order-first" : ""}`}>
                        {message.thinking && isThinking && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-2 px-4 py-3 rounded-2xl backdrop-blur-sm border text-xs whitespace-pre-line ${
                              theme === "dark"
                                ? "bg-gray-800/80 border-purple-500/30 text-gray-300"
                                : "bg-white/80 border-purple-300 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex gap-1">
                                <motion.div
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                                  className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                                />
                                <motion.div
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                                  className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                />
                                <motion.div
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                                  className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full"
                                />
                              </div>
                              <span className="font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Analyzing...
                              </span>
                            </div>
                            {message.thinking}
                          </motion.div>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-3 shadow-lg ${
                            message.role === "user"
                              ? theme === "dark"
                                ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-br-md"
                                : "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                              : theme === "dark"
                                ? "bg-gray-800/90 backdrop-blur-sm border border-purple-500/20 text-gray-100 rounded-bl-md"
                                : "bg-white/90 backdrop-blur-sm border border-purple-200 text-gray-900 rounded-bl-md"
                          }`}
                        >
                          {message.image && message.role === "user" && (
                            <img
                              src={message.image || "/placeholder.svg"}
                              alt="User uploaded"
                              className="rounded-lg mb-2 w-full"
                            />
                          )}

                          <p className="text-sm leading-relaxed whitespace-pre-line font-code">
                            {message.content}
                            {isStreaming && index === messages.length - 1 && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
                                className="inline-block w-0.5 h-4 ml-1 bg-current"
                              />
                            )}
                          </p>

                          {message.image && message.role === "assistant" && !isStreaming && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="mt-3"
                            >
                              <img
                                src={message.image || "/placeholder.svg"}
                                alt="Analysis result"
                                className="rounded-lg w-full border-2 border-primary/20"
                              />
                              <p
                                className={`text-xs mt-2 italic ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}
                              >
                                ✓ Visual analysis with marked transfer zones
                              </p>
                            </motion.div>
                          )}

                          {message.evidenceLedger && !isStreaming && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: 0.5 }}
                              className={`mt-3 pt-3 border-t space-y-2 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                            >
                              <div
                                className={`text-xs font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}
                              >
                                📚 Evidence Ledger
                              </div>
                              {message.evidenceLedger.map((evidence, idx) => (
                                <div
                                  key={idx}
                                  className={`text-xs rounded-lg p-2 border ${
                                    theme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"
                                  }`}
                                >
                                  <div className="font-mono text-primary font-semibold">{evidence.artifact_id}</div>
                                  {evidence.species && (
                                    <div className={`mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                      {evidence.species}
                                    </div>
                                  )}
                                  <div
                                    className={`text-[10px] mt-1 line-clamp-2 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
                                  >
                                    {evidence.symptoms}
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <span
                                      className={`text-[10px] uppercase ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                                    >
                                      {evidence.type}
                                    </span>
                                    <span className="text-[10px] font-semibold text-green-600">
                                      {evidence.confidence_pct}% confidence
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>

                        <div
                          className={`mt-1 text-[10px] ${message.role === "user" ? "text-right" : "text-left"} ${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input area */}
              <div
                className={`border-t px-4 py-2 flex items-center gap-2 ${
                  theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <button
                  className={`text-xl hover:opacity-80 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  aria-label="Camera"
                >
                  📷
                </button>
                <div
                  className={`flex-1 rounded-full px-4 py-2 text-sm border ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-400 border-gray-700"
                      : "bg-gray-50 text-gray-500 border-gray-300"
                  }`}
                >
                  Message Crowe Logic AI...
                </div>
                <button className="text-primary text-xl hover:opacity-80 transition-colors" aria-label="Voice">
                  🎤
                </button>
              </div>

              {/* Home indicator */}
              <div className={`h-6 flex items-center justify-center ${theme === "dark" ? "bg-black" : "bg-gray-900"}`}>
                <div className={`w-32 h-1 rounded-full ${theme === "dark" ? "bg-white/30" : "bg-white/50"}`} />
              </div>
            </div>
          </div>

          {/* Demo indicators */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {DEMO_CONVERSATIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentConvo(idx)}
                aria-label={`Go to conversation ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentConvo ? "w-8 bg-primary" : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="mb-2 text-success font-semibold text-sm">✓ Image Analysis</div>
              <p className="text-xs text-muted-foreground">
                Upload photos for visual contamination detection with marked transfer zones
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="mb-2 text-success font-semibold text-sm">✓ VRS Format</div>
              <p className="text-xs text-muted-foreground">
                Visible Reasoning Summaries with evidence ledgers, not hidden chain-of-thought
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="mb-2 text-success font-semibold text-sm">✓ 20 Years Data</div>
              <p className="text-xs text-muted-foreground">
                Every answer backed by Michael Crowe's commercial cultivation expertise
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
