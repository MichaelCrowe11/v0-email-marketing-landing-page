/**
 * AI Chat API v2 - Enhanced with Full Orchestration
 *
 * Features:
 * - Rate limiting with Vercel KV
 * - Intelligent caching
 * - Request deduplication
 * - Automatic model fallback
 * - Retry logic with exponential backoff
 * - Token usage tracking
 * - Smart model routing
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateAIResponse, streamAIResponse } from "@/lib/ai/orchestrator"
import type { CoreMessage } from "ai"

export const runtime = "edge"
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse request
    const body = await request.json()
    const { messages, modelId, stream = false, temperature, maxTokens, enableCache = true } = body

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages array is required" }, { status: 400 })
    }

    // 3. If streaming requested, use streaming handler
    if (stream) {
      try {
        const result = await streamAIResponse({
          userId: user.id,
          modelId: modelId || "openai/gpt-4o-mini",
          messages: messages as CoreMessage[],
          temperature,
          maxTokens,
        })

        return result.toDataStreamResponse()
      } catch (error: any) {
        // Handle rate limit errors
        if (error.message.includes("Rate limit exceeded")) {
          return Response.json(
            {
              error: "Rate limit exceeded",
              message: error.message,
            },
            { status: 429 },
          )
        }

        throw error
      }
    }

    // 4. Generate response with full orchestration
    const response = await generateAIResponse({
      userId: user.id,
      modelId: modelId || "openai/gpt-4o-mini",
      messages: messages as CoreMessage[],
      temperature,
      maxTokens,
      enableCache,
      enableDedup: true,
      enableFallback: true,
    })

    // 5. Return comprehensive response
    return Response.json({
      content: response.content,
      model: response.modelUsed,
      usage: {
        inputTokens: response.tokenUsage.input,
        outputTokens: response.tokenUsage.output,
        totalTokens: response.tokenUsage.total,
      },
      cost: response.cost,
      performance: {
        latencyMs: response.latencyMs,
        cached: response.cached,
        fromDedup: response.fromDedup,
      },
      metadata: response.metadata,
    })
  } catch (error: any) {
    console.error("[AI v2] Chat error:", error)

    // Handle specific error types
    if (error.message.includes("Rate limit exceeded")) {
      return Response.json(
        {
          error: "Rate limit exceeded",
          message: error.message,
        },
        { status: 429 },
      )
    }

    return Response.json(
      {
        error: "AI request failed",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
