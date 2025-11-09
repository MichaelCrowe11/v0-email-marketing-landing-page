import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowRight,
  Code,
  Zap,
  Terminal,
  Database,
  Microscope,
  FileCode,
  Rocket,
  Play,
  Book,
  Sparkles
} from "lucide-react"

export default function DocsPage() {
  return (
    <div className="max-w-4xl">
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-5xl font-semibold text-foreground mb-6 tracking-tight">
          Crowe Logic Documentation
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Build biological AI applications with production-validated models, datasets,
          and tools from 18 years of commercial cultivation operations.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4 mb-16">
        <Link
          href="/docs/getting-started"
          className="lab-card p-6 group hover:border-foreground transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <Rocket className="w-6 h-6 text-foreground" />
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Quick Start</h3>
          <p className="text-sm text-muted-foreground">
            Get up and running in 5 minutes with your first AI model deployment
          </p>
        </Link>

        <Link
          href="/playground"
          className="lab-card p-6 group hover:border-foreground transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <Play className="w-6 h-6 text-foreground" />
            <Badge className="sci-badge text-[10px]">NEW</Badge>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Try Playground</h3>
          <p className="text-sm text-muted-foreground">
            Test AI models interactively with real-time responses
          </p>
        </Link>
      </div>

      {/* Core Platform */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Core Platform</h2>
        <div className="space-y-6">
          <Link
            href="/docs/ai-models"
            className="block lab-card p-6 hover:border-foreground transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-foreground/5 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-foreground">AI Models</h3>
                  <Badge className="sci-badge text-[9px]">150+ MODELS</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Deploy specialist agents for substrate analysis, SOP generation, yield forecasting,
                  and contamination detection
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="metric-display">94.2% avg accuracy</span>
                  <span>•</span>
                  <span>Real-time inference</span>
                  <span>•</span>
                  <span>Production validated</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
            </div>
          </Link>

          <Link
            href="/workspaces"
            className="block lab-card p-6 hover:border-foreground transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-foreground/5 flex items-center justify-center flex-shrink-0">
                <Terminal className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-foreground">Workspaces</h3>
                  <Badge className="sci-badge text-[9px]">SOLO • TEAM • BUSINESS</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Collaborative research environments for individual researchers, teams, and enterprises
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Up to 1TB storage</span>
                  <span>•</span>
                  <span>Unlimited AI models</span>
                  <span>•</span>
                  <span>Shared datasets</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
            </div>
          </Link>

          <Link
            href="/docs/datasets"
            className="block lab-card p-6 hover:border-foreground transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-foreground/5 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-foreground">Datasets</h3>
                  <Badge className="sci-badge text-[9px]">847 DATASETS</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Research-grade cultivation data from commercial operations spanning 18 years
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="metric-display">2.4M records</span>
                  <span>•</span>
                  <span>Environmental sensors</span>
                  <span>•</span>
                  <span>Harvest metrics</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
            </div>
          </Link>
        </div>
      </div>

      {/* Developer Tools */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Developer Tools</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/docs/synapse-lang"
            className="lab-card p-5 hover:border-foreground transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <Code className="w-5 h-5 text-foreground" />
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5">Synapse Lang</h3>
            <p className="text-xs text-muted-foreground">
              Scientific programming language with native uncertainty quantification
            </p>
          </Link>

          <Link
            href="/docs/crowe-code"
            className="lab-card p-5 hover:border-foreground transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <FileCode className="w-5 h-5 text-foreground" />
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5">Crowe Code</h3>
            <p className="text-xs text-muted-foreground">
              AI-powered code assistant for biological data analysis
            </p>
          </Link>

          <Link
            href="/docs/research-ide"
            className="lab-card p-5 hover:border-foreground transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <Terminal className="w-5 h-5 text-foreground" />
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5">Research IDE</h3>
            <p className="text-xs text-muted-foreground">
              Integrated development environment for data-driven research
            </p>
          </Link>

          <Link
            href="/docs/api"
            className="lab-card p-5 hover:border-foreground transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <Code className="w-5 h-5 text-foreground" />
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5">API Reference</h3>
            <p className="text-xs text-muted-foreground">
              Complete REST API documentation with code examples
            </p>
          </Link>
        </div>
      </div>

      {/* Getting Help */}
      <div className="lab-card p-8 bg-muted/30">
        <div className="flex items-start gap-4">
          <Book className="w-6 h-6 text-foreground flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our community forum, explore tutorials, or contact our team for dedicated support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/forum"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                Community Forum
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                View Tutorials
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
