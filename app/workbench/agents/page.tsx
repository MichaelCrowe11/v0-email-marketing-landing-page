"use client"

import { useState } from "react"
import { DeepParallelAvatar } from "@/components/workbench/deep-parallel-avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AgentsPage() {
  const [strategistState, setStrategistState] = useState<"idle" | "thinking" | "reasoning" | "complete">("idle")
  const [philosopherState, setPhilosopherState] = useState<"idle" | "thinking" | "reasoning" | "complete">("idle")
  const [visionaryState, setVisionaryState] = useState<"idle" | "thinking" | "reasoning" | "complete">("idle")

  const agents = [
    {
      name: "DeepParallel Genesis",
      subtitle: "Compound Ideation Engine",
      description: "Generate novel molecular candidates through parallel exploration of chemical spaces",
      avatar: "/crowe-logic-logo.png",
      primaryColor: "#22D3EE", // cyan
      secondaryColor: "#A855F7", // purple
      state: strategistState,
      setState: setStrategistState,
    },
    {
      name: "DeepParallel",
      subtitle: "Core Orchestration System",
      description: "Central coordination of 150+ specialized agents across parallel workflows",
      avatar: "/crowe-logic-logo.png",
      primaryColor: "#A855F7", // purple
      secondaryColor: "#EC4899", // pink
      state: philosopherState,
      setState: setPhilosopherState,
    },
    {
      name: "DeepParallel Quantum States",
      subtitle: "Quantum Chemistry Engine",
      description: "High-accuracy electronic structure calculations and molecular state predictions",
      avatar: "/crowe-logic-logo.png",
      primaryColor: "#8B5CF6", // purple
      secondaryColor: "#06B6D4", // cyan
      state: visionaryState,
      setState: setVisionaryState,
    },
    {
      name: "DeepParallel Synthesis",
      subtitle: "Retrosynthetic Planning Engine",
      description: "AI-driven synthesis route design and optimization for scalable production",
      avatar: "/crowe-logic-logo.png",
      primaryColor: "#F59E0B", // gold
      secondaryColor: "#8B5CF6", // purple
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/5 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/workbench" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Workbench
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            DeepParallel Agent System
          </h1>
          <p className="text-lg text-muted-foreground">
            Multi-agent AI system with quantum field visualization and intense reasoning states
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {agents.map((agent, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="glass-card rounded-2xl p-8 border border-border hover:border-accent/50 transition-all w-full">
                <div className="flex flex-col items-center mb-6">
                  <div className="mb-12">
                    <DeepParallelAvatar
                      agentName={agent.name}
                      avatarImage={agent.avatar}
                      state={agent.state}
                      size={140}
                      primaryColor={agent.primaryColor}
                      secondaryColor={agent.secondaryColor}
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {agent.subtitle}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {agent.description}
                  </p>

                  <Button
                    onClick={() => simulateReasoning(agent.setState)}
                    disabled={agent.state !== "idle"}
                    className="w-full"
                    style={{
                      background: agent.state === "idle" 
                        ? `linear-gradient(90deg, ${agent.primaryColor}, ${agent.secondaryColor})`
                        : undefined,
                    }}
                  >
                    {agent.state === "idle" && "Start Reasoning"}
                    {agent.state === "thinking" && "Thinking..."}
                    {agent.state === "reasoning" && "Deep Reasoning..."}
                    {agent.state === "complete" && "Complete ✓"}
                  </Button>
                </div>

                {/* State Indicators */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Quantum Field:</span>
                    <span className="font-mono" style={{ color: agent.primaryColor }}>
                      {agent.state === "reasoning" ? "MAXIMUM" : agent.state === "thinking" ? "HIGH" : "STABLE"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Particles:</span>
                    <span className="font-mono" style={{ color: agent.secondaryColor }}>
                      {agent.state === "reasoning" ? "80" : agent.state === "thinking" ? "40" : "20"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Intensity:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
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
              </div>
            </div>
          ))}
        </div>

        {/* Collective Reasoning Demo */}
        <div className="glass-card rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Collective Reasoning
          </h2>
          <p className="text-muted-foreground mb-6">
            Watch all agents work together on a complex problem with synchronized quantum fields
          </p>
          <Button
            onClick={() => {
              simulateReasoning(setStrategistState)
              setTimeout(() => simulateReasoning(setPhilosopherState), 500)
              setTimeout(() => simulateReasoning(setVisionaryState), 1000)
            }}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500"
          >
            Activate All Agents
          </Button>
        </div>
      </div>
    </div>
  )
}
