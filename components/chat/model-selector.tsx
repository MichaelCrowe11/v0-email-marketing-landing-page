"use client"
import { Badge } from "@/components/ui/badge"

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
      <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-[10px] font-bold shadow-sm">
        CL
      </div>
      <span className="text-sm font-medium text-foreground">CroweLM</span>
      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
        v1.0
      </Badge>
    </div>
  )
}
