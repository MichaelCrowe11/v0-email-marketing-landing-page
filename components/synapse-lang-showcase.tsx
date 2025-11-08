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
            <span className="text-sm font-mono font-semibold text-primary">Synapse-lang</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground">Code That Thinks Like a Scientist</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Express uncertainty. Run parallel experiments. Deploy directly.
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
                {`# Hypothesis graph
hypothesis substrate_optimization {
  inputs: [sawdust, coffee_grounds, gypsum]
  outputs: biological_efficiency
  uncertainty: high
  
  // Parallel experiment branches
  experiment_1: ratio(70:30:2)
  experiment_2: ratio(60:40:2)
  
  // AI agent evaluation
  agent CriOS_Substrate_Analyst {
    evaluate: contamination_risk
    optimize_for: yield_per_kg
  }
}`}
              </code>
            </pre>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <GitBranch className="w-8 h-8 text-primary" />
              <h3 className="font-bold">Express Scientific Reasoning</h3>
              <p className="text-sm text-muted-foreground">
                Write hypothesis-driven code with built-in uncertainty quantification
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <Zap className="w-8 h-8 text-primary" />
              <h3 className="font-bold">Parallel Experimentation</h3>
              <p className="text-sm text-muted-foreground">Run multiple experiment branches simultaneously</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <Cpu className="w-8 h-8 text-primary" />
              <h3 className="font-bold">AI Agent Orchestration</h3>
              <p className="text-sm text-muted-foreground">
                Integrate specialized AI agents directly in your scientific workflows
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Installation and CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Card className="border-border/50 bg-muted">
            <CardContent className="p-4 flex items-center gap-3">
              <Terminal className="w-5 h-5 text-primary" />
              <code className="font-mono text-sm">pip install synapse-lang</code>
            </CardContent>
          </Card>
          <Button size="lg" asChild>
            <Link href="/synapse-lang">View Documentation</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
