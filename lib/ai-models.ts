export type ModelProvider =
  | "openai"
  | "anthropic"
  | "xai"
  | "google"
  | "groq"
  | "deepseek"
  | "meta"
  | "mistral"
  | "cohere"
  | "azure"
  | "crowelogic" // Added custom Crowe Logic provider

export type ModelOption = {
  id: string
  name: string
  provider: ModelProvider
  description: string
  badge?: "fastest" | "smartest" | "balanced" | "new" | "custom" | "vision" | "reasoning"
  costPer1MInputTokens: number // in USD
  costPer1MOutputTokens: number // in USD
  contextWindow: number
  capabilities: string[]
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "crowelogic/mini",
    name: "Crowe Logic Mini",
    provider: "crowelogic",
    description: "Deep reasoning scientific research model - fast, powerful, and trained for complex analysis",
    badge: "reasoning",
    costPer1MInputTokens: 0.05, // Ultra-low cost
    costPer1MOutputTokens: 0.1,
    contextWindow: 8192,
    capabilities: ["chat", "deep-reasoning", "scientific-research", "complex-analysis", "ultra-fast"],
  },

  // Azure Custom Assistant
  {
    id: "azure/crowelogic",
    name: "Crowe Logic Assistant",
    provider: "azure",
    description: "Your custom Azure AI agent trained on cultivation data",
    badge: "custom",
    costPer1MInputTokens: 5.0,
    costPer1MOutputTokens: 15.0,
    contextWindow: 128000,
    capabilities: ["chat", "cultivation-expert", "custom-training"],
  },

  // OpenAI Models
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Most capable GPT-4 model with vision",
    badge: "smartest",
    costPer1MInputTokens: 2.5,
    costPer1MOutputTokens: 10.0,
    contextWindow: 128000,
    capabilities: ["chat", "vision", "function-calling"],
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and efficient GPT-4o",
    badge: "fastest",
    costPer1MInputTokens: 0.15,
    costPer1MOutputTokens: 0.6,
    contextWindow: 128000,
    capabilities: ["chat", "vision", "function-calling"],
  },
  {
    id: "openai/gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    description: "Previous generation flagship",
    costPer1MInputTokens: 10.0,
    costPer1MOutputTokens: 30.0,
    contextWindow: 128000,
    capabilities: ["chat", "vision", "function-calling"],
  },
  {
    id: "openai/o1",
    name: "o1",
    provider: "openai",
    description: "Advanced reasoning model",
    badge: "reasoning",
    costPer1MInputTokens: 15.0,
    costPer1MOutputTokens: 60.0,
    contextWindow: 200000,
    capabilities: ["chat", "reasoning", "complex-problems"],
  },
  {
    id: "openai/o3-mini",
    name: "o3 Mini",
    provider: "openai",
    description: "Efficient reasoning model",
    badge: "new",
    costPer1MInputTokens: 1.1,
    costPer1MOutputTokens: 4.4,
    contextWindow: 200000,
    capabilities: ["chat", "reasoning"],
  },

  // Anthropic Models
  {
    id: "anthropic/claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    description: "Anthropic's most capable model",
    badge: "smartest",
    costPer1MInputTokens: 3.0,
    costPer1MOutputTokens: 15.0,
    contextWindow: 200000,
    capabilities: ["chat", "vision", "long-context"],
  },
  {
    id: "anthropic/claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    description: "Lightning-fast responses",
    badge: "fastest",
    costPer1MInputTokens: 0.8,
    costPer1MOutputTokens: 4.0,
    contextWindow: 200000,
    capabilities: ["chat", "vision"],
  },
  {
    id: "anthropic/claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Previous flagship model",
    costPer1MInputTokens: 15.0,
    costPer1MOutputTokens: 75.0,
    contextWindow: 200000,
    capabilities: ["chat", "vision", "long-context"],
  },

  // xAI Models
  {
    id: "xai/grok-beta",
    name: "Grok Beta",
    provider: "xai",
    description: "xAI's flagship model",
    costPer1MInputTokens: 5.0,
    costPer1MOutputTokens: 15.0,
    contextWindow: 131072,
    capabilities: ["chat", "real-time-data"],
  },
  {
    id: "xai/grok-2-1212",
    name: "Grok 2",
    provider: "xai",
    description: "Latest Grok model",
    badge: "new",
    costPer1MInputTokens: 2.0,
    costPer1MOutputTokens: 10.0,
    contextWindow: 131072,
    capabilities: ["chat", "vision"],
  },

  // Google Models
  {
    id: "google/gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Google's latest multimodal model",
    badge: "new",
    costPer1MInputTokens: 0.0,
    costPer1MOutputTokens: 0.0,
    contextWindow: 1000000,
    capabilities: ["chat", "vision", "audio", "video"],
  },
  {
    id: "google/gemini-1.5-pro-latest",
    name: "Gemini 1.5 Pro",
    provider: "google",
    description: "Advanced reasoning and analysis",
    costPer1MInputTokens: 1.25,
    costPer1MOutputTokens: 5.0,
    contextWindow: 2000000,
    capabilities: ["chat", "vision", "long-context"],
  },
  {
    id: "google/gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "google",
    description: "Fast and efficient",
    badge: "fastest",
    costPer1MInputTokens: 0.075,
    costPer1MOutputTokens: 0.3,
    contextWindow: 1000000,
    capabilities: ["chat", "vision"],
  },

  // Meta Llama Models
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "meta",
    description: "Meta's latest open model",
    badge: "new",
    costPer1MInputTokens: 0.35,
    costPer1MOutputTokens: 0.4,
    contextWindow: 128000,
    capabilities: ["chat", "function-calling"],
  },
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    name: "Llama 3.1 405B",
    provider: "meta",
    description: "Largest Llama model",
    costPer1MInputTokens: 2.7,
    costPer1MOutputTokens: 2.7,
    contextWindow: 128000,
    capabilities: ["chat", "function-calling"],
  },
  {
    id: "meta-llama/llama-3.1-70b-instruct",
    name: "Llama 3.1 70B",
    provider: "meta",
    description: "Balanced performance",
    badge: "balanced",
    costPer1MInputTokens: 0.35,
    costPer1MOutputTokens: 0.4,
    contextWindow: 128000,
    capabilities: ["chat", "function-calling"],
  },
  {
    id: "meta-llama/llama-3.2-90b-vision-instruct",
    name: "Llama 3.2 90B Vision",
    provider: "meta",
    description: "Multimodal Llama",
    badge: "vision",
    costPer1MInputTokens: 0.35,
    costPer1MOutputTokens: 0.4,
    contextWindow: 128000,
    capabilities: ["chat", "vision"],
  },

  // Mistral Models
  {
    id: "mistralai/mistral-large-latest",
    name: "Mistral Large",
    provider: "mistral",
    description: "Mistral's flagship model",
    costPer1MInputTokens: 2.0,
    costPer1MOutputTokens: 6.0,
    contextWindow: 128000,
    capabilities: ["chat", "function-calling"],
  },
  {
    id: "mistralai/mistral-medium-latest",
    name: "Mistral Medium",
    provider: "mistral",
    description: "Balanced performance",
    badge: "balanced",
    costPer1MInputTokens: 2.7,
    costPer1MOutputTokens: 8.1,
    contextWindow: 32000,
    capabilities: ["chat"],
  },
  {
    id: "mistralai/mistral-small-latest",
    name: "Mistral Small",
    provider: "mistral",
    description: "Fast and efficient",
    badge: "fastest",
    costPer1MInputTokens: 0.2,
    costPer1MOutputTokens: 0.6,
    contextWindow: 32000,
    capabilities: ["chat"],
  },

  // Cohere Models
  {
    id: "cohere/command-r-plus",
    name: "Command R+",
    provider: "cohere",
    description: "Cohere's most capable model",
    costPer1MInputTokens: 2.5,
    costPer1MOutputTokens: 10.0,
    contextWindow: 128000,
    capabilities: ["chat", "rag", "function-calling"],
  },
  {
    id: "cohere/command-r",
    name: "Command R",
    provider: "cohere",
    description: "Efficient and capable",
    badge: "balanced",
    costPer1MInputTokens: 0.15,
    costPer1MOutputTokens: 0.6,
    contextWindow: 128000,
    capabilities: ["chat", "rag"],
  },

  // DeepSeek Models
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "deepseek",
    description: "Latest DeepSeek model",
    badge: "new",
    costPer1MInputTokens: 0.14,
    costPer1MOutputTokens: 0.28,
    contextWindow: 64000,
    capabilities: ["chat", "reasoning"],
  },
  {
    id: "deepseek/deepseek-coder",
    name: "DeepSeek Coder",
    provider: "deepseek",
    description: "Specialized for coding",
    costPer1MInputTokens: 0.14,
    costPer1MOutputTokens: 0.28,
    contextWindow: 64000,
    capabilities: ["chat", "coding"],
  },

  // Groq (Fast Inference)
  {
    id: "groq/llama-3.3-70b-versatile",
    name: "Llama 3.3 70B (Groq)",
    provider: "groq",
    description: "Ultra-fast inference",
    badge: "fastest",
    costPer1MInputTokens: 0.59,
    costPer1MOutputTokens: 0.79,
    contextWindow: 128000,
    capabilities: ["chat", "ultra-fast"],
  },
  {
    id: "groq/llama-3.1-70b-versatile",
    name: "Llama 3.1 70B (Groq)",
    provider: "groq",
    description: "Ultra-fast inference",
    badge: "fastest",
    costPer1MInputTokens: 0.59,
    costPer1MOutputTokens: 0.79,
    contextWindow: 128000,
    capabilities: ["chat", "ultra-fast"],
  },
  {
    id: "groq/mixtral-8x7b-32768",
    name: "Mixtral 8x7B (Groq)",
    provider: "groq",
    description: "Fast Mixtral inference",
    badge: "fastest",
    costPer1MInputTokens: 0.24,
    costPer1MOutputTokens: 0.24,
    contextWindow: 32768,
    capabilities: ["chat", "ultra-fast"],
  },
]

