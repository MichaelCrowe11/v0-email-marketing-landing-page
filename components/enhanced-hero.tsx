"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"

interface QuantumParticle {
  id: number
  x: number
  y: number
  angle: number
  radius: number
  color: string
  speed: number
  opacity: number
  scale: number
}

interface MyceliumNetwork {
  id: number
  nodes: { x: number; y: number }[]
  connections: { from: number; to: number }[]
  growth: number
}

interface DNAHelix {
  rotation: number
  amplitude: number
  frequency: number
}

export function EnhancedHero() {
  const [particles, setParticles] = useState<QuantumParticle[]>([])
  const [myceliumNetworks, setMyceliumNetworks] = useState<MyceliumNetwork[]>([])
  const [dnaHelix, setDNAHelix] = useState<DNAHelix>({ rotation: 0, amplitude: 20, frequency: 0.02 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // Enhanced mushroom-themed code snippets
  const mushroomCodeSnippets = useMemo(
    () => [
      "spore.germinate()",
      "mycelium.network()",
      "substrate.analyze()",
      "fruiting.initiate()",
      "compound.extract()",
      "genome.sequence()",
      "bioactive.identify()",
      "cultivation.optimize()",
      "yields.predict()",
      "contamination.detect()",
      "strain.isolate()",
      "metabolite.profile()",
    ],
    [],
  )

  // Quantum color palette
  const quantumColors = useMemo(
    () => [
      "#22D3EE", // Cyan
      "#A855F7", // Purple
      "#EC4899", // Pink
      "#10B981", // Green
      "#F59E0B", // Gold
      "#8B5CF6", // Violet
      "#06B6D4", // Teal
    ],
    [],
  )

  // Initialize quantum particles
  useEffect(() => {
    const newParticles: QuantumParticle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 1200,
      y: Math.random() * 800,
      angle: Math.random() * Math.PI * 2,
      radius: 50 + Math.random() * 200,
      color: quantumColors[Math.floor(Math.random() * quantumColors.length)],
      speed: 0.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      scale: 0.5 + Math.random() * 1.5,
    }))
    setParticles(newParticles)

    // Initialize mycelium networks
    const newNetworks: MyceliumNetwork[] = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      nodes: Array.from({ length: 8 }, () => ({
        x: Math.random() * 1200,
        y: Math.random() * 800,
      })),
      connections: [],
      growth: 0,
    }))
    setMyceliumNetworks(newNetworks)
  }, [quantumColors])

  // Mouse tracking for particle interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Enhanced particle animation
  const updateParticles = useCallback(() => {
    setParticles((prev) =>
      prev.map((p) => {
        // Mouse attraction
        const dx = mousePos.x - p.x
        const dy = mousePos.y - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const attraction = Math.min(100 / (distance + 1), 2)

        return {
          ...p,
          x: p.x + Math.cos(p.angle) * p.speed + (dx / distance) * attraction * 0.1,
          y: p.y + Math.sin(p.angle) * p.speed + (dy / distance) * attraction * 0.1,
          angle: p.angle + p.speed * 0.01 + Math.sin(Date.now() * 0.001 + p.id) * 0.02,
          opacity: 0.3 + Math.sin(Date.now() * 0.002 + p.id) * 0.3,
          scale: 0.8 + Math.sin(Date.now() * 0.003 + p.id) * 0.4,
        }
      })
    )

    // Update DNA helix
    setDNAHelix((prev) => ({
      ...prev,
      rotation: prev.rotation + 1,
    }))

    // Update mycelium growth
    setMyceliumNetworks((prev) =>
      prev.map((network) => ({
        ...network,
        growth: Math.min(network.growth + 0.02, 1),
      }))
    )
  }, [mousePos])

  useEffect(() => {
    const interval = setInterval(updateParticles, 50)
    return () => clearInterval(interval)
  }, [updateParticles])

  // Start hero animation sequence
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: "easeOut" },
    })
  }, [controls])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Quantum Field Visualization */}
        <svg className="absolute inset-0 w-full h-full" style={{ filter: "blur(1px)" }}>
          {/* Quantum Particles */}
          {particles.map((particle) => (
            <g key={particle.id}>
              <circle
                cx={particle.x}
                cy={particle.y}
                r={4 * particle.scale}
                fill={particle.color}
                opacity={particle.opacity}
                className="animate-pulse"
              />
              <circle
                cx={particle.x}
                cy={particle.y}
                r={2 * particle.scale}
                fill="white"
                opacity={particle.opacity * 0.8}
              />
            </g>
          ))}

          {/* Mycelium Networks */}
          {myceliumNetworks.map((network) => (
            <g key={network.id}>
              {network.nodes.map((node, i) => (
                <circle
                  key={i}
                  cx={node.x}
                  cy={node.y}
                  r={3}
                  fill="#10B981"
                  opacity={0.6 * network.growth}
                />
              ))}
              {network.nodes.map((from, i) =>
                network.nodes.slice(i + 1).map((to, j) => (
                  <line
                    key={`${i}-${j}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#10B981"
                    strokeWidth={1}
                    opacity={0.3 * network.growth}
                    strokeDasharray="2,4"
                    className="animate-pulse"
                  />
                ))
              )}
            </g>
          ))}

          {/* DNA Helix */}
          <g transform={`translate(600, 400) rotate(${dnaHelix.rotation})`}>
            {Array.from({ length: 20 }, (_, i) => (
              <g key={i}>
                <circle
                  cx={Math.cos(i * 0.5) * dnaHelix.amplitude}
                  cy={i * 15 - 150}
                  r={2}
                  fill="#22D3EE"
                  opacity={0.7}
                />
                <circle
                  cx={Math.cos(i * 0.5 + Math.PI) * dnaHelix.amplitude}
                  cy={i * 15 - 150}
                  r={2}
                  fill="#A855F7"
                  opacity={0.7}
                />
                <line
                  x1={Math.cos(i * 0.5) * dnaHelix.amplitude}
                  y1={i * 15 - 150}
                  x2={Math.cos(i * 0.5 + Math.PI) * dnaHelix.amplitude}
                  y2={i * 15 - 150}
                  stroke="#EC4899"
                  strokeWidth={1}
                  opacity={0.5}
                />
              </g>
            ))}
          </g>
        </svg>

        {/* Floating Code Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {mushroomCodeSnippets.map((snippet, i) => (
            <motion.div
              key={i}
              className="absolute text-xs font-mono opacity-20 text-cyan-400"
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
                opacity: 0
              }}
              animate={{
                x: [
                  Math.random() * 1200,
                  Math.random() * 1200,
                  Math.random() * 1200,
                ],
                y: [
                  Math.random() * 800,
                  Math.random() * 800,
                  Math.random() * 800,
                ],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 2,
              }}
            >
              {snippet}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="relative z-10 text-center max-w-6xl mx-auto px-4"
      >
        {/* Enhanced Avatar with Quantum Effects */}
        <motion.div
          className="relative mx-auto mb-8"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative w-32 h-32 mx-auto">
            {/* Quantum Field Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-spin"
                 style={{ animationDuration: "3s" }} />
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 animate-spin"
                 style={{ animationDuration: "2s", animationDirection: "reverse" }} />

            {/* Avatar */}
            <div className="absolute inset-4 rounded-full overflow-hidden">
              <Image
                src="/crowe-avatar.png"
                alt="Crowe Logic AI"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Orbital Particles */}
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  transformOrigin: `${40 + i * 5}px 0px`,
                  marginLeft: "-4px",
                  marginTop: "-4px",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CROWE LOGIC
          </span>
          <br />
          <span className="text-white text-4xl md:text-5xl lg:text-6xl">
            Mycological Intelligence
          </span>
        </motion.h1>

        {/* Enhanced Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          Transform your <span className="text-green-400 font-semibold">30GB mushroom datasets</span> into
          breakthrough discoveries with AI-powered analysis, species identification, and
          <span className="text-purple-400 font-semibold"> quantum-enhanced cultivation</span> optimization.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          {[
            "Species ID: 99.2% Accuracy",
            "Genome Sequencing",
            "Contamination Detection",
            "Yield Optimization",
            "Bioactive Compounds",
          ].map((feature, i) => (
            <div
              key={i}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20"
            >
              {feature}
            </div>
          ))}
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          <Link href="/workbench/agents">
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-2xl shadow-purple-500/25 border-0"
            >
              Launch DeepParallel Workbench
            </Button>
          </Link>
          <Link href="/chat">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 shadow-xl"
            >
              Chat with CROWE LOGIC
            </Button>
          </Link>
        </motion.div>

        {/* Dataset Upload Teaser */}
        <motion.div
          className="mt-16 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-3">Ready to Upload Your Mushroom Datasets?</h3>
          <p className="text-gray-300 mb-4">
            Our AI agents can process CSV, JSON, FASTA, and genomic data formats up to 30GB
          </p>
          <div className="flex gap-2 justify-center text-sm text-gray-400">
            <span className="px-3 py-1 bg-green-500/20 rounded-full">Genome Sequences</span>
            <span className="px-3 py-1 bg-blue-500/20 rounded-full">Species Data</span>
            <span className="px-3 py-1 bg-purple-500/20 rounded-full">Chemical Profiles</span>
            <span className="px-3 py-1 bg-yellow-500/20 rounded-full">Cultivation Records</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}