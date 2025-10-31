"use client"

import { useState } from "react"
import { Plus, Grid3x3, List, Search, Filter, TrendingUp, Beaker, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SessionCard } from "@/components/workbench/session-card"
import { CreateSessionDialog } from "@/components/workbench/create-session-dialog"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import Link from "next/link"

interface ResearchSession {
  id: string
  title: string
  description: string
  type: "contamination-analysis" | "substrate-optimization" | "yield-prediction" | "species-identification"
  status: "active" | "paused" | "completed"
  progress: number
  lastActivity: string
  datasets: number
  hypotheses: number
  insights: number
}

export default function WorkbenchPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - will be replaced with real data from API
  const sessions: ResearchSession[] = [
    {
      id: "1",
      title: "Oyster Mushroom Contamination Study",
      description: "Analyzing green mold contamination patterns in substrate blocks",
      type: "contamination-analysis",
      status: "active",
      progress: 67,
      lastActivity: "2 hours ago",
      datasets: 3,
      hypotheses: 5,
      insights: 12,
    },
    {
      id: "2",
      title: "Substrate Formula Optimization",
      description: "Testing hardwood sawdust ratios for Lion's Mane production",
      type: "substrate-optimization",
      status: "active",
      progress: 45,
      lastActivity: "5 hours ago",
      datasets: 2,
      hypotheses: 3,
      insights: 8,
    },
    {
      id: "3",
      title: "Yield Prediction Model",
      description: "Building predictive model for shiitake yields based on environmental factors",
      type: "yield-prediction",
      status: "paused",
      progress: 82,
      lastActivity: "1 day ago",
      datasets: 5,
      hypotheses: 7,
      insights: 24,
    },
  ]

  const stats = [
    { label: "Active Sessions", value: "3", icon: Beaker, color: "text-cyan-400" },
    { label: "Total Datasets", value: "10", icon: Database, color: "text-purple-400" },
    { label: "Insights Generated", value: "44", icon: TrendingUp, color: "text-pink-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/5">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <AIAvatarSwirl state="idle" size={48} />
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Mycological Workbench
                  </h1>
                  <p className="text-xs text-muted-foreground">DeepParallel AgBiotech Reasoning Engine</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  Crowe Logic Interface
                </Button>
              </Link>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Research Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 border border-border hover:border-accent/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sessions Grid/List */}
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6">
              <AIAvatarSwirl state="idle" size={120} />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Research Sessions Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start your first research session to analyze contamination, optimize substrates, or predict yields with
              AI-powered deep reasoning.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Session
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>

      {/* Create Session Dialog */}
      {showCreateDialog && <CreateSessionDialog onClose={() => setShowCreateDialog(false)} />}
    </div>
  )
}
