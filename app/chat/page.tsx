"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Code, FileText, Download, Share2, PanelLeftClose, PanelRightClose, Sparkles } from "lucide-react"
import Image from "next/image"

type PanelLayout = 'all-three' | 'chat-code' | 'chat-preview' | 'chat-only'
type DocumentType = 'sop' | 'report' | 'business-plan' | null

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export default function ChatPage() {
  const [layout, setLayout] = useState<PanelLayout>('chat-only')
  const [documentType, setDocumentType] = useState<DocumentType>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey! I'm Crowe Logic AI. I can help you with contamination issues, substrate formulas, or generate professional documents like SOPs and reports. What do you need?"
    }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [codeParticles, setCodeParticles] = useState<Array<{ id: number, x: number, y: number, char: string, color: string }>>([])
  const [documentMarkdown, setDocumentMarkdown] = useState('')

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
    const response = "I can help with that! Let me analyze your substrate formulation and generate a detailed SOP. This will include precise measurements, sterilization protocols, and quality control checkpoints based on 20+ years of production data."
    
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

  const startDocumentGeneration = (type: DocumentType) => {
    setDocumentType(type)
    setLayout('all-three')
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Great! I'll generate a ${type === 'sop' ? 'Standard Operating Procedure' : type === 'report' ? 'Analysis Report' : 'Business Plan'} for you. Let me gather some details...`
    }])
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Image src="/crowe-avatar.png" alt="Crowe Logic AI" width={40} height={40} className="rounded-full" />
          <div>
            <h1 className="font-semibold text-foreground">Crowe Logic AI</h1>
            <p className="text-xs text-muted-foreground">20+ years cultivation expertise</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Document Generation Buttons */}
          {layout === 'chat-only' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startDocumentGeneration('sop')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate SOP
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startDocumentGeneration('report')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </>
          )}
          
          {/* Layout Controls */}
          {layout !== 'chat-only' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout(layout === 'all-three' ? 'chat-preview' : 'all-three')}
                title="Toggle code panel"
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout(layout === 'all-three' ? 'chat-code' : 'all-three')}
                title="Toggle preview panel"
              >
                <PanelRightClose className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLayout('chat-only')
                  setDocumentType(null)
                }}
              >
                Close Workspace
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Code/Markdown Editor */}
        {(layout === 'all-three' || layout === 'chat-code') && (
          <div className="w-1/3 border-r border-border bg-gray-900 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-gray-200">Markdown Source</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                Copy
              </Button>
            </div>
            
            <div className="flex-1 p-4 font-mono text-sm overflow-auto">
              <div className="space-y-1 text-gray-300">
                <div className="text-green-400"># Standard Operating Procedure</div>
                <div className="text-purple-400">## Substrate Preparation</div>
                <div className="text-gray-500">// Generated by Crowe Logic AI</div>
                <div className="text-gray-400"></div>
                <div className="text-cyan-400">### Materials</div>
                <div>- Hardwood sawdust: 50%</div>
                <div>- Wheat bran: 20%</div>
                <div className="text-pink-400 animate-pulse">|</div>
              </div>
            </div>
          </div>
        )}

        {/* Center Panel: Chat Interface */}
        <div className={`flex flex-col ${layout === 'chat-only' ? 'flex-1' : layout === 'all-three' ? 'w-1/3' : 'flex-1'} bg-gradient-to-b from-background to-muted/5`}>
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
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Crowe Logic AI anything..."
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button onClick={handleSendMessage} disabled={!input.trim() || isThinking}>
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel: Document Preview */}
        {(layout === 'all-three' || layout === 'chat-preview') && (
          <div className="w-1/3 border-l border-border bg-white flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-900">Document Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-8 overflow-auto">
              <div className="mb-6 pb-4 border-b-2 border-purple-600">
                <div className="flex items-center justify-between mb-4">
                  <Image src="/crowe-logic-logo.png" alt="Crowe Logic" width={50} height={50} className="rounded-full" />
                  <div className="text-right text-xs text-gray-500">
                    <p>Doc ID: CL-SOP-001</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Standard Operating Procedure</h1>
                <h2 className="text-lg font-semibold text-purple-600">Substrate Preparation</h2>
              </div>

              <div className="space-y-4 text-gray-800 text-sm">
                <section>
                  <h3 className="font-bold text-gray-900 mb-2">Materials</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Hardwood sawdust: 50%</li>
                    <li>Wheat bran: 20%</li>
                    <li className="text-gray-400 italic">Generating...</li>
                  </ul>
                </section>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p className="font-semibold text-purple-600">Crowe Logic AI</p>
                <p>© {new Date().getFullYear()} Southwest Mushrooms</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
