"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Users,
  Building2,
  User,
  Settings,
  FolderOpen,
  Database,
  Code,
  BarChart3,
  Clock,
  CheckCircle2
} from "lucide-react"

const workspaceTypes = [
  {
    type: "solo",
    icon: User,
    title: "Solo Researcher",
    description: "Individual research and experimentation",
    features: [
      "5 GB storage",
      "Unlimited models",
      "Private workspace",
      "Basic analytics",
      "Community support",
    ],
    price: "Free",
    color: "text-secondary"
  },
  {
    type: "team",
    icon: Users,
    title: "Team",
    description: "Collaborative research for small teams",
    features: [
      "100 GB shared storage",
      "Unlimited models",
      "5 team members",
      "Advanced analytics",
      "Shared datasets",
      "Priority support",
    ],
    price: "$49/month",
    color: "text-primary",
    popular: true
  },
  {
    type: "business",
    icon: Building2,
    title: "Business",
    description: "Enterprise-grade research platform",
    features: [
      "1 TB storage",
      "Custom models",
      "Unlimited members",
      "Enterprise analytics",
      "Dedicated support",
      "SLA guarantee",
      "SSO & RBAC",
    ],
    price: "Custom",
    color: "text-warning"
  },
]

interface Workspace {
  id: string
  name: string
  type: "solo" | "team" | "business"
  members: number
  projects: number
  storage: string
  lastActive: string
}

const sampleWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Oyster Cultivation Research",
    type: "solo",
    members: 1,
    projects: 3,
    storage: "2.4 GB / 5 GB",
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Contamination Analysis Lab",
    type: "team",
    members: 4,
    projects: 12,
    storage: "45 GB / 100 GB",
    lastActive: "30 minutes ago"
  },
]

export default function WorkspacesPage() {
  const [activeTab, setActiveTab] = useState("workspaces")

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

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="workspaces">My Workspaces</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          {/* My Workspaces */}
          <TabsContent value="workspaces" className="space-y-6">
            {sampleWorkspaces.length === 0 ? (
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
                {sampleWorkspaces.map((workspace) => {
                  const typeConfig = workspaceTypes.find(t => t.type === workspace.type)
                  const Icon = typeConfig?.icon || FolderOpen

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
                                {typeConfig?.title} Workspace
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
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Settings className="w-3 h-3 mr-1" />
                            Manage
                          </Button>
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
                {workspaceTypes.map((workspace) => {
                  const Icon = workspace.icon

                  return (
                    <Card
                      key={workspace.type}
                      className={`lab-card hover:border-foreground transition-all relative ${
                        workspace.popular ? "border-foreground" : ""
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
                          <Icon className={`w-6 h-6 ${workspace.color}`} />
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
                            workspace.popular ? "pharma-btn" : "pharma-btn-outline"
                          }`}
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
                      <tr>
                        <td>Storage</td>
                        <td className="text-center">5 GB</td>
                        <td className="text-center">100 GB</td>
                        <td className="text-center">1 TB</td>
                      </tr>
                      <tr>
                        <td>Team Members</td>
                        <td className="text-center">1</td>
                        <td className="text-center">5</td>
                        <td className="text-center">Unlimited</td>
                      </tr>
                      <tr>
                        <td>AI Models</td>
                        <td className="text-center">All</td>
                        <td className="text-center">All + Priority</td>
                        <td className="text-center">All + Custom</td>
                      </tr>
                      <tr>
                        <td>Support</td>
                        <td className="text-center">Community</td>
                        <td className="text-center">Priority</td>
                        <td className="text-center">Dedicated</td>
                      </tr>
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
