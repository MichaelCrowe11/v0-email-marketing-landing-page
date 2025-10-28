/**
 * AI Orchestrator
 *
 * Unified interface for AI model access with:
 * - Automatic retry with exponential backoff
 * - Model fallback for resilience
 * - Response caching
 * - Request deduplication
 * - Rate limiting
 * - Token usage tracking
 * - Health monitoring
 */

import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { generateText, streamText, type CoreMessage } from "ai"
import { getModelById, calculateCost, type ModelOption } from "@/lib/ai-models"
import { checkRateLimit, getUserTier } from "@/lib/kv/rate-limit"
import {
  getCachedResponse,
  cacheResponse,
  shouldCacheQuery,
  type CachedResponse,
  getSemanticallySimilarResponse,
} from "@/lib/kv/cache"
import { executeDeduplicated, type RequestFingerprint } from "@/lib/kv/deduplication"
import {
  retryWithBackoff,
  retryWithFallback,
  MODEL_RETRY_CONFIGS,
  DEFAULT_RETRY_CONFIG,
} from "./retry"
import {
  getFallbackModel,
  recordModelError,
  recordModelSuccess,
  getModelHealth,
  type ModelHealth,
} from "./fallback"
import { trackTokenUsage, type TokenUsageMetrics } from "./observability"

/**
 * AI Request Configuration
 */
export type AIRequestConfig = {
  userId: string
  modelId: string
  messages: CoreMessage[]
  stream?: boolean
  temperature?: number
  maxTokens?: number
  enableCache?: boolean
  enableDedup?: boolean
  enableFallback?: boolean
  namespace?: string
}

/**
 * AI Response
 */
export type AIResponse = {
  content: string
  modelUsed: string
  tokenUsage: {
    input: number
    output: number
    total: number
  }
  cost: number
  cached: boolean
  fromDedup: boolean
  latencyMs: number
  metadata?: {
    fallbackUsed?: boolean
    retryAttempts?: number
    health?: ModelHealth
  }
}

/**
 * Get the appropriate AI SDK model instance
 */
function getModelInstance(modelId: string) {
  // OpenAI models
  if (modelId.startsWith("openai/") || modelId.startsWith("crowelogic/") || modelId.startsWith("xai/")) {
    const modelName = modelId.includes("/") ? modelId.split("/")[1] : modelId
    return openai(modelName === "mini" ? "gpt-4o-mini" : modelName)
  }

  // Anthropic models
  if (modelId.startsWith("anthropic/")) {
    const modelName = modelId.replace("anthropic/", "")
    return anthropic(modelName)
  }

  // Google models
  if (modelId.startsWith("google/")) {
    const modelName = modelId.replace("google/", "")
    return google(modelName)
  }

  // Default fallback
  return openai("gpt-4o-mini")
}

/**
 * Generate AI response (non-streaming)
 */
