"use client"

import { useEffect, useState } from "react"

interface CodeParticle {
  id: number
  code: string
  x: number
  y: number
  color: string
  speed: number
  angle: number
  radius: number
}

export function FloatingCodeSwirl() {
  const [particles, setParticles] = useState<CodeParticle[]>([])

  const codeSnippets = [
    "const ai = new MycologyAI()",
    "species.classify()",
    "genome.sequence()",
    "neural.predict()",
    "quantum.entangle()",
    "genetic.optimize()",
    "dna.analyze()",
    "model.train()",
    "vector.embed()",
    "transformer.attend()",
    "blockchain.verify()",
    "edge.deploy()",
    "federated.aggregate()",
    "crispr.edit()",
    "pipeline.process()",
    "spore.recognize()",
    "habitat.predict()",
    "morphology.extract()",
    "reinforcement.learn()",
    "attention.focus()",
  ]

  const colors = [
    "text-cyan-400",
    "text-purple-400",
    "text-pink-400",
    "text-green-400",
    "text-blue-400",
    "text-yellow-400",
    "text-orange-400",
    "text-red-400",
  ]

  useEffect(() => {
    const newParticles: CodeParticle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: 0,
      y: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 1,
      angle: (i / 30) * Math.PI * 2,
      radius: 150 + Math.random() * 100,
    }))
    setParticles(newParticles)

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.01
      setParticles((prev) =>
        prev.map((p) => {
          const newAngle = p.angle + p.speed * 0.01
          const wobble = Math.sin(time * 2 + p.id) * 20
          return {
            ...p,
            angle: newAngle,
            x: Math.cos(newAngle) * (p.radius + wobble),
            y: Math.sin(newAngle) * (p.radius + wobble),
          }
        }),
      )
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Center glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating code particles */}
      <div className="relative w-full h-full flex items-center justify-center">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute font-mono text-sm font-bold ${particle.color} whitespace-nowrap transition-all duration-100`}
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              textShadow: "0 0 10px currentColor",
            }}
          >
            {particle.code}
          </div>
        ))}
      </div>

      {/* Center text */}
      <div className="relative z-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-bold text-foreground">AI PROCESSING LIVE</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">Crowe Logic AI</h2>
        <p className="text-xl text-foreground/80">Advanced Mycology Intelligence</p>
      </div>
    </div>
  )
}
