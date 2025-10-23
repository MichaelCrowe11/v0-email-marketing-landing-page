"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type ModelOption = {
  id: string
  name: string
  provider: "azure" | "openai" | "anthropic" | "xai" | "google"
  description: string
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "azure-agent",
    name: "Crowe Logic Azure Agent",
    provider: "azure",
    description: "Your custom Azure AI agent",
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    description: "Most capable Claude model",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "OpenAI's flagship model",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and efficient",
  },
  {
    id: "xai/grok-beta",
    name: "Grok Beta",
    provider: "xai",
    description: "xAI's conversational model",
  },
  {
    id: "google/gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Google's latest model",
  },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-[280px] bg-background border-border">
        <SelectValue>
          <div className="flex items-center gap-2">
            <ModelIcon provider={currentModel?.provider || "azure"} />
            <span className="text-sm">{currentModel?.name || "Select Model"}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {AVAILABLE_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-3 py-1">
              <ModelIcon provider={model.provider} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{model.name}</span>
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
  const iconClass = "w-5 h-5"

  switch (provider) {
    case "azure":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
          Az
        </div>
      )
    case "anthropic":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold">
          C
        </div>
      )
    case "openai":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
          O
        </div>
      )
    case "xai":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
          X
        </div>
      )
    case "google":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
          G
        </div>
      )
  }
}
