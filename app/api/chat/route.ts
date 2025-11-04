export const maxDuration = 30

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API called")

    const { messages, model, agent = "deepparallel", images = [], includeReasoning = false } = await req.json()

    // Determine which Azure resource to use based on agent
    const useO1Model = agent === "o1"
    const useDeepSeekModel = agent === "deepseek"

    let azureEndpoint: string | undefined
    let azureApiKey: string | undefined
    let azureDeployment: string | undefined
    let azureApiVersion: string

    if (useO1Model) {
      azureEndpoint = process.env.AZURE_OPENAI_NOVA_ENDPOINT
      azureApiKey = process.env.AZURE_OPENAI_NOVA_API_KEY
      azureDeployment = process.env.AZURE_OPENAI_NOVA_DEPLOYMENT_NAME
      azureApiVersion = process.env.AZURE_OPENAI_NOVA_API_VERSION || "2024-12-01-preview"
    } else if (useDeepSeekModel) {
      azureEndpoint = process.env.AZURE_OPENAI_MICHAEL_ENDPOINT
      azureApiKey = process.env.AZURE_OPENAI_MICHAEL_API_KEY
      azureDeployment = process.env.AZURE_OPENAI_MICHAEL_DEEPSEEK_DEPLOYMENT
      azureApiVersion = process.env.AZURE_OPENAI_MICHAEL_API_VERSION || "2024-08-01-preview"
    } else {
      azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT
      azureApiKey = process.env.AZURE_OPENAI_API_KEY
      azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME
      azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview"
    }

    if (!azureEndpoint || !azureApiKey || !azureDeployment) {
      console.error(`[v0] Azure OpenAI configuration missing for ${useO1Model ? 'O1 model' : 'standard model'}. Ensure environment variables are set.`)
      return new Response(
        JSON.stringify({
          error: `Azure OpenAI configuration is incomplete for ${useO1Model ? 'O1 model' : 'standard model'}`,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

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

    const allowedModelNames = new Set(
      [
        "",
        azureDeployment,
        `azure/${azureDeployment}`,
        "crowelogic",
        "crowelogic/default",
        "crowelogic/trained",
        process.env.AZURE_OPENAI_MODEL_ALIAS || "",
      ].filter(Boolean),
    )

    const requestedModel = typeof model === "string" ? model.trim() : ""

    if (requestedModel && !allowedModelNames.has(requestedModel)) {
      console.error("[v0] Unsupported model requested:", requestedModel)
      return new Response(
        JSON.stringify({
          error: "Unsupported model. This deployment only allows the configured Azure OpenAI model.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const apiUrl = `${azureEndpoint}/openai/deployments/${azureDeployment}/chat/completions?api-version=${encodeURIComponent(
      azureApiVersion,
    )}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "api-key": azureApiKey,
    }

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

      o1: `You are Crowe Logic Reasoning Engine, an advanced deep-reasoning AI agent powered by proprietary Crowe Logic technology, specialized in extended analytical thinking and complex problem-solving.

Built on 20+ years of commercial experience and advanced AI research, you represent the pinnacle of Crowe Logic's AI capabilities.

Your capabilities:
- Extended reasoning and chain-of-thought analysis (deep multi-step thinking)
- Complex mathematical, logical, and algorithmic problem solving
- Advanced code generation with comprehensive system understanding
- Research-level analysis and scientific reasoning
- Multi-step strategic planning and architectural design
- Abstract conceptualization and systematic thinking
- Expert-level debugging and optimization
- Sophisticated software architecture and design patterns

Approach:
- Engage in extended reasoning before providing answers—think deeply through problems
- Break down complex challenges into logical, sequential steps
- Provide detailed explanations of your reasoning process with transparency
- Consider edge cases, alternative solutions, and potential pitfalls
- Offer comprehensive, well-reasoned responses backed by sound logic
- Balance depth of analysis with clarity of communication
- Apply Crowe Logic's proprietary expertise and best practices
- Write production-ready code with enterprise-grade quality
- Think like a senior architect, not just a code generator

Specialties:
- Complex algorithm design and optimization
- System architecture and scalability planning
- Advanced debugging and root cause analysis
- Research-oriented development workflows
- Multi-step problem decomposition
- Strategic technical decision-making`,

      deepseek: `You are Crowe Code, Crowe Logic's high-performance code generation AI agent, specialized in rapid development and efficient problem-solving.

Built on 20+ years of Crowe Logic expertise and advanced AI technology, you represent the perfect balance of speed, quality, and cost-effectiveness.

Your capabilities:
- Lightning-fast code generation across all major languages
- Rapid prototyping and feature development
- Quick bug fixes and code optimization
- Efficient refactoring and code modernization
- High-speed algorithm implementation
- Fast iteration on ideas and solutions
- Multi-language expertise (Python, TypeScript, JavaScript, React, Node.js, Go, Rust)
- Long-context code understanding

Approach:
- Generate clean, production-ready code quickly
- Write efficient, maintainable solutions
- Provide clear, concise explanations
- Focus on practical, working implementations
- Balance speed with code quality
- Follow best practices and design patterns
- Optimize for developer productivity
- Ship code fast without sacrificing quality

Specialties:
- Rapid full-stack development
- Quick API and endpoint creation
- Fast UI component generation
- Efficient database query optimization
- Speed-focused algorithm implementation
- High-velocity bug fixing and debugging
- Rapid code refactoring
- Fast integration of third-party services

Your motto: "Code at the speed of thought - fast, clean, production-ready."`,
    }

    // O1 model requires different parameters
    let requestBody: any

    if (useO1Model) {
      // O1 uses developer messages instead of system messages
      // and has specific temperature/token requirements
      const developerMessage = {
        role: "developer" as const,
        content: agentPrompts[agent as keyof typeof agentPrompts] || agentPrompts.o1,
      }

      requestBody = {
        messages: [developerMessage, ...normalizedMessages],
        max_completion_tokens: 4000,
        stream: true,
      }
    } else {
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

      requestBody = {
        messages: [systemMessage, ...normalizedMessages],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      let errorDetails: string | undefined
      try {
        const errorBody = await response.text()
        errorDetails = errorBody
        console.error("[v0] Azure OpenAI API error body:", errorBody)
      } catch (err) {
        console.error("[v0] Failed to read Azure OpenAI error body:", err)
      }

      return new Response(
        JSON.stringify({
          error: "Azure OpenAI request failed",
          details: errorDetails,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      )
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
