"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Terminal, Code, Zap, GitBranch, Cpu } from "lucide-react"
import Link from "next/link"

export function SynapseLangShowcase() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono font-semibold text-primary">Synapse-lang v2.3.2</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground">Code That Thinks Like a Scientist</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The world's first scientific programming language with native uncertainty, quantum computing, and AI
            assistance.
          </p>
        </div>

        {/* Code Example */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="font-mono text-sm">substrate_optimization.syn</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm overflow-x-auto p-4 bg-muted rounded-lg">
              <code className="text-foreground font-mono">
                {`# Uncertainty quantification
uncertain temperature = 300 ± 10
uncertain pressure = 1.5 ± 0.1

# Hypothesis-driven programming
hypothesis substrate_optimization {
  inputs: [sawdust, coffee_grounds, gypsum]
  outputs: biological_efficiency
  uncertainty: high
  
  # Parallel experiment branches
  experiment_1: ratio(70:30:2)
  experiment_2: ratio(60:40:2)
  
  # AI agent evaluation
  agent CriOS_Substrate_Analyst {
    evaluate: contamination_risk
    optimize_for: yield_per_kg
  }
}

# Quantum computing support
quantum[2] {
  H(q0)          # Superposition
  CNOT(q0, q1)   # Entanglement
  measure(q0, q1)
}`}
              </code>
            </pre>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <GitBranch className="w-8 h-8 text-primary" />
              <h3 className="font-bold text-sm">Uncertainty Quantification</h3>
              <p className="text-xs text-muted-foreground">Built-in uncertain types with automatic error propagation</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <Zap className="w-8 h-8 text-primary" />
              <h3 className="font-bold text-sm">Quantum Computing</h3>
              <p className="text-xs text-muted-foreground">Visual circuit designer and hybrid algorithms</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <Cpu className="w-8 h-8 text-primary" />
              <h3 className="font-bold text-sm">Parallel Execution</h3>
              <p className="text-xs text-muted-foreground">Distributed computing with automatic load balancing</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <Code className="w-8 h-8 text-primary" />
              <h3 className="font-bold text-sm">Hypothesis-Driven</h3>
              <p className="text-xs text-muted-foreground">Express scientific reasoning directly in code</p>
            </CardContent>
          </Card>
        </div>

        {/* Installation Options */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center text-foreground">Quick Start</h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card className="border-border/50 bg-muted">
              <CardContent className="p-4 flex items-center gap-3">
                <Terminal className="w-5 h-5 text-primary" />
                <code className="font-mono text-sm">pip install synapse_lang</code>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-muted">
              <CardContent className="p-4 flex items-center gap-3">
                <Terminal className="w-5 h-5 text-primary" />
                <code className="font-mono text-sm">npm install synapse-lang-core</code>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-muted">
              <CardContent className="p-4 flex items-center gap-3">
                <Terminal className="w-5 h-5 text-primary" />
                <code className="font-mono text-sm">docker pull michaelcrowe11/synapse-lang</code>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href="https://synapse-lang-docs.fly.dev" target="_blank">
              View Documentation
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://synapse-lang-docs.fly.dev/playground" target="_blank">
              Try Playground
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/crowe-code">Use in Crowe Code</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://github.com/MichaelCrowe11/synapse-lang" target="_blank">
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
