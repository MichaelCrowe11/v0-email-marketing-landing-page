"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AVAILABLE_MODELS, type ModelOption, type ModelProvider } from "@/lib/ai-models"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [canAccessAzure, setCanAccessAzure] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch("/api/subscription/check-azure-access")
        const data = await response.json()
        setCanAccessAzure(data.hasAccess)
      } catch (error) {
        console.error("Failed to check Azure access:", error)
        setCanAccessAzure(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAccess()
  }, [])

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  const availableModels = AVAILABLE_MODELS.filter((model) => {
    if (model.provider === "azure" && !canAccessAzure) {
      return false
    }
    return true
  })

  const modelsByProvider = availableModels.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = []
      }
      acc[model.provider].push(model)
      return acc
    },
    {} as Record<ModelProvider, ModelOption[]>,
  )

  const providerOrder: ModelProvider[] = [
    "azure",
    "openai",
    "anthropic",
    "xai",
    "google",
    "meta",
    "mistral",
    "cohere",
    "deepseek",
    "groq",
  ]

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
      case "vision":
        return "default"
      case "reasoning":
        return "default"
      default:
        return "secondary"
    }
  }

  const getProviderName = (provider: ModelProvider): string => {
    const names: Record<ModelProvider, string> = {
      azure: "Custom Assistant",
      openai: "OpenAI",
      anthropic: "Anthropic",
      xai: "xAI",
      google: "Google",
      meta: "Meta",
      mistral: "Mistral",
      cohere: "Cohere",
      deepseek: "DeepSeek",
      groq: "Groq (Fast)",
    }
    return names[provider]
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
      <SelectContent className="max-h-[500px] w-[320px]">
        {providerOrder.map((provider, index) => {
          const models = modelsByProvider[provider]
          if (!models || models.length === 0) return null

          return (
            <div key={provider}>
              {index > 0 && <Separator className="my-2" />}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                {getProviderName(provider)}
                {provider === "azure" && (
                  <Badge variant="default" className="text-[9px] px-1.5 py-0 h-3.5">
                    PREMIUM
                  </Badge>
                )}
              </div>
              {models.map((model) => (
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
                      {model.costPer1MInputTokens > 0 && (
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          ${model.costPer1MInputTokens.toFixed(2)}-${model.costPer1MOutputTokens.toFixed(2)}/1M tokens
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </div>
          )
        })}
      </SelectContent>
    </Select>
  )
}

function ModelIcon({ provider }: { provider: ModelProvider }) {
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
    case "meta":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          M
        </div>
      )
    case "mistral":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          M
        </div>
      )
    case "cohere":
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          C
        </div>
      )
  }
}