export const PRICING_CONFIG = {
  markupPercentage: 25, // 25% markup on all models
  minimumCharge: 0.001, // Minimum $0.001 per request
  freeTrialTokens: 100000, // 100k tokens free for new users
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  modelId: string,
): {
  providerCost: number
  markup: number
  totalCost: number
  userCharge: number
} {
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId)
  if (!model) {
    return { providerCost: 0, markup: 0, totalCost: 0, userCharge: 0 }
  }

  const inputCost = (inputTokens / 1000000) * model.costPer1MInputTokens
  const outputCost = (outputTokens / 1000000) * model.costPer1MOutputTokens
  const providerCost = inputCost + outputCost

  const markup = providerCost * (PRICING_CONFIG.markupPercentage / 100)
  const totalCost = providerCost + markup
  const userCharge = Math.max(totalCost, PRICING_CONFIG.minimumCharge)

  return {
    providerCost: Number(providerCost.toFixed(6)),
    markup: Number(markup.toFixed(6)),
    totalCost: Number(totalCost.toFixed(6)),
    userCharge: Number(userCharge.toFixed(6)),
  }
}

export function getModelById(modelId: string): ModelOption | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === modelId)
}

export function getModelsByProvider(): Record<ModelProvider, ModelOption[]> {
  return AVAILABLE_MODELS.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = []
      }
      acc[model.provider].push(model)
      return acc
    },
    {} as Record<ModelProvider, ModelOption[]>,
  )
}
