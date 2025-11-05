"use client"

import { useState } from "react"
import {
  Code2,
  Upload,
  Download,
  Play,
  FileCode2,
  Settings,
  Terminal,
  GitBranch,
  Share2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IDEToolbarProps {
  onAction?: (action: string) => void
  disabled?: boolean
  className?: string
}

export function IDEToolbar({ onAction, disabled, className }: IDEToolbarProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const handleAction = (action: string) => {
    setActiveAction(action)
    onAction?.(action)
    setTimeout(() => setActiveAction(null), 1000)
  }

  const actions = [
    {
      id: "upload",
      icon: Upload,
      label: "Upload Code",
      description: "Upload files to analyze",
      color: "text-blue-500",
    },
    {
      id: "export",
      icon: Download,
      label: "Export Project",
      description: "Download all files",
      color: "text-green-500",
    },
    {
      id: "run",
      icon: Play,
      label: "Run Code",
      description: "Execute in sandbox",
      color: "text-purple-500",
    },
    {
      id: "refactor",
      icon: Sparkles,
      label: "AI Refactor",
      description: "Improve code quality",
      color: "text-amber-500",
    },
    {
      id: "terminal",
      icon: Terminal,
      label: "Terminal",
      description: "Open terminal",
      color: "text-cyan-500",
    },
    {
      id: "git",
      icon: GitBranch,
      label: "Version Control",
      description: "Git operations",
      color: "text-orange-500",
    },
    {
      id: "share",
      icon: Share2,
      label: "Share",
      description: "Share workspace",
      color: "text-pink-500",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      description: "IDE preferences",
      color: "text-gray-500",
    },
  ]

  return (
    <div className={cn("border-b border-border bg-card/50 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Code2 className="w-5 h-5 text-primary" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-card" />
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Research IDE
          </span>
        </div>

        {/* Center: Actions */}
        <div className="flex items-center gap-1">
          {actions.slice(0, 4).map((action) => {
            const Icon = action.icon
            const isActive = activeAction === action.id

            return (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={() => handleAction(action.id)}
                disabled={disabled}
                className={cn(
                  "h-8 px-3 gap-2 transition-all",
                  isActive && "bg-accent",
                )}
                title={action.description}
              >
                <Icon className={cn("w-4 h-4", action.color)} />
                <span className="text-xs font-medium hidden sm:inline">{action.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Right: More Actions */}
        <div className="flex items-center gap-1">
          {actions.slice(4).map((action) => {
            const Icon = action.icon
            const isActive = activeAction === action.id

            return (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={() => handleAction(action.id)}
                disabled={disabled}
                className={cn(
                  "h-8 w-8 p-0 transition-all",
                  isActive && "bg-accent",
                )}
                title={action.description}
              >
                <Icon className={cn("w-4 h-4", action.color)} />
              </Button>
            )
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-muted/30 text-xs text-muted-foreground border-t border-border">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Ready
          </span>
          <span>TypeScript</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            main
          </span>
        </div>
      </div>
    </div>
  )
}
