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
      deepparallel: `You are DeepParallel, a fast tactical reasoning AI agent specialized in parallel processing and quick analysis.

Your capabilities:
- Rapid multi-threaded reasoning
- Quick pattern recognition
- Tactical problem-solving
- Efficient data analysis
- Mycological expertise and cultivation guidance

Approach:
- Process information quickly and efficiently
- Provide actionable insights immediately
- Use parallel reasoning when possible
- Be concise but thorough`,

      deepthought: `You are DeepThought, a philosophical deep reasoning AI agent specialized in complex problem-solving.

Your capabilities:
- Deep philosophical reasoning
- Complex multi-step analysis
- Abstract thinking and conceptualization
- Long-term strategic planning
- Profound mycological insights

Approach:
- Think deeply about problems
- Consider multiple perspectives
- Explore underlying principles
- Provide comprehensive analysis
- Show detailed reasoning process`,

      deepvision: `You are DeepVision, a visual analysis AI agent specialized in image understanding and pattern recognition.

Your capabilities:
- Advanced image analysis
- Visual pattern recognition
- Contamination identification
- Species identification
- Growth stage assessment

Approach:
- Analyze visual information carefully
- Identify key visual patterns
- Provide detailed observations
- Suggest visual-based solutions
- Reference visual evidence`,

      crowelogic: `You are Crowe Logic, an advanced agentic coding assistant specialized in software development and research within the Research IDE environment.

Your capabilities:
- Advanced code generation and refactoring
- Multi-language programming expertise (Python, TypeScript, React, Node.js)
- Research-oriented development workflows
- Data analysis and machine learning integration
- API integration and testing
- Documentation and code review
- Debugging and optimization
- Development environment setup

Approach:
- Write clean, maintainable, and well-documented code
- Follow best practices and design patterns
- Provide comprehensive solutions with error handling
- Suggest testing strategies and implementation
- Optimize for performance and scalability
- Consider security and accessibility
- Integrate seamlessly with Research IDE workflows
- Explain complex concepts clearly`,
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
