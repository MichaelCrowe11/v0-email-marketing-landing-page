"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
  const [codeParticles, setCodeParticles] = useState<Array<{ id: number, x: number, y: number, char: string, color: string }>>([])

  // Generate colorful code particles while thinking
  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        const newParticles = Array.from({ length: 3 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          char: ['<', '>', '{', '}', '/', '*', '=', '+'][Math.floor(Math.random() * 8)],
          color: ['#22d3ee', '#a855f7', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)]
        }))
        setCodeParticles(prev => [...prev.slice(-20), ...newParticles])
      }, 100)
      return () => clearInterval(interval)
    } else {
      setCodeParticles([])
    }
  }, [isThinking])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsThinking(false)

    // Stream response with colorful characters
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
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background via-background to-muted/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/crowe-avatar.png" alt="Crowe Logic AI" width={40} height={40} className="rounded-full ring-2 ring-purple-500/30" />
          <div>
            <h1 className="font-semibold text-foreground bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crowe Logic AI
            </h1>
            <p className="text-xs text-muted-foreground">20+ years cultivation expertise</p>
          </div>
        </Link>
        
        <Link href="/gpts">
          <Button variant="outline" size="sm">
            Upgrade to Pro
          </Button>
        </Link>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="relative flex-shrink-0">
                {/* Colorful code particles swirling around avatar when thinking */}
                {isThinking && index === messages.length - 1 && (
                  <div className="absolute inset-0">
                    <AnimatePresence>
                      {codeParticles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: particle.x,
                            y: particle.y,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2 }}
                          className="absolute top-1/2 left-1/2 font-mono font-bold text-lg"
                          style={{ color: particle.color }}
                        >
                          {particle.char}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                
                {/* Avatar with glow effect */}
                <motion.div
                  animate={{
                    scale: isThinking && index === messages.length - 1 ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isThinking && index === messages.length - 1 ? Infinity : 0,
                  }}
                  className="relative"
                >
                  {isThinking && index === messages.length - 1 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-75 animate-pulse" />
                  )}
                  <Image
                    src="/crowe-avatar.png"
                    alt="Crowe Logic AI"
                    width={48}
                    height={48}
                    className="relative rounded-full ring-2 ring-purple-500/30"
                  />
                </motion.div>
              </div>
            )}
            
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-md'
                  : 'bg-card border border-border text-foreground rounded-bl-md'
              }`}
            >
              {message.isStreaming ? (
                <p className="text-sm leading-relaxed">
                  {message.content.split('').map((char, i) => {
                    const colors = ['text-cyan-400', 'text-purple-400', 'text-pink-400', 'text-green-400', 'text-yellow-400', 'text-blue-400']
                    const color = colors[i % colors.length]
                    return (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`${char === ' ' ? '' : color} font-medium`}
                      >
                        {char}
                      </motion.span>
                    )
                  })}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-0.5 h-4 ml-1 bg-purple-500"
                  />
                </p>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Thinking state with magical particles */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-75 animate-pulse" />
              <Image
                src="/crowe-avatar.png"
                alt="Thinking"
                width={48}
                height={48}
                className="relative rounded-full ring-2 ring-purple-500/30"
              />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Analyzing with 20+ years of expertise...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask about contamination, substrates, SOPs, or any cultivation question..."
              className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isThinking}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Free demo • <Link href="/gpts" className="text-purple-500 hover:underline">Upgrade for full access</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
