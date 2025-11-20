/**
 * Azure AI Foundry Client
 * Provides integration with Azure AI Studio agents and models
 */

import { getAzureAIConfig, getAzureAIAgentById } from "./azure-ai-config"

export interface AgentMessage {
  role: "user" | "assistant" | "system"
  content: string
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  id: string
  type: string
  function: {
    name: string
    arguments: string
  }
}

export interface AgentResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: AgentMessage
    finishReason: string
  }>
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Azure AI Foundry Agent Client
 */
export class AzureAIFoundryClient {
  private config: ReturnType<typeof getAzureAIConfig>

  constructor() {
    this.config = getAzureAIConfig()
  }

  /**
   * Call an Azure AI Foundry agent
   */
  async callAgent(agentId: string, messages: AgentMessage[], tools?: any[]): Promise<AgentResponse> {
    const agent = getAzureAIAgentById(agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    const url = `${this.config.aiFoundry.endpoint}/agents/${agentId}/chat/completions?api-version=2024-05-01-preview`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.config.aiFoundry.apiKey,
      },
      body: JSON.stringify({
        messages: agent.systemPrompt ? [{ role: "system", content: agent.systemPrompt }, ...messages] : messages,
        tools: tools || this.getDefaultTools(agent),
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Azure AI Foundry API error: ${error}`)
    }

    return response.json()
  }

  /**
   * Get default tools for an agent
   */
  private getDefaultTools(agent: any) {
    const tools = []

    if (agent.tools.includes("web_search")) {
      tools.push({
        type: "function",
        function: {
          name: "web_search",
          description: "Search the web for current information",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "The search query" },
            },
            required: ["query"],
          },
        },
      })
    }

    if (agent.tools.includes("knowledge_base")) {
      tools.push({
        type: "function",
        function: {
          name: "search_knowledge_base",
          description: "Search Michael Crowe's cultivation knowledge base",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "The search query" },
              top_k: { type: "number", description: "Number of results to return", default: 5 },
            },
            required: ["query"],
          },
        },
      })
    }

    if (agent.tools.includes("image_analysis")) {
      tools.push({
        type: "function",
        function: {
          name: "analyze_image",
          description: "Analyze a cultivation or contamination image using Azure Computer Vision",
          parameters: {
            type: "object",
            properties: {
              image_url: { type: "string", description: "URL of the image to analyze" },
              analysis_type: {
                type: "string",
                enum: ["contamination", "growth_stage", "species_id", "quality"],
                description: "Type of analysis to perform",
              },
            },
            required: ["image_url", "analysis_type"],
          },
        },
      })
    }

    return tools
  }

  /**
   * Execute a tool call
   */
  async executeTool(toolCall: ToolCall): Promise<any> {
    const functionName = toolCall.function.name
    const args = JSON.parse(toolCall.function.arguments)

    switch (functionName) {
      case "web_search":
        return this.webSearch(args.query)

      case "search_knowledge_base":
        return this.searchKnowledgeBase(args.query, args.top_k || 5)

      case "analyze_image":
        return this.analyzeImage(args.image_url, args.analysis_type)

      default:
        throw new Error(`Unknown tool: ${functionName}`)
    }
  }

  /**
   * Web search implementation (placeholder - integrate with Bing API or similar)
   */
  private async webSearch(query: string) {
    // TODO: Integrate with Bing Search API or Azure AI Search
    return {
      results: [
        {
          title: "Search results for: " + query,
          snippet: "Web search integration coming soon",
        },
      ],
    }
  }

  /**
   * Knowledge base search using Azure AI Search
   */
  private async searchKnowledgeBase(query: string, topK: number) {
    // TODO: Integrate with Azure AI Search / Cognitive Search
    return {
      results: [
        {
          content: "Knowledge base search results for: " + query,
          score: 0.95,
          source: "cultivation_guide.pdf",
        },
      ],
    }
  }

  /**
   * Image analysis using Azure Computer Vision
   */
  private async analyzeImage(imageUrl: string, analysisType: string) {
    const url = `${this.config.computerVision.endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Tags,Description,Objects,Color`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": this.config.computerVision.apiKey,
        },
        body: JSON.stringify({ url: imageUrl }),
      })

      if (!response.ok) {
        throw new Error(`Computer Vision API error: ${response.statusText}`)
      }

      const result = await response.json()

      return {
        analysis_type: analysisType,
        description: result.description?.captions?.[0]?.text || "No description available",
        tags: result.tags?.map((t: any) => t.name) || [],
        objects: result.objects?.map((o: any) => o.object) || [],
        confidence: result.description?.captions?.[0]?.confidence || 0,
      }
    } catch (error) {
      console.error("Image analysis error:", error)
      return { error: "Failed to analyze image" }
    }
  }
}

/**
 * Singleton instance
 */
let foundryClient: AzureAIFoundryClient | null = null

export function getAzureAIFoundryClient(): AzureAIFoundryClient {
  if (!foundryClient) {
    foundryClient = new AzureAIFoundryClient()
  }
  return foundryClient
}
