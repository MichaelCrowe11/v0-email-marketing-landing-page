"use client"

import type React from "react"

import { Activity, Pause, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type Status = "active" | "paused" | "error" | "completed"

interface ResearchActivityCardProps {
  title: string
  status: Status
  icon: React.ReactNode
  progress?: number
  eta?: string
  items?: string[]
  onPrimary?: () => void
  onSecondary?: () => void
  primaryLabel?: string
  secondaryLabel?: string
}

const statusConfig = {
  active: {
    icon: Activity,
    label: "Active",
    className: "status-badge active",
  },
  paused: {
    icon: Pause,
    label: "Paused",
    className: "status-badge paused",
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    className: "status-badge error",
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    className: "status-badge active",
  },
}

export function ResearchActivityCard({
  title,
  status,
  icon,
  progress,
  eta,
  items = [],
  onPrimary,
  onSecondary,
  primaryLabel = "View Details",
  secondaryLabel,
}: ResearchActivityCardProps) {
  const StatusIcon = statusConfig[status].icon

  return (
    <div className="research-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className={statusConfig[status].className}>
          <StatusIcon className="w-4 h-4" />
          <span>{statusConfig[status].label}</span>
        </div>
      </div>

      {/* Progress Section */}
      {progress !== undefined && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-semibold">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          {eta && <p className="text-sm text-muted-foreground">Estimated completion: {eta}</p>}
        </div>
      )}

      {/* Items/Outputs */}
      {items.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-foreground mb-2">Recent Outputs:</p>
          <ul className="space-y-1">
            {items.slice(0, 5).map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent-blue mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        {onPrimary && (
          <Button onClick={onPrimary} variant="default" size="sm" className="flex-1">
            {primaryLabel}
          </Button>
        )}
        {onSecondary && secondaryLabel && (
          <Button onClick={onSecondary} variant="outline" size="sm" className="flex-1 bg-transparent">
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
