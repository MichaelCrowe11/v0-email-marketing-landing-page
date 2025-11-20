export interface AIModel {
  id: string
  name: string
  description: string
  monthlyPrice: number // Price in dollars per month
  stripeProductId?: string
  category: "azure-openai" | "azure-ai" | "custom-models"
  modelType: "chat" | "vision" | "embedding" | "fine-tuned"
  features: string[]
  apiEndpoint?: string
  deployment?: string
  maxTokens?: number
  rateLimits?: {
    requestsPerMinute: number
    tokensPerMinute: number
  }
  popular?: boolean
}

export const AI_MODELS: AIModel[] = [
  {
    id: "azure-gpt4o-mini",
    name: "GPT-4o Mini - Hosted",
    description: "Fast, cost-effective AI chat powered by Azure OpenAI for cultivation advice",
    monthlyPrice: 97,
    category: "azure-openai",
    modelType: "chat",
    deployment: "gpt-4o-mini",
    maxTokens: 128000,
    rateLimits: {
      requestsPerMinute: 60,
      tokensPerMinute: 80000
    },
    popular: true,
    features: [
      "Azure OpenAI GPT-4o Mini access",
      "128K context window",
      "60 requests/minute rate limit",
      "80K tokens/minute",
      "Mycology knowledge base integration",
      "REST API access",
      "Python SDK included",
      "Email support"
    ],
  },
  {
    id: "azure-gpt4o",
    name: "GPT-4o - Full Power",
    description: "Most capable AI model for complex cultivation analysis and decision-making",
    monthlyPrice: 297,
    category: "azure-openai",
    modelType: "chat",
    deployment: "gpt-4o",
    maxTokens: 128000,
    rateLimits: {
      requestsPerMinute: 60,
      tokensPerMinute: 150000
    },
    features: [
      "Azure OpenAI GPT-4o full access",
      "128K context window",
      "Advanced reasoning capabilities",
      "Vision analysis included",
      "150K tokens/minute",
      "Priority processing",
      "REST API + Python SDK",
      "Priority email support"
    ],
  },
  {
    id: "crowe-vision-api",
    name: "Crowe Vision API",
    description: "Specialized contamination detection and cultivation stage analysis powered by Azure Computer Vision",
    monthlyPrice: 197,
    category: "azure-ai",
    modelType: "vision",
    rateLimits: {
      requestsPerMinute: 30,
      tokensPerMinute: 10000
    },
    popular: true,
    features: [
      "Contamination detection AI",
      "Growth stage classification",
      "Species identification",
      "Yield estimation",
      "Quality assessment",
      "30 requests/minute",
      "Batch processing support",
      "Webhook notifications",
      "Custom training available"
    ],
  },
  {
    id: "crowelm-finetuned",
    name: "CroweLM - Fine-tuned Expert",
    description: "Custom fine-tuned model trained on Michael's 500+ cultivation videos and SOPs",
    monthlyPrice: 497,
    category: "custom-models",
    modelType: "fine-tuned",
    deployment: "crowelm-v1",
    maxTokens: 8192,
    rateLimits: {
      requestsPerMinute: 100,
      tokensPerMinute: 200000
    },
    features: [
      "Fine-tuned on Michael's expertise",
      "500+ hours of training data",
      "Mycology-specific vocabulary",
      "Process-specific recommendations",
      "100 requests/minute",
      "Low latency responses",
      "Dedicated inference endpoint",
      "REST API + Python SDK",
      "Premium support + consultation",
      "Custom fine-tuning available"
    ],
  },
  {
    id: "azure-ai-foundry-agents",
    name: "Azure AI Agent Orchestration",
    description: "Multi-agent system with tool calling, RAG, and custom function execution",
    monthlyPrice: 397,
    category: "azure-ai",
    modelType: "chat",
    rateLimits: {
      requestsPerMinute: 40,
      tokensPerMinute: 100000
    },
    features: [
      "Multi-agent orchestration",
      "Tool calling and function execution",
      "RAG (Retrieval Augmented Generation)",
      "Vector search integration",
      "Custom tool development",
      "Workflow automation",
      "Azure AI Search integration",
      "Real-time data access",
      "Advanced monitoring dashboard",
      "Custom agent development service"
    ],
  },
  {
    id: "embedding-api",
    name: "Embedding API - text-embedding-3",
    description: "High-performance text embeddings for semantic search and knowledge retrieval",
    monthlyPrice: 47,
    category: "azure-openai",
    modelType: "embedding",
    rateLimits: {
      requestsPerMinute: 120,
      tokensPerMinute: 500000
    },
    features: [
      "Text-embedding-3-large model",
      "3072-dimensional embeddings",
      "120 requests/minute",
      "Batch processing up to 2048 texts",
      "Low latency responses",
      "Vector database templates",
      "Semantic search examples",
      "REST API access"
    ],
  },
]

export function getAIModelsByCategory(category: AIModel["category"]) {
  return AI_MODELS.filter((m) => m.category === category)
}

export function getAIModelById(id: string) {
  return AI_MODELS.find((m) => m.id === id)
}

export function getAIModelPriceInCents(model: AIModel): number {
  return Math.round(model.monthlyPrice * 100)
}
