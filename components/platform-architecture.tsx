"use client"

import Link from "next/link"
import { ArrowRight, Bot, Database, Layers, Shield, Workflow } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const architectureLayers = [
  {
    title: "Data & Knowledge Fabric",
    description:
      "Structured cultivation data, telemetry, SOP libraries, and researcher notes unified through evidence tagging.",
    icon: Database,
    badge: "Layer 1",
  },
  {
    title: "Crowe Agent Mesh",
    description:
      "Domain-tuned agents orchestrate substrate design, contamination triage, and business operations collaboratively.",
    icon: Bot,
    badge: "Layer 2",
  },
  {
    title: "Quality & Governance",
    description:
      "Confidence scoring, lineage tracking, and safety rails ensure recommendations remain production ready.",
    icon: Shield,
    badge: "Layer 3",
  },
  {
    title: "Experience Layer",
    description:
      "Research workspaces, the AI playground, and IDE integrations present validated outputs to growers and teams.",
    icon: Workflow,
    badge: "Layer 4",
  },
]

const integrationTiles = [
  {
    href: "/workspaces",
    title: "Research Workspaces",
    description: "Solo, team, and business environments with shared datasets and lifecycle analytics.",
    badge: "New",
  },
  {
    href: "/playground",
    title: "Model Playground",
    description: "Run tuned agents with workspace context, inspect outputs, and export validated SOPs.",
    badge: "Live",
  },
]

export function PlatformArchitecture() {
  return (
    <section className="space-y-8" aria-labelledby="platform-architecture-heading">
      <div className="space-y-2">
        <Badge className="sci-badge w-fit">Platform Architecture</Badge>
        <div>
          <h2 id="platform-architecture-heading" className="text-3xl font-semibold text-foreground">
            Crowe Logic Delivery Stack
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            From telemetry ingestion to agent orchestration, the platform connects cultivation intelligence directly
            to your research workspaces and hands-on playground sessions.
          </p>
        </div>
      </div>

      <div className="relative grid gap-4 lg:grid-cols-4">
        {architectureLayers.map((layer, index) => {
          const Icon = layer.icon
          return (
            <Card key={layer.title} className="lab-card h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="sci-badge text-[10px]">{layer.badge}</Badge>
                  <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="w-12 h-12 rounded-md bg-foreground/5 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg">{layer.title}</CardTitle>
                <CardDescription>{layer.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Card className="lab-card overflow-hidden">
        <CardContent className="grid gap-6 lg:grid-cols-2 p-6">
          {integrationTiles.map((tile) => (
            <div key={tile.href} className="group rounded-xl border border-border/50 p-6 hover:border-foreground transition-all">
              <div className="flex items-center justify-between mb-3">
                <Badge className="sci-badge text-[10px]">{tile.badge}</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{tile.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tile.description}</p>
              <Button asChild variant="ghost" className="pharma-btn-outline">
                <Link href={tile.href}>
                  Explore {tile.title}
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
