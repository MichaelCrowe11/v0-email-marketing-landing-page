import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Book, Code, Layers, Zap, Shield, GitBranch, FileCode, MessageSquare } from "lucide-react"

export default function DocsPage() {
  const sections = [
    {
      title: "Architecture Overview",
      description: "5-layer reasoning engine with SOP-Agent, Sensor-Agent, Business-Agent, and Delta-Agent",
      icon: Layers,
      href: "/docs/overview",
      color: "text-blue-400",
    },
    {
      title: "CroweLayer™ Taxonomy",
      description: "Tag system for PHASE, SPECIES, EQUIPMENT, PROBLEM, URGENCY, SIGNAL, DOMAIN, and MODE",
      icon: Code,
      href: "/docs/taxonomy",
      color: "text-green-400",
    },
    {
      title: "Output Schemas",
      description: "VRS (Visible Reasoning Summary), Evidence Ledger, and SOP Markdown formats",
      icon: FileCode,
      href: "/docs/schemas",
      color: "text-purple-400",
    },
    {
      title: "Agents Guide",
      description: "Specialized agents for SOPs, sensors, business optimization, and protocol improvements",
      icon: Zap,
      href: "/docs/agents",
      color: "text-yellow-400",
    },
    {
      title: "Quality Controls",
      description: "Confidence scoring, staleness detection, reasoning privacy, and feedback loops",
      icon: Shield,
      href: "/docs/quality",
      color: "text-red-400",
    },
    {
      title: "Decision Trees",
      description: "Visual flowcharts for contamination triage, morphology issues, and troubleshooting",
      icon: GitBranch,
      href: "/docs/decision-trees",
      color: "text-cyan-400",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Documentation</h1>
          <p className="text-zinc-400 text-lg">Complete guide to Crowe Logic v5.0 mycology reasoning engine</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all duration-200 h-full group">
                  <CardHeader>
                    <Icon className={`w-8 h-8 mb-4 ${section.color} group-hover:scale-110 transition-transform`} />
                    <CardTitle className="text-xl text-white group-hover:text-zinc-100">{section.title}</CardTitle>
                    <CardDescription className="text-zinc-400">{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/documents">
            <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all duration-200 group">
              <CardHeader>
                <Book className="w-8 h-8 mb-4 text-zinc-400 group-hover:text-white transition-colors" />
                <CardTitle className="text-xl text-white group-hover:text-zinc-100">Community Documents</CardTitle>
                <CardDescription className="text-zinc-400">
                  Browse user-contributed guides, tutorials, and cultivation documentation
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/forum">
            <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all duration-200 group">
              <CardHeader>
                <MessageSquare className="w-8 h-8 mb-4 text-zinc-400 group-hover:text-white transition-colors" />
                <CardTitle className="text-xl text-white group-hover:text-zinc-100">Community Forum</CardTitle>
                <CardDescription className="text-zinc-400">
                  Join discussions, ask questions, and share tips with fellow cultivators
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
