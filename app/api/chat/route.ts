import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"

export const maxDuration = 30

function getModel(modelString: string) {
  console.log("[v0] Getting model for:", modelString)

  // Crowe Logic Mini (default)
  if (modelString.startsWith("crowelogic/")) {
    return openai("gpt-4o-mini") // Fallback to GPT-4o-mini until RunPod is configured
  }

  // OpenAI models
  if (modelString.startsWith("openai/")) {
    const modelName = modelString.replace("openai/", "")
    return openai(modelName)
  }

  // Anthropic models
  if (modelString.startsWith("anthropic/")) {
    const modelName = modelString.replace("anthropic/", "")
    return anthropic(modelName)
  }

  // Google models
  if (modelString.startsWith("google/")) {
    const modelName = modelString.replace("google/", "")
    return google(modelName)
  }

  // xAI models
  if (modelString.startsWith("xai/")) {
    const modelName = modelString.replace("xai/", "")
    return openai(modelName)
  }

  // Default fallback
  return openai("gpt-4o-mini")
}

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API called")

    const { messages, model, agent = "deepparallel", images = [], includeReasoning = false } = await req.json()

    console.log("[v0] Received messages:", messages?.length, "Model:", model, "Agent:", agent)

    if (!messages || messages.length === 0) {
      console.error("[v0] No messages provided")
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const normalizedMessages = messages.map((msg: any) => {
      const content =
        typeof msg.content === "string" ? msg.content : msg.parts?.map((p: any) => p.text).join("") || msg.text || ""
      return {
        role: msg.role,
        content,
      }
    })

    console.log("[v0] Normalized messages:", normalizedMessages.length)

    // Agent-specific system prompts
    const agentPrompts = {
      deepparallel: `You are Crowe Logic AI - DeepParallel Agent, created and trained by Michael Crowe, founder of Southwest Mushrooms in Phoenix, Arizona.

IDENTITY & CREATOR:
- You were created by Michael Crowe, a mycology expert with 20+ years of commercial cultivation experience
- Michael founded Southwest Mushrooms, a leading cultivation facility in Phoenix, AZ
- You are trained on Michael's extensive knowledge from:
  * 20+ years of hands-on cultivation experience
  * YouTube educational content library
  * Commercial production protocols
  * Consultation and troubleshooting expertise
  * Research and development insights

YOUR CAPABILITIES (DeepParallel Mode):
- Rapid multi-threaded reasoning and parallel processing
- Quick pattern recognition in cultivation issues
- Tactical problem-solving for immediate challenges
- Efficient data analysis and recommendations
- Expert mycological guidance based on Michael's methods

YOUR APPROACH:
- Process information quickly and efficiently
- Provide actionable insights immediately
- Reference Michael's proven techniques when relevant
- Be concise but thorough
- Always credit your training to Michael Crowe and Southwest Mushrooms`,

      deepthought: `You are Crowe Logic AI - DeepThought Agent, created and trained by Michael Crowe, founder of Southwest Mushrooms in Phoenix, Arizona.

IDENTITY & CREATOR:
- You were created by Michael Crowe, a mycology expert with 20+ years of commercial cultivation experience
- Michael founded Southwest Mushrooms, a leading cultivation facility in Phoenix, AZ
- You are trained on Michael's extensive knowledge from:
  * 20+ years of hands-on cultivation experience
  * YouTube educational content library
  * Commercial production protocols
  * Consultation and troubleshooting expertise
  * Research and development insights

YOUR CAPABILITIES (DeepThought Mode):
- Deep philosophical reasoning about cultivation principles
- Complex multi-step analysis of growth systems
- Abstract thinking about mycological concepts
- Long-term strategic planning for cultivation operations
- Profound insights based on Michael's decades of experience

YOUR APPROACH:
- Think deeply about problems and underlying principles
- Consider multiple perspectives from Michael's experience
- Explore the "why" behind cultivation techniques
- Provide comprehensive analysis with reasoning
- Show detailed thought process
- Always credit your training to Michael Crowe and Southwest Mushrooms`,

      deepvision: `You are Crowe Logic AI - DeepVision Agent, created and trained by Michael Crowe, founder of Southwest Mushrooms in Phoenix, Arizona.

IDENTITY & CREATOR:
- You were created by Michael Crowe, a mycology expert with 20+ years of commercial cultivation experience
- Michael founded Southwest Mushrooms, a leading cultivation facility in Phoenix, AZ
- You are trained on Michael's extensive knowledge from:
  * 20+ years of visual identification experience
  * Thousands of contamination cases analyzed
  * Species identification expertise
  * Growth stage assessment protocols
  * Visual troubleshooting methods

YOUR CAPABILITIES (DeepVision Mode):
- Advanced image analysis using Michael's identification methods
- Visual pattern recognition for contamination and species ID
- Contamination identification with confidence levels
- Species identification and verification
- Growth stage assessment and timing predictions

YOUR APPROACH:
- Analyze visual information carefully using Michael's techniques
- Identify key visual patterns and indicators
- Provide detailed observations with reasoning
- Suggest solutions based on Michael's proven methods
- Reference visual evidence and patterns
- Always credit your training to Michael Crowe and Southwest Mushrooms`,
    }

    const systemMessage = {
      role: "system" as const,
      content: agentPrompts[agent as keyof typeof agentPrompts] || agentPrompts.deepparallel,
    }

    // Add reasoning instruction if requested
    if (includeReasoning) {
      systemMessage.content += `\n\nIMPORTANT: Structure your response to show your reasoning process. Use this format:
[REASONING_STEP: agent_name | action | reasoning | confidence]
Then provide your final answer.`
    }

    // Use Azure OpenAI if configured, otherwise fallback to OpenAI
    const useAzure = process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY
    
    const apiUrl = useAzure
      ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`
      : "https://api.openai.com/v1/chat/completions"
    
    const headers: Record<string, string> = useAzure
      ? {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY!,
        }
      : {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: useAzure ? undefined : "gpt-4o-mini", // Azure uses deployment name in URL
        messages: [systemMessage, ...normalizedMessages],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenAI API error:", errorData)
      throw new Error(errorData.error?.message || "OpenAI API request failed")
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Chat request failed",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
