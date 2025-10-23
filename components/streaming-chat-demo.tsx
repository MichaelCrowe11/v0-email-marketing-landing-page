"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
            See Crowe Logic <span className="text-gradient-purple">think</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch the AI solve complex cultivation problems in real-time with Michael's 20 years of expertise
          </p>
        </div>

        <div className="mx-auto max-w-md md:max-w-lg">
          <div className="glass-ultra rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden bg-black transition-shadow duration-300 hover:shadow-3xl">
            {/* Phone notch and status bar */}
            <div className="relative bg-black h-8 flex items-center justify-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl" />
              <div className="absolute top-2 left-4 flex items-center gap-1 text-white text-xs">
                <span>9:41</span>
              </div>
              <div className="absolute top-2 right-4 flex items-center gap-1 text-white text-xs">
                <span>📶</span>
                <span>📡</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Chat Header - iOS style */}
            <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <button className="text-primary text-lg" aria-label="Back">
                ‹
              </button>
              <div className="relative">
                <img
                  src="/crowe-logic-logo.png"
                  alt="Crowe Logic"
                  className="w-10 h-10 rounded-full ring-2 ring-primary/30 shadow-md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">Crowe Logic AI</h3>
                <p className="text-xs text-green-600">Active now</p>
              </div>
              <button onClick={handleNextConvo} className="text-primary text-sm font-medium">
                Next →
              </button>
            </div>

            {/* Chat Messages - iOS iMessage style */}
            <div className="p-4 space-y-3 min-h-[600px] max-h-[600px] overflow-y-auto bg-white">
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
                      <img
                        src="/crowe-logic-logo.png"
                        alt="Crowe Logic"
                        className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm mt-1"
                      />
                    )}

                    <div className={`max-w-[75%] ${message.role === "user" ? "order-first" : ""}`}>
                      {message.thinking && isThinking && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-2 px-4 py-3 rounded-2xl bg-gray-100 text-xs text-gray-600 whitespace-pre-line"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex gap-1">
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                              />
                            </div>
                            <span className="font-medium">Analyzing...</span>
                          </div>
                          {message.thinking}
                        </motion.div>
                      )}

                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          message.role === "user"
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        {message.image && message.role === "user" && (
                          <img
                            src={message.image || "/placeholder.svg"}
                            alt="User uploaded"
                            className="rounded-lg mb-2 w-full"
                          />
                        )}

                        <p className="text-sm leading-relaxed whitespace-pre-line">
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
                            <p className="text-xs text-gray-500 mt-2 italic">
                              ✓ Visual analysis with marked transfer zones
                            </p>
                          </motion.div>
                        )}

                        {message.evidenceLedger && !isStreaming && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ delay: 0.5 }}
                            className="mt-3 pt-3 border-t border-gray-200 space-y-2"
                          >
                            <div className="text-xs font-semibold text-gray-700">📚 Evidence Ledger</div>
                            {message.evidenceLedger.map((evidence, idx) => (
                              <div key={idx} className="text-xs bg-white rounded-lg p-2 border border-gray-200">
                                <div className="font-mono text-primary font-semibold">{evidence.artifact_id}</div>
                                {evidence.species && <div className="text-gray-600 mt-1">{evidence.species}</div>}
                                <div className="text-gray-500 text-[10px] mt-1 line-clamp-2">{evidence.symptoms}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-[10px] text-gray-400 uppercase">{evidence.type}</span>
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
                        className={`mt-1 text-[10px] text-gray-400 ${message.role === "user" ? "text-right" : "text-left"}`}
                      >
                        {message.timestamp}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input bar - iOS style */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 flex items-center gap-2">
              <button className="text-gray-400 text-xl" aria-label="Camera">
                📷
              </button>
              <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400 border border-gray-200">
                Message Crowe Logic...
              </div>
              <button className="text-primary text-xl" aria-label="Voice">
                🎤
              </button>
            </div>

            {/* Home indicator */}
            <div className="bg-black h-6 flex items-center justify-center">
              <div className="w-32 h-1 bg-white/30 rounded-full" />
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
                  idx === currentConvo ? "w-8 bg-primary" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-glass">
              <div className="mb-2 text-success font-semibold text-sm">✓ Image Analysis</div>
              <p className="text-xs text-muted-foreground">
                Upload photos for visual contamination detection with marked transfer zones
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-glass">
              <div className="mb-2 text-success font-semibold text-sm">✓ VRS Format</div>
              <p className="text-xs text-muted-foreground">
                Visible Reasoning Summaries with evidence ledgers, not hidden chain-of-thought
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-glass">
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
