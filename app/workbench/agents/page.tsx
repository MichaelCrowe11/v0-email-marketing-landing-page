"use client"

import { useState, useRef, useEffect } from "react"
import { DeepParallelAvatar } from "@/components/workbench/deep-parallel-avatar"
import { Button } from "@/components/ui/button"
import { Send, Sparkles } from "lucide-react"
import Link from "next/link"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  agent?: string
}

export default function AgentsPage() {
  const [strategistState, setStrategistState] = useState<"idle" | "thinking" | "reasoning" | "complete">("idle")
  const [philosopherState, setPhilosopherState] = useState<"idle" | "thinking" | "reasoning" | "complete">("idle")
  const [visionaryState, setVisionaryState] = useState<"idle" | "thinking" | "reasoning" | "complete">("idle")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string>("DeepParallel")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const agents = [
    {
      name: "DeepParallel",
      subtitle: "The Strategist",
      description: "Fast, efficient, tactical thinker for rapid analysis and quick insights",
      avatar: "/crowe-logic-logo.png",
      primaryColor: "#22D3EE",
      secondaryColor: "#3B82F6",
      state: strategistState,
      setState: setStrategistState,
    },
    {
      name: "DeepThought",
      subtitle: "The Philosopher",
      description: "Deep reasoning and complex problem-solving with profound insights",
      avatar: "/crowe-logic-logo.png",
      primaryColor: "#A855F7",
      secondaryColor: "#EC4899",
      state: philosopherState,
      setState: setPhilosopherState,
    },
    {
      name: "DeepVision",
      subtitle: "The Visionary",
      description: "Visual analysis and pattern recognition with creative solutions",
      avatar: "/crowe-logic-logo.png",
      primaryColor: "#10B981",
      secondaryColor: "#F59E0B",
      state: visionaryState,
      setState: setVisionaryState,
    },
  ]

  const simulateReasoning = (setState: React.Dispatch<React.SetStateAction<"idle" | "thinking" | "reasoning" | "complete">>) => {
    setState("thinking")
    setTimeout(() => setState("reasoning"), 1000)
    setTimeout(() => setState("complete"), 4000)
    setTimeout(() => setState("idle"), 6000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Set agent to thinking state
    const agent = agents.find(a => a.name === selectedAgent)
    if (agent) {
      agent.setState("thinking")
      setTimeout(() => agent.setState("reasoning"), 500)
    }

    try {
      // Call Azure OpenAI via our API
      const response = await fetch('/api/workbench/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: selectedAgent,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
          })).concat([{
            role: 'user',
            content: inputValue,
          }]),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from agent')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        agent: selectedAgent,
      }

      setMessages(prev => [...prev, assistantMessage])
      
      if (agent) {
        agent.setState("complete")
        setTimeout(() => agent.setState("idle"), 2000)
      }
    } catch (error) {
      console.error('Error getting agent response:', error)
      
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please check that Azure OpenAI is configured and try again.",
        agent: selectedAgent,
      }
      setMessages(prev => [...prev, errorMessage])
      
      if (agent) {
        agent.setState("idle")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/5 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/workbench" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Workbench
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            DeepParallel Agent System
          </h1>
          <p className="text-sm text-muted-foreground">
            Multi-agent AI system with quantum field visualization
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Agents Sidebar */}
        <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 space-y-4">
            {agents.map((agent) => (
              <button
                key={agent.name}
                onClick={() => setSelectedAgent(agent.name)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAgent === agent.name
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <DeepParallelAvatar
                    agentName={agent.name}
                    avatarImage={agent.avatar}
                    state={agent.state}
                    size={48}
                    primaryColor={agent.primaryColor}
                    secondaryColor={agent.secondaryColor}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">
                      {agent.subtitle}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {agent.name}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {agent.description}
                </p>
                
                {/* State Indicators */}
                <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Field:</span>
                    <span className="font-mono" style={{ color: agent.primaryColor }}>
                      {agent.state === "reasoning" ? "MAX" : agent.state === "thinking" ? "HIGH" : "STABLE"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Intensity:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: i < (agent.state === "reasoning" ? 5 : agent.state === "thinking" ? 3 : 1)
                              ? agent.primaryColor
                              : "rgba(255,255,255,0.1)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {/* Collective Reasoning */}
            <div className="pt-4 border-t border-border">
              <Button
                onClick={() => {
                  simulateReasoning(setStrategistState)
                  setTimeout(() => simulateReasoning(setPhilosopherState), 500)
                  setTimeout(() => simulateReasoning(setVisionaryState), 1000)
                }}
                size="sm"
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Activate All Agents
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <DeepParallelAvatar
                    agentName={selectedAgent}
                    avatarImage="/crowe-logic-logo.png"
                    state="idle"
                    size={120}
                    primaryColor={agents.find(a => a.name === selectedAgent)?.primaryColor}
                    secondaryColor={agents.find(a => a.name === selectedAgent)?.secondaryColor}
                  />
                  <h2 className="text-xl font-semibold text-foreground mt-6 mb-2">
                    {agents.find(a => a.name === selectedAgent)?.subtitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {agents.find(a => a.name === selectedAgent)?.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <DeepParallelAvatar
                        agentName={message.agent || selectedAgent}
                        avatarImage="/crowe-logic-logo.png"
                        state="idle"
                        size={40}
                        primaryColor={agents.find(a => a.name === (message.agent || selectedAgent))?.primaryColor}
                        secondaryColor={agents.find(a => a.name === (message.agent || selectedAgent))?.secondaryColor}
                      />
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-accent text-accent-foreground"
                          : "bg-card border border-border"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <DeepParallelAvatar
                      agentName={selectedAgent}
                      avatarImage="/crowe-logic-logo.png"
                      state="reasoning"
                      size={40}
                      primaryColor={agents.find(a => a.name === selectedAgent)?.primaryColor}
                      secondaryColor={agents.find(a => a.name === selectedAgent)?.secondaryColor}
                    />
                    <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-card border border-border">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${agents.find(a => a.name === selectedAgent)?.subtitle}...`}
                  className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[60px] max-h-[200px]"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="self-end"
                  style={{
                    background: agents.find(a => a.name === selectedAgent)
                      ? `linear-gradient(90deg, ${agents.find(a => a.name === selectedAgent)?.primaryColor}, ${agents.find(a => a.name === selectedAgent)?.secondaryColor})`
                      : undefined,
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
