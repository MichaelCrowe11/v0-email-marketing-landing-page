"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export type ModelOption = {
  id: string
  name: string
  provider: "openai" | "anthropic" | "xai" | "google" | "groq" | "deepseek" | "azure"
  description: string
  badge?: "fastest" | "smartest" | "balanced" | "new" | "custom"
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "azure/agent874",
    name: "Crowe Logic (Azure)",
    provider: "azure",
    description: "Your custom Azure AI agent",
    badge: "custom",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "openai",
    description: "Fast and efficient GPT-5",
    badge: "fastest",
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    description: "Anthropic's most capable model",
    badge: "smartest",
  },
  {
    id: "anthropic/claude-opus-4",
    name: "Claude Opus 4",
    provider: "anthropic",
    description: "Maximum intelligence and reasoning",
  },
  {
    id: "anthropic/claude-haiku-4",
    name: "Claude Haiku 4",
    provider: "anthropic",
    description: "Lightning-fast responses",
    badge: "fastest",
  },
  {
    id: "xai/grok-4",
    name: "Grok 4",
    provider: "xai",
    description: "xAI's flagship model",
  },
  {
    id: "xai/grok-4-fast",
    name: "Grok 4 Fast",
    provider: "xai",
    description: "Optimized for speed",
    badge: "fastest",
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Google's latest multimodal model",
    badge: "new",
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    description: "Advanced reasoning and analysis",
  },
  {
    id: "groq/llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "groq",
    description: "Meta's open model on Groq",
    badge: "fastest",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    provider: "deepseek",
    description: "Efficient reasoning model",
    badge: "balanced",
  },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  const getBadgeVariant = (badge?: string) => {
    switch (badge) {
      case "smartest":
        return "default"
      case "fastest":
        return "secondary"
      case "balanced":
        return "outline"
      case "new":
        return "default"
      case "custom":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-[280px] bg-background border-border">
        <SelectValue>
          <div className="flex items-center gap-2">
            <ModelIcon provider={currentModel?.provider || "openai"} />
            <span className="text-sm font-medium">{currentModel?.name || "Select Model"}</span>
            {currentModel?.badge && (
              <Badge variant={getBadgeVariant(currentModel.badge)} className="text-[10px] px-1.5 py-0 h-4">
                {currentModel.badge}
              </Badge>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {AVAILABLE_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-3 py-1">
              <ModelIcon provider={model.provider} />
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{model.name}</span>
                  {model.badge && (
                    <Badge variant={getBadgeVariant(model.badge)} className="text-[10px] px-1.5 py-0 h-4">
                      {model.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ModelIcon({ provider }: { provider: ModelOption["provider"] }) {
  switch (provider) {
    case "azure":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          CL
        </div>
      )
    case "anthropic":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          C
        </div>
      )
    case "openai":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          O
        </div>
      )
    case "xai":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          X
        </div>
      )
    case "google":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          G
        </div>
      )
    case "groq":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          Q
        </div>
      )
    case "deepseek":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          D
        </div>
      )
  }
}
