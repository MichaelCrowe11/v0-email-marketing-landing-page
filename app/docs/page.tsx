import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Book,
  Code,
  Layers,
  Zap,
  Shield,
  GitBranch,
  FileCode,
  MessageSquare,
  Rocket,
  BookOpen,
  Terminal,
  Database,
  Package,
  Sparkles,
  GraduationCap,
  Video,
} from "lucide-react"

export default function DocsPage() {
  const quickStart = [
    {
      title: "Getting Started",
      description: "Installation, setup, and your first deployment in 5 minutes",
      icon: Rocket,
      href: "/docs/getting-started",
      color: "text-secondary",
    },
    {
      title: "Platform Overview",
      description: "Understand the Crowe Logic ecosystem and architecture",
      icon: Layers,
      href: "/docs/overview",
      color: "text-primary",
    },
    {
      title: "Quick Start Tutorials",
      description: "Step-by-step guides for common use cases",
      icon: GraduationCap,
      href: "/docs/tutorials",
      color: "text-secondary",
    },
  ]

  const coreFeatures = [
    {
      title: "AI Models",
      description: "Deploy and manage specialist AI agents for biological systems",
      icon: Sparkles,
      href: "/docs/ai-models",
      badge: "150+ Models",
    },
    {
      title: "Synapse-lang",
      description: "Scientific programming language for hypothesis-driven research",
      icon: Code,
      href: "/docs/synapse-lang",
      badge: "New",
    },
    {
      title: "Research IDE",
      description: "Integrated development environment for biological AI applications",
      icon: Terminal,
      href: "/docs/research-ide",
      badge: "Beta",
    },
    {
      title: "Crowe Code",
      description: "AI-powered code assistant for scientific programming",
      icon: FileCode,
      href: "/docs/crowe-code",
      badge: "Featured",
    },
    {
      title: "Datasets",
      description: "Access research-grade datasets from 18 years of operations",
      icon: Database,
      href: "/docs/datasets",
      badge: "847 Sets",
    },
    {
      title: "Crowe-Sense Hardware",
      description: "IoT sensors and monitoring systems for cultivation environments",
      icon: Package,
      href: "/docs/crowe-sense",
      badge: "Hardware",
    },
  ]

  const advanced = [
    {
      title: "Agents Guide",
      description: "Specialized agents for SOPs, sensors, business optimization, and protocols",
      icon: Zap,
      href: "/docs/agents",
      color: "text-secondary",
    },
    {
      title: "Output Schemas",
      description: "VRS, Evidence Ledger, and SOP Markdown formats",
      icon: FileCode,
      href: "/docs/schemas",
      color: "text-primary",
    },
    {
      title: "Quality Controls",
      description: "Confidence scoring, staleness detection, and feedback loops",
      icon: Shield,
      href: "/docs/quality",
      color: "text-secondary",
    },
    {
      title: "Decision Trees",
      description: "Visual flowcharts for contamination triage and troubleshooting",
      icon: GitBranch,
      href: "/docs/decision-trees",
      color: "text-primary",
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Documentation</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Complete guide to the Crowe Logic platform. From getting started to advanced integrations and API
            references.
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickStart.map((section) => {
              const Icon = section.icon
              return (
                <Link key={section.href} href={section.href}>
                  <div className="enterprise-card p-6 hover:border-primary/50 transition-all group h-full">
                    <Icon className={`w-8 h-8 mb-4 ${section.color} group-hover:scale-110 transition-transform`} />
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((section) => {
              const Icon = section.icon
              return (
                <Link key={section.href} href={section.href}>
                  <div className="enterprise-card p-6 hover:border-primary/50 transition-all group h-full">
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                      {section.badge && (
                        <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                          {section.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Advanced Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Advanced Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advanced.map((section) => {
              const Icon = section.icon
              return (
                <Link key={section.href} href={section.href}>
                  <div className="enterprise-card p-6 hover:border-primary/50 transition-all group h-full">
                    <Icon className={`w-8 h-8 mb-4 ${section.color} group-hover:scale-110 transition-transform`} />
                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Community Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Community & Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/docs/tutorials">
              <div className="enterprise-card p-6 hover:border-primary/50 transition-all group">
                <Video className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Video Tutorials
                </h3>
                <p className="text-sm text-muted-foreground">
                  Step-by-step video guides for common workflows and integrations
                </p>
              </div>
            </Link>

            <Link href="/forum">
              <div className="enterprise-card p-6 hover:border-primary/50 transition-all group">
                <MessageSquare className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Community Forum
                </h3>
                <p className="text-sm text-muted-foreground">
                  Join discussions, ask questions, and share tips with researchers
                </p>
              </div>
            </Link>

            <Link href="/documents">
              <div className="enterprise-card p-6 hover:border-primary/50 transition-all group">
                <Book className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Community Docs
                </h3>
                <p className="text-sm text-muted-foreground">
                  User-contributed guides, tutorials, and cultivation documentation
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* API Reference CTA */}
        <div className="enterprise-card p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code className="w-8 h-8 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">API Reference</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Complete API documentation with code examples in Python, JavaScript, and Synapse-lang
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/docs/api">
              <button className="btn-primary h-12 px-8">Browse API Docs</button>
            </Link>
            <Link href="/docs/sdk">
              <button className="h-12 px-8 border border-border hover:bg-accent transition-all rounded-lg text-foreground font-medium">
                Download SDK
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
