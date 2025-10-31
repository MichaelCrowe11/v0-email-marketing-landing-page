"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, Zap, Brain } from "lucide-react"
import Link from "next/link"
import { AIAvatarUltimate } from "@/components/ai-avatar-ultimate"
import { AIAvatarSwirlAdvanced } from "@/components/ai-avatar-swirl-advanced"

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey! I'm Crowe Logic AI, built on Michael Crowe's 20+ years at Southwest Mushrooms. I can help with contamination issues, substrate formulas, SOPs, or any cultivation questions. What do you need?"
    }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isResponding, setIsResponding] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking || isResponding) return

    // Add user message
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsThinking(false)
    setIsResponding(true)

    // Stream response
    const responses = [
      "I can help with that! Based on my experience at Southwest Mushrooms, here's what I recommend for your substrate formulation...",
      "Great question! Let me break down the contamination triage process. First, we need to identify the contaminant type...",
      "For oyster mushrooms, I'd suggest a substrate mix of 50% hardwood sawdust, 20% wheat bran, 2% gypsum, and 28% water. Here's why...",
      "That's a common issue in commercial production. I've seen this hundreds of times. The solution is to adjust your FAE and humidity levels..."
    ]

    const response = responses[Math.floor(Math.random() * responses.length)]

    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }])

    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30))
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].content = response.slice(0, i + 1)
        return newMessages
      })
    }

    setMessages(prev => {
      const newMessages = [...prev]
      newMessages[newMessages.length - 1].isStreaming = false
      return newMessages
    })

    setIsResponding(false)
  }

  // Get avatar state
  const getAvatarState = (messageIndex: number): "idle" | "thinking" | "responding" => {
    if (isThinking && messageIndex === messages.length - 1) return "thinking"
    if (isResponding && messageIndex === messages.length - 1) return "responding"
    return "idle"
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header with enhanced styling */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between p-4 md:p-6 border-b border-purple-500/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl"
      >
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <AIAvatarSwirlAdvanced
              state={isThinking ? "thinking" : isResponding ? "responding" : "idle"}
              size={60}
              particleCount={60}
              showNeuralConnections={true}
              enableTrails={true}
              reactToMouse={false}
            />
            {(isThinking || isResponding) && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-purple-500/20 rounded-full blur-xl -z-10"
              />
            )}
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crowe Logic AI
            </h1>
            <div className="flex items-center gap-2">
              {isThinking && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-purple-400"
                >
                  <Brain className="w-3 h-3" />
                </motion.div>
              )}
              {isResponding && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-cyan-400"
                >
                  <Zap className="w-3 h-3" />
                </motion.div>
              )}
              <p className="text-xs text-muted-foreground">
                {isThinking && "Analyzing your question..."}
                {isResponding && "Crafting response..."}
                {!isThinking && !isResponding && "20+ years cultivation expertise"}
              </p>
            </div>
          </div>
        </Link>

        <Link href="/gpts">
          <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 hover:from-purple-600/30 hover:to-pink-600/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </Link>
      </motion.div>

      {/* Chat Messages with enhanced styling */}
      <div className="relative z-10 flex-1 overflow-auto p-4 md:p-8 space-y-8 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <motion.div
                  className="flex-shrink-0"
                  animate={getAvatarState(index) === "thinking" ? { y: [-2, 2, -2] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <AIAvatarSwirlAdvanced
                    state={getAvatarState(index)}
                    size={70}
                    particleCount={100}
                    showNeuralConnections={index === messages.length - 1 && (isThinking || isResponding)}
                    enableTrails={index === messages.length - 1 && (isThinking || isResponding)}
                    reactToMouse={false}
                  />
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`relative max-w-[75%] rounded-3xl px-6 py-4 shadow-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white rounded-br-md border border-purple-400/30'
                    : 'bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 text-foreground rounded-bl-md'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur opacity-50 -z-10" />
                )}
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                  {message.isStreaming && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-1 h-5 ml-1 bg-gradient-to-b from-purple-400 to-cyan-400"
                    />
                  )}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced thinking state */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-4"
            >
              <motion.div
                className="flex-shrink-0"
                animate={{ y: [-3, 3, -3], rotate: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AIAvatarSwirlAdvanced
                  state="thinking"
                  size={70}
                  particleCount={150}
                  showNeuralConnections={true}
                  enableTrails={true}
                  reactToMouse={false}
                />
              </motion.div>
              <motion.div
                className="relative bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl rounded-bl-md px-6 py-4 shadow-2xl"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur -z-10" />
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <span className="text-sm md:text-base text-purple-300">
                    Analyzing with 20+ years of expertise...
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 p-4 md:p-6 border-t border-purple-500/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20" />
            <div className="relative flex gap-3 bg-slate-950/50 p-2 rounded-2xl border border-purple-500/30">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ask about contamination, substrates, SOPs, or any cultivation question..."
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-xl text-sm md:text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                disabled={isThinking || isResponding}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isThinking || isResponding}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate-400 text-center mt-3">
            Free demo • <Link href="/gpts" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">Upgrade for full access</Link>
          </p>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  )
}
