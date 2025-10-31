"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Send } from "lucide-react"
import Link from "next/link"
import { AIAvatarUltimate } from "@/components/ai-avatar-ultimate"

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
    <div className="flex flex-col h-screen bg-gradient-to-b from-background via-background to-muted/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <AIAvatarSwirlAdvanced
            state={isThinking ? "thinking" : isResponding ? "responding" : "idle"}
            size={50}
            particleCount={40}
            showNeuralConnections={false}
            enableTrails={false}
            reactToMouse={false}
          />
          <div>
            <h1 className="font-semibold text-foreground bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crowe Logic AI
            </h1>
            <p className="text-xs text-muted-foreground">
              {isThinking && "🧠 Analyzing..."}
              {isResponding && "💬 Responding..."}
              {!isThinking && !isResponding && "20+ years cultivation expertise"}
            </p>
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
              <div className="flex-shrink-0">
                <AIAvatarSwirlAdvanced
                  state={getAvatarState(index)}
                  size={60}
                  particleCount={80}
                  showNeuralConnections={index === messages.length - 1}
                  enableTrails={index === messages.length - 1}
                  reactToMouse={false}
                />
              </div>
            )}
            
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-md'
                  : 'bg-card border border-border text-foreground rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
                {message.isStreaming && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-0.5 h-4 ml-1 bg-purple-500"
                  />
                )}
              </p>
            </div>
          </motion.div>
        ))}
        
        {/* Thinking state */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0">
              <AIAvatarSwirlAdvanced
                state="thinking"
                size={60}
                particleCount={100}
                showNeuralConnections={true}
                enableTrails={true}
                reactToMouse={false}
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
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask about contamination, substrates, SOPs, or any cultivation question..."
              className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isThinking || isResponding}
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
