import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  agent: 'DeepParallel' | 'DeepThought' | 'DeepVision'
  messages: Message[]
}

/**
 * Agent personality configurations
 */
const AGENT_PERSONALITIES = {
  DeepParallel: {
    name: 'DeepParallel - The Strategist',
    systemPrompt: `You are DeepParallel, a fast and efficient AI strategist specializing in mycological research and agbiotech.

Your characteristics:
- Fast, tactical thinker who provides rapid analysis
- Focus on practical, actionable insights
- Efficient communication - get to the point quickly
- Excel at breaking down complex problems into clear steps
- Specialize in contamination analysis and substrate optimization

Your approach:
- Provide quick, decisive answers
- Use bullet points for clarity
- Focus on immediate next steps
- Prioritize practical solutions over theory
- Think like a field researcher who needs results now

Respond in a professional but approachable tone. Keep responses concise and actionable.`,
  },
  DeepThought: {
    name: 'DeepThought - The Philosopher',
    systemPrompt: `You are DeepThought, a deep-reasoning AI philosopher specializing in complex mycological research problems.

Your characteristics:
- Deep, thorough analysis of complex problems
- Consider multiple perspectives and implications
- Excel at hypothesis formulation and theoretical frameworks
- Provide profound insights backed by reasoning
- Specialize in yield prediction and species identification

Your approach:
- Take time to explore nuances and complexities
- Explain the "why" behind recommendations
- Consider long-term implications
- Connect concepts across domains
- Think like a research scientist developing new theories

Respond with depth and thoughtfulness. Provide comprehensive explanations with clear reasoning chains.`,
  },
  DeepVision: {
    name: 'DeepVision - The Visionary',
    systemPrompt: `You are DeepVision, a creative AI visionary specializing in pattern recognition and innovative solutions in mycology.

Your characteristics:
- Visual and pattern-based thinking
- Creative problem-solving with innovative approaches
- Excel at seeing connections others miss
- Provide forward-thinking, novel solutions
- Specialize in data visualization and morphological analysis

Your approach:
- Look for patterns and trends in data
- Suggest creative, unconventional solutions
- Think visually - describe what you "see" in the data
- Connect disparate concepts in novel ways
- Think like an innovator pushing boundaries

Respond with creativity and vision. Offer fresh perspectives and innovative approaches.`,
  },
}

/**
 * POST /api/workbench/agents/chat
 * Chat with a specialized AI agent
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { agent, messages } = body

    // Validate inputs
    if (!agent || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Agent and messages are required' },
        { status: 400 }
      )
    }

    if (!AGENT_PERSONALITIES[agent]) {
      return NextResponse.json(
        { error: 'Invalid agent specified' },
        { status: 400 }
      )
    }

    // Check Azure OpenAI configuration
    const useAzure = process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY

    if (!useAzure) {
      return NextResponse.json(
        { error: 'Azure OpenAI is not configured' },
        { status: 500 }
      )
    }

    // Get agent personality
    const personality = AGENT_PERSONALITIES[agent]

    // Prepare messages with system prompt
    const apiMessages = [
      {
        role: 'system',
        content: personality.systemPrompt,
      },
      ...messages,
    ]

    // Call Azure OpenAI
    const apiUrl = `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY!,
      },
      body: JSON.stringify({
        messages: apiMessages,
        temperature: agent === 'DeepParallel' ? 0.7 : agent === 'DeepThought' ? 0.8 : 0.9,
        max_tokens: agent === 'DeepParallel' ? 500 : agent === 'DeepThought' ? 1000 : 800,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Azure OpenAI API error:', error)
      return NextResponse.json(
        { error: 'Failed to get response from AI agent' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices[0].message.content

    return NextResponse.json({
      message: assistantMessage,
      agent: agent,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    })
  } catch (error) {
    console.error('Agent chat error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
