"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Play, Pause, Archive, Trash2, ExternalLink, Database, Lightbulb, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSessionStore, ResearchSession } from "@/lib/stores/session-store"

interface SessionCardProps {
  session: ResearchSession
  viewMode: "grid" | "list"
}

const typeConfig = {
  "contamination-analysis": {
    label: "Contamination Analysis",
    color: "from-red-500 to-orange-500",
    icon: "🔬",
  },
  "substrate-optimization": {
    label: "Substrate Optimization",
    color: "from-green-500 to-emerald-500",
    icon: "🧪",
  },
  "yield-prediction": {
    label: "Yield Prediction",
    color: "from-blue-500 to-cyan-500",
    icon: "📊",
  },
  "species-identification": {
    label: "Species ID",
    color: "from-purple-500 to-pink-500",
    icon: "🍄",
  },
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-500", textColor: "text-green-400" },
  paused: { label: "Paused", color: "bg-yellow-500", textColor: "text-yellow-400" },
  completed: { label: "Completed", color: "bg-blue-500", textColor: "text-blue-400" },
}

export function SessionCard({ session, viewMode }: SessionCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { pauseSession, resumeSession, archiveSession, deleteSession } = useSessionStore()
  const config = typeConfig[session.type]
  const status = statusConfig[session.status]

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(false)
    
    if (session.status === 'active') {
      await pauseSession(session.id)
    } else {
      await resumeSession(session.id)
    }
  }

  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(false)
    await archiveSession(session.id)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(false)
    
    if (confirm(`Are you sure you want to delete "${session.title}"? This action cannot be undone.`)) {
      await deleteSession(session.id)
    }
  }

  if (viewMode === "list") {
    return (
      <Link href={`/workbench/${session.id}`}>
        <div className="glass-card rounded-xl p-6 border border-border hover:border-accent/50 transition-all group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="text-4xl">{config.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                    {session.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.textColor} bg-${status.color}/10`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    {session.datasets} datasets
                  </span>
                  <span className="flex items-center gap-1">
                    <FlaskConical className="w-3 h-3" />
                    {session.hypotheses} hypotheses
                  </span>
                  <span className="flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    {session.insights} insights
                  </span>
                  <span>•</span>
                  <span>{session.lastActivity}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{session.progress}%</div>
                <div className="text-xs text-muted-foreground">Progress</div>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
              style={{ width: `${session.progress}%` }}
            />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/workbench/${session.id}`}>
      <div className="glass-card rounded-xl p-6 border border-border hover:border-accent/50 transition-all hover:scale-[1.02] group cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{config.icon}</div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {session.title}
              </h3>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                setShowMenu(!showMenu)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg border border-border shadow-xl z-10">
                <button 
                  onClick={handleToggleStatus}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent/10 transition-colors flex items-center gap-2"
                >
                  {session.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {session.status === "active" ? "Pause" : "Resume"}
                </button>
                <button 
                  onClick={handleArchive}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent/10 transition-colors flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <button 
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/10 text-red-500 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${status.color} animate-pulse`} />
          <span className={`text-xs font-medium ${status.textColor}`}>{status.label}</span>
          <span className="text-xs text-muted-foreground">• {session.lastActivity}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{session.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{session.datasets}</div>
            <div className="text-xs text-muted-foreground">Datasets</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{session.hypotheses}</div>
            <div className="text-xs text-muted-foreground">Hypotheses</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{session.insights}</div>
            <div className="text-xs text-muted-foreground">Insights</div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{session.progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
              style={{ width: `${session.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