export async function generateAIResponse(config: AIRequestConfig): Promise<AIResponse> {
  const startTime = Date.now()

  // 1. Check rate limit
  const tier = await getUserTier(config.userId)
  const rateLimitResult = await checkRateLimit(config.userId, tier, config.modelId)

  if (!rateLimitResult.allowed) {
    throw new Error(
      `Rate limit exceeded. Please try again in ${rateLimitResult.retryAfter} seconds. Remaining: ${rateLimitResult.remaining}`,
    )
  }

  // 2. Build prompt from messages
  const lastMessage = config.messages[config.messages.length - 1]
  const prompt = typeof lastMessage.content === "string" ? lastMessage.content : ""

  // 3. Check cache (if enabled)
  if (config.enableCache !== false) {
    const cacheDecision = shouldCacheQuery(prompt, config.modelId)

    if (cacheDecision.cache) {
      const cached = await getCachedResponse(prompt, config.modelId, config.namespace)

      if (cached) {
        return {
          content: cached.content,
          modelUsed: cached.modelId,
          tokenUsage: {
            input: cached.tokenUsage?.input || 0,
            output: cached.tokenUsage?.output || 0,
            total: (cached.tokenUsage?.input || 0) + (cached.tokenUsage?.output || 0),
          },
          cost: cached.tokenUsage?.cost || 0,
          cached: true,
          fromDedup: false,
          latencyMs: Date.now() - startTime,
        }
      }

      // Try semantic cache
      const semanticCached = await getSemanticallySimilarResponse(prompt, config.modelId, config.namespace)
      if (semanticCached) {
        return {
          content: semanticCached.content,
          modelUsed: semanticCached.modelId,
          tokenUsage: {
            input: semanticCached.tokenUsage?.input || 0,
            output: semanticCached.tokenUsage?.output || 0,
            total: (semanticCached.tokenUsage?.input || 0) + (semanticCached.tokenUsage?.output || 0),
          },
          cost: semanticCached.tokenUsage?.cost || 0,
          cached: true,
          fromDedup: false,
          latencyMs: Date.now() - startTime,
        }
      }
    }
  }

  // 4. Execute with deduplication (if enabled)
  const executeRequest = async (modelId: string) => {
    const model = getModelInstance(modelId)
    const retryConfig = MODEL_RETRY_CONFIGS[modelId] || DEFAULT_RETRY_CONFIG

    const result = await retryWithBackoff(
      async () => {
        try {
          const response = await generateText({
            model,
            messages: config.messages,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
          })

          return response
        } catch (error) {
          // Record error for health tracking
          await recordModelError(modelId, error instanceof Error ? error : new Error(String(error)))
          throw error
        }
      },
      {
        ...retryConfig,
        onRetry: (attempt, error, delay) => {
          console.log(`[AI] Retry ${attempt} for ${modelId} after ${delay}ms:`, error.message)
        },
      },
    )

    if (!result.success) {
      throw result.error
    }

    return result.data!
  }

  let response: Awaited<ReturnType<typeof generateText>>
  let modelUsed = config.modelId
  let fallbackUsed = false
  let fromDedup = false

  if (config.enableDedup !== false) {
    const fingerprint: RequestFingerprint = {
      userId: config.userId,
      prompt,
      modelId: config.modelId,
      timestamp: Date.now(),
    }

    const dedupResult = await executeDeduplicated(fingerprint, () => executeRequest(config.modelId))

    response = dedupResult.result
    fromDedup = dedupResult.fromCache
  } else {
    // Try with fallback if enabled
    if (config.enableFallback !== false) {
      const fallbackId = await getFallbackModel(config.modelId)
      const fallbacks = fallbackId ? [fallbackId] : []

      const fallbackResult = await retryWithFallback(executeRequest, config.modelId, fallbacks)

      if (!fallbackResult.success) {
        throw fallbackResult.error
      }

      response = fallbackResult.data!
      modelUsed = fallbackResult.modelUsed || config.modelId
      fallbackUsed = modelUsed !== config.modelId
    } else {
      response = await executeRequest(config.modelId)
    }
  }

  // Record success
  await recordModelSuccess(modelUsed)

  // Calculate cost
  const tokenUsage = {
    input: response.usage.promptTokens,
    output: response.usage.completionTokens,
    total: response.usage.totalTokens,
  }

  const costInfo = calculateCost(tokenUsage.input, tokenUsage.output, modelUsed)

  // Track usage
  await trackTokenUsage({
    userId: config.userId,
    modelId: modelUsed,
    inputTokens: tokenUsage.input,
    outputTokens: tokenUsage.output,
    cost: costInfo.userCharge,
    timestamp: Date.now(),
    cached: false,
    latencyMs: Date.now() - startTime,
  })

  // Cache response if appropriate
  if (config.enableCache !== false) {
    const cacheDecision = shouldCacheQuery(prompt, modelUsed)
    if (cacheDecision.cache) {
      const cachedResponse: CachedResponse = {
        content: response.text,
        modelId: modelUsed,
        timestamp: Date.now(),
        tokenUsage: {
          input: tokenUsage.input,
          output: tokenUsage.output,
          cost: costInfo.userCharge,
        },
      }

      await cacheResponse(prompt, modelUsed, cachedResponse, {
        ttl: cacheDecision.ttl,
        enableSemanticMatch: true,
        namespace: config.namespace,
      })
    }
  }

  // Get health for metadata
  const health = await getModelHealth(modelUsed)

  return {
    content: response.text,
    modelUsed,
    tokenUsage,
    cost: costInfo.userCharge,
    cached: false,
    fromDedup,
    latencyMs: Date.now() - startTime,
    metadata: {
      fallbackUsed,
      health,
    },
  }
}

/**
 * Stream AI response
 */
export async function streamAIResponse(config: AIRequestConfig) {
  // Similar checks as generateAIResponse
  const tier = await getUserTier(config.userId)
  const rateLimitResult = await checkRateLimit(config.userId, tier, config.modelId)

  if (!rateLimitResult.allowed) {
    throw new Error(`Rate limit exceeded. Please try again in ${rateLimitResult.retryAfter} seconds.`)
  }

  const model = getModelInstance(config.modelId)

  const result = await streamText({
    model,
    messages: config.messages,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
  })

  return result
}

/**
 * Batch generate responses for multiple prompts
 */
export async function batchGenerate(
  configs: AIRequestConfig[],
  concurrency = 5,
): Promise<Array<AIResponse | Error>> {
  const results: Array<AIResponse | Error> = []

  // Process in batches
  for (let i = 0; i < configs.length; i += concurrency) {
    const batch = configs.slice(i, i + concurrency)
    const batchResults = await Promise.allSettled(batch.map((config) => generateAIResponse(config)))

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value)
      } else {
        results.push(result.reason)
      }
    }
  }

  return results
}
