"use client"

import { Bot, Sparkles, Zap, Brain } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const AI_MODELS = [
  { id: "crowe-mini", name: "Crowe Logic Mini", provider: "Crowe Logic", badge: "Reasoning", icon: Brain },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", badge: "Smartest", icon: Sparkles },
  { id: "claude-3-5", name: "Claude 3.5 Sonnet", provider: "Anthropic", badge: "Coding", icon: Bot },
  { id: "llama-3", name: "Llama 3 70B", provider: "Meta", badge: "Fast", icon: Zap },
]

export function ModelSelector() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="text-xs font-semibold text-muted-foreground">AI MODELS</div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-2">
          {AI_MODELS.map((model) => (
            <div
              key={model.id}
              className="flex flex-col gap-2 rounded-md border border-border/50 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <model.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{model.name}</span>
                </div>
                {model.badge && (
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                    {model.badge}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">Provider: {model.provider}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
