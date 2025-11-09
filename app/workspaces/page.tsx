"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlatformArchitecture } from "@/components/platform-architecture"
import { workspacePlans, workspaceSummaries, workspaceFeatureRows } from "@/lib/workspaces"
import { Plus, Settings, FolderOpen, Clock, CheckCircle2, Microscope, Play, Share2 } from "lucide-react"

export default function WorkspacesPage() {
  const [activeTab, setActiveTab] = useState("workspaces")
  const [preferredPlan, setPreferredPlan] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam === "create" || tabParam === "workspaces") {
      setActiveTab(tabParam)
    }

    const planParam = searchParams.get("plan")
    if (planParam === "solo" || planParam === "team" || planParam === "business") {
      setPreferredPlan(planParam)
      setActiveTab("create")
    } else {
      setPreferredPlan(null)
    }
  }, [searchParams])

  const planByType = useMemo(
    () => Object.fromEntries(workspacePlans.map((plan) => [plan.type, plan])),
    [],
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">Workspaces</h1>
              <p className="text-muted-foreground">
                Manage your research environments and collaborate with your team
              </p>
            </div>
            <Button className="pharma-btn">
              <Plus className="w-4 h-4 mr-2" />
              New Workspace
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-12">
        <PlatformArchitecture />

        <Card className="lab-card">
          <CardHeader>
            <CardTitle className="text-lg">Workspace & Playground Integration</CardTitle>
            <CardDescription>
              Sync experiments between collaborative workspaces and the AI playground for rapid validation.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border/50 p-5 bg-background/40">
              <div className="flex items-center gap-3 mb-3">
                <Microscope className="w-4 h-4 text-foreground" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">Launch Playground</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Generate SOPs and reasoned outputs with workspace-specific datasets.
              </p>
              <Button asChild className="pharma-btn w-full">
                <Link href="/playground">
                  Open Playground
                  <Play className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border/50 p-5 bg-background/40">
              <div className="flex items-center gap-3 mb-3">
                <Share2 className="w-4 h-4 text-foreground" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">Sync with Workspaces</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Export validated runs into shared folders for teams, business units, or solo research logs.
              </p>
              <Button asChild variant="outline" className="pharma-btn-outline w-full">
                <Link href="/workbench">Open Research IDE</Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border/50 p-5 bg-background/40">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-4 h-4 text-secondary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">Plan-Aware Governance</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Confidence scoring, lineage, and RBAC adjust automatically based on workspace tier.
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                {workspacePlans.map((plan) => (
                  <div key={plan.type} className="rounded-md border border-border/60 px-3 py-2 text-center">
                    <span className="font-medium text-foreground block">{plan.title}</span>
                    <span>{plan.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="workspaces">My Workspaces</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          {/* My Workspaces */}
          <TabsContent value="workspaces" className="space-y-6">
            {workspaceSummaries.length === 0 ? (
              <Card className="lab-card">
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No workspaces yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first workspace to start researching
                  </p>
                  <Button onClick={() => setActiveTab("create")} className="pharma-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workspace
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {workspaceSummaries.map((workspace) => {
                  const plan = planByType[workspace.type]
                  const Icon = plan?.icon || FolderOpen

                  return (
                    <Card key={workspace.id} className="lab-card hover:border-foreground transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-foreground/5 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                              <CardTitle className="text-base mb-1">{workspace.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {plan?.title} Workspace
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="sci-badge text-[10px]">
                            {workspace.type.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              Members
                            </div>
                            <div className="metric-display text-lg">{workspace.members}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              Projects
                            </div>
                            <div className="metric-display text-lg">{workspace.projects}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              Storage
                            </div>
                            <div className="metric-display text-sm">{workspace.storage.split(" / ")[0]}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Active {workspace.lastActive}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => {
                                setActiveTab("create")
                                setPreferredPlan(workspace.type)
                              }}
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Configure
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                              <Link href={`/playground?workspace=${workspace.type}`}>
                                <Microscope className="w-3 h-3 mr-1" />
                                Launch
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Create New Workspace */}
          <TabsContent value="create" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Choose your workspace type</h2>
                <p className="text-muted-foreground">
                  Select the plan that best fits your research needs
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {workspacePlans.map((workspace) => {
                  const IconComponent = workspace.icon ?? FolderOpen
                  const isPreferred = preferredPlan === workspace.type

                  return (
                    <Card
                      key={workspace.type}
                      className={`lab-card hover:border-foreground transition-all relative ${
                        workspace.popular || isPreferred ? "border-foreground" : ""
                      }`}
                    >
                      {workspace.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="sci-badge bg-foreground text-background">
                            POPULAR
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="w-12 h-12 rounded-md bg-foreground/5 flex items-center justify-center mb-4">
                          <IconComponent className={`w-6 h-6 ${workspace.color ?? ""}`} />
                        </div>
                        <CardTitle className="text-xl mb-2">{workspace.title}</CardTitle>
                        <CardDescription>{workspace.description}</CardDescription>
                        <div className="pt-4">
                          <div className="text-3xl font-semibold text-foreground metric-display">
                            {workspace.price}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {workspace.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          className={`w-full ${
                            workspace.popular || isPreferred ? "pharma-btn" : "pharma-btn-outline"
                          }`}
                          onClick={() => setPreferredPlan(workspace.type)}
                        >
                          Create {workspace.title} Workspace
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Feature Comparison */}
              <Card className="lab-card mt-12">
                <CardHeader>
                  <CardTitle className="text-xl">Feature Comparison</CardTitle>
                  <CardDescription>Compare workspace capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Feature</th>
                        <th>Solo</th>
                        <th>Team</th>
                        <th>Business</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workspaceFeatureRows.map((row) => (
                        <tr key={row.feature}>
                          <td>{row.feature}</td>
                          <td className="text-center">{row.solo}</td>
                          <td className="text-center">{row.team}</td>
                          <td className="text-center">{row.business}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
