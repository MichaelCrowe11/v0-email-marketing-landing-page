import { kv, kvKey, KV_PREFIXES } from "@/lib/kv/client"
import { getModelById, AVAILABLE_MODELS, type ModelOption } from "@/lib/ai-models"

/**
 * Model Health Status
 */
export type ModelHealth = {
  modelId: string
  status: "healthy" | "degraded" | "down"
  lastChecked: number
  errorCount: number
  lastError?: string
}

/**
 * Fallback chain configuration
 * Maps each model to its fallback alternatives
 */
export const FALLBACK_CHAINS: Record<string, string[]> = {
  // OpenAI fallbacks
  "openai/gpt-4o": ["openai/gpt-4o-mini", "anthropic/claude-3-5-sonnet-20241022"],
  "openai/gpt-4o-mini": ["openai/gpt-4o", "anthropic/claude-3-5-haiku-20241022"],
  "openai/o1": ["openai/gpt-4o", "anthropic/claude-3-5-sonnet-20241022"],
  "openai/o3-mini": ["openai/gpt-4o-mini", "anthropic/claude-3-5-haiku-20241022"],

  // Anthropic fallbacks
  "anthropic/claude-3-5-sonnet-20241022": ["openai/gpt-4o", "google/gemini-1.5-pro-latest"],
  "anthropic/claude-3-5-haiku-20241022": ["openai/gpt-4o-mini", "google/gemini-1.5-flash"],
  "anthropic/claude-3-opus-20240229": ["anthropic/claude-3-5-sonnet-20241022", "openai/gpt-4o"],

  // Google fallbacks
  "google/gemini-2.0-flash-exp": ["google/gemini-1.5-flash", "openai/gpt-4o-mini"],
  "google/gemini-1.5-pro-latest": ["anthropic/claude-3-5-sonnet-20241022", "openai/gpt-4o"],
  "google/gemini-1.5-flash": ["openai/gpt-4o-mini", "anthropic/claude-3-5-haiku-20241022"],

  // xAI fallbacks
  "xai/grok-beta": ["openai/gpt-4o", "anthropic/claude-3-5-sonnet-20241022"],
  "xai/grok-2-1212": ["openai/gpt-4o", "anthropic/claude-3-5-sonnet-20241022"],

  // Meta Llama fallbacks
  "meta-llama/llama-3.3-70b-instruct": ["openai/gpt-4o", "anthropic/claude-3-5-sonnet-20241022"],
  "meta-llama/llama-3.1-405b-instruct": [
    "meta-llama/llama-3.3-70b-instruct",
    "anthropic/claude-3-5-sonnet-20241022",
  ],

  // Custom model fallbacks
  "crowelogic/mini": ["openai/gpt-4o-mini", "anthropic/claude-3-5-haiku-20241022"],
  "azure/crowelogic": ["openai/gpt-4o", "anthropic/claude-3-5-sonnet-20241022"],
}

/**
 * Record model error for health tracking
 */
export async function recordModelError(modelId: string, error: Error): Promise<void> {
  const key = kvKey(KV_PREFIXES.MODEL_HEALTH, modelId)

  try {
    const health = await getModelHealth(modelId)
    const newErrorCount = health.errorCount + 1

    const updatedHealth: ModelHealth = {
      modelId,
      status: newErrorCount >= 5 ? "down" : newErrorCount >= 3 ? "degraded" : "healthy",
      lastChecked: Date.now(),
      errorCount: newErrorCount,
      lastError: error.message,
    }

    // Store health status for 5 minutes
    await kv.set(key, updatedHealth, { ex: 300 })
  } catch (e) {
    console.error("[ModelHealth] Failed to record error:", e)
  }
}

/**
 * Record successful model response
 */
export async function recordModelSuccess(modelId: string): Promise<void> {
  const key = kvKey(KV_PREFIXES.MODEL_HEALTH, modelId)

  try {
    const health: ModelHealth = {
      modelId,
      status: "healthy",
      lastChecked: Date.now(),
      errorCount: 0,
    }

    await kv.set(key, health, { ex: 300 })
  } catch (e) {
    console.error("[ModelHealth] Failed to record success:", e)
  }
}

/**
 * Get model health status
 */
export async function getModelHealth(modelId: string): Promise<ModelHealth> {
  const key = kvKey(KV_PREFIXES.MODEL_HEALTH, modelId)

  try {
    const health = await kv.get<ModelHealth>(key)
    if (health) return health
  } catch (e) {
    console.error("[ModelHealth] Failed to get health:", e)
  }

  // Default to healthy
  return {
    modelId,
    status: "healthy",
    lastChecked: Date.now(),
    errorCount: 0,
  }
}

/**
 * Get fallback model for a given model ID
 */
export async function getFallbackModel(modelId: string): Promise<string | null> {
  const fallbacks = FALLBACK_CHAINS[modelId]
  if (!fallbacks || fallbacks.length === 0) {
    return null
  }

  // Try each fallback in order, checking health status
  for (const fallbackId of fallbacks) {
    const health = await getModelHealth(fallbackId)
    if (health.status !== "down") {
      return fallbackId
    }
  }

  // If all fallbacks are down, return first fallback anyway
  return fallbacks[0]
}

/**
 * Get best available model from a list of options
 * Considers health status and returns the first healthy model
 */
export async function getBestAvailableModel(modelIds: string[]): Promise<string> {
  for (const modelId of modelIds) {
    const health = await getModelHealth(modelId)
    if (health.status !== "down") {
      return modelId
    }
  }

  // If all are down, return first anyway
  return modelIds[0]
}

/**
 * Get similar models based on capabilities and price range
 * Useful for automatic fallback suggestions
 */
export function getSimilarModels(modelId: string): string[] {
  const model = getModelById(modelId)
  if (!model) return []

  const similar = AVAILABLE_MODELS.filter((m) => {
    // Skip the same model
    if (m.id === modelId) return false

    // Check if capabilities overlap
    const hasCommonCapabilities = m.capabilities.some((cap) => model.capabilities.includes(cap))
    if (!hasCommonCapabilities) return false

    // Check if price is within 3x range
    const priceDiff = Math.abs(m.costPer1MInputTokens - model.costPer1MInputTokens)
    const maxPrice = Math.max(m.costPer1MInputTokens, model.costPer1MInputTokens)
    const priceRatio = priceDiff / maxPrice
    if (priceRatio > 3) return false

    return true
  })

  // Sort by price similarity
  return similar
    .sort((a, b) => {
      const aDiff = Math.abs(a.costPer1MInputTokens - model.costPer1MInputTokens)
      const bDiff = Math.abs(b.costPer1MInputTokens - model.costPer1MInputTokens)
      return aDiff - bDiff
    })
    .map((m) => m.id)
    .slice(0, 3) // Return top 3 similar models
}

/**
 * Reset model health (admin function)
 */
export async function resetModelHealth(modelId: string): Promise<void> {
  const key = kvKey(KV_PREFIXES.MODEL_HEALTH, modelId)
  await kv.del(key)
}

/**
 * Get all model health statuses
 */
export async function getAllModelHealth(): Promise<ModelHealth[]> {
  const keys = await kv.keys(`${KV_PREFIXES.MODEL_HEALTH}*`)
  if (keys.length === 0) return []

  const healthData = await kv.mget<ModelHealth[]>(...keys)
  return healthData.filter((h): h is ModelHealth => h !== null)
}
