/**
 * Azure AI Configuration and Integration
 * Centralizes Azure OpenAI, Azure AI Foundry, and Azure AI Services configuration
 */

export interface AzureAIConfig {
  // Azure OpenAI Configuration
  openai: {
    endpoint: string
    apiKey: string
    deployments: {
      chat: string // gpt-4o-mini or gpt-4o
      chatAdvanced: string // gpt-4o
      embedding: string // text-embedding-3-large
      vision: string // gpt-4o with vision
    }
    apiVersion: string
  }

  // Azure AI Foundry / AI Studio Configuration
  aiFoundry: {
    endpoint: string
    apiKey: string
    projectName: string
    deployments: {
      agents: string[]
      models: string[]
    }
  }

  // Azure Computer Vision Configuration
  computerVision: {
    endpoint: string
    apiKey: string
  }

  // Azure Storage Configuration
  storage: {
    connectionString: string
    containers: {
      datasets: string
      models: string
      uploads: string
    }
  }
}

/**
 * Get Azure AI configuration from environment variables
 */
export function getAzureAIConfig(): AzureAIConfig {
  const config: AzureAIConfig = {
    openai: {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
      apiKey: process.env.AZURE_OPENAI_API_KEY || "",
      deployments: {
        chat: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini",
        chatAdvanced: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4O || "gpt-4o",
        embedding: process.env.AZURE_OPENAI_DEPLOYMENT_EMBEDDING || "text-embedding-3-large",
        vision: process.env.AZURE_OPENAI_DEPLOYMENT_VISION || "gpt-4o",
      },
      apiVersion: "2024-08-01-preview",
    },
    aiFoundry: {
      endpoint: process.env.AZURE_AI_FOUNDRY_ENDPOINT || "",
      apiKey: process.env.AZURE_AI_FOUNDRY_API_KEY || "",
      projectName: process.env.AZURE_AI_FOUNDRY_PROJECT || "CriOSNova",
      deployments: {
        agents: JSON.parse(process.env.AZURE_AI_FOUNDRY_AGENTS || "[]"),
        models: JSON.parse(process.env.AZURE_AI_FOUNDRY_MODELS || "[]"),
      },
    },
    computerVision: {
      endpoint: process.env.AZURE_COMPUTER_VISION_ENDPOINT || "",
      apiKey: process.env.AZURE_COMPUTER_VISION_KEY || "",
    },
    storage: {
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
      containers: {
        datasets: "datasets",
        models: "models",
        uploads: "uploads",
      },
    },
  }

  return config
}

/**
 * Validate Azure AI configuration
 */
export function validateAzureAIConfig(config: AzureAIConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.openai.endpoint) {
    errors.push("AZURE_OPENAI_ENDPOINT is required")
  }
  if (!config.openai.apiKey) {
    errors.push("AZURE_OPENAI_API_KEY is required")
  }

  if (!config.storage.connectionString) {
    errors.push("AZURE_STORAGE_CONNECTION_STRING is required for dataset downloads")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Azure OpenAI Chat Configuration
 */
export function getAzureOpenAIChatConfig() {
  const config = getAzureAIConfig()

  return {
    baseURL: `${config.openai.endpoint}openai/deployments/${config.openai.deployments.chat}`,
    apiKey: config.openai.apiKey,
    apiVersion: config.openai.apiVersion,
    deployment: config.openai.deployments.chat,
  }
}

/**
 * Azure AI Foundry Agent Configuration
 */
export interface AzureAIAgent {
  id: string
  name: string
  description: string
  tools: string[]
  systemPrompt?: string
}

export const AZURE_AI_AGENTS: AzureAIAgent[] = [
  {
    id: "cultivation-expert",
    name: "Cultivation Expert Agent",
    description: "Multi-agent system for cultivation advice with RAG and tool calling",
    tools: ["web_search", "knowledge_base", "calculator", "image_analysis"],
    systemPrompt:
      "You are an expert mushroom cultivation consultant with access to Michael Crowe's knowledge base and real-time data.",
  },
  {
    id: "contamination-detector",
    name: "Contamination Detection Agent",
    description: "Specialized agent for contamination analysis using Azure Computer Vision",
    tools: ["computer_vision", "image_analysis", "knowledge_base"],
    systemPrompt:
      "You are a contamination detection specialist. Analyze images and provide detailed contamination assessments.",
  },
  {
    id: "sop-generator",
    name: "SOP Generator Agent",
    description: "Generates custom Standard Operating Procedures based on user requirements",
    tools: ["knowledge_base", "document_generation"],
    systemPrompt:
      "You are an SOP generation specialist. Create detailed, professional SOPs for mushroom cultivation processes.",
  },
]

/**
 * Get Agent by ID
 */
export function getAzureAIAgentById(id: string): AzureAIAgent | undefined {
  return AZURE_AI_AGENTS.find((agent) => agent.id === id)
}
