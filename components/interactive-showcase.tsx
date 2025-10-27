"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Microscope, Brain, Zap, Database, Eye, Sparkles } from "lucide-react"

interface Feature {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  color: string
  gradient: string
}

export function InteractiveShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  const features: Feature[] = [
    {
      id: "vision",
      icon: <Eye className="w-8 h-8" />,
      title: "Crowe Vision",
      description: "AI-powered contamination detection with 99.2% accuracy",
      color: "text-cyan-500",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: "brain",
      icon: <Brain className="w-8 h-8" />,
      title: "Neural Analysis",
      description: "Deep learning models trained on 20 years of cultivation data",
      color: "text-purple-500",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "microscope",
      icon: <Microscope className="w-8 h-8" />,
      title: "Species Classification",
      description: "Instant identification of 500+ mushroom species",
      color: "text-green-500",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "database",
      icon: <Database className="w-8 h-8" />,
      title: "Knowledge Base",
      description: "Comprehensive library of SOPs, guides, and research",
      color: "text-amber-500",
      gradient: "from-amber-500 to-orange-500",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveFeature((current) => (current + 1) % features.length)
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-background to-accent/5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Next-Generation AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Cultivation Intelligence</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Advanced AI systems working together to optimize every aspect of mushroom cultivation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? "border-accent bg-accent/5 shadow-2xl shadow-accent/20"
                    : "border-border/50 bg-background/50 hover:border-accent/50"
                }`}
                onClick={() => {
                  setActiveFeature(index)
                  setProgress(0)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-foreground/70">{feature.description}</p>
                  </div>
                  {activeFeature === index && <Zap className="w-5 h-5 text-accent animate-pulse" />}
                </div>
                {activeFeature === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/20 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${feature.gradient}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right: Visual Display */}
          <div className="relative h-[600px] rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-background to-accent/5 overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="text-center space-y-6">
                  <div
                    className={`inline-flex p-8 rounded-3xl bg-gradient-to-br ${features[activeFeature].gradient} text-white shadow-2xl`}
                  >
                    <div className="scale-[2]">{features[activeFeature].icon}</div>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">{features[activeFeature].title}</h3>
                  <p className="text-lg text-foreground/70 max-w-md mx-auto">{features[activeFeature].description}</p>
                  <div className="grid grid-cols-3 gap-4 pt-8">
                    {[
                      { label: "Accuracy", value: "99.2%" },
                      { label: "Speed", value: "<2s" },
                      { label: "Models", value: "11" },
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="text-2xl font-bold text-accent mb-1">{stat.value}</div>
                        <div className="text-sm text-foreground/60">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Animated background particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${features[activeFeature].gradient} opacity-20`}
                  animate={{
                    x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
                    y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
