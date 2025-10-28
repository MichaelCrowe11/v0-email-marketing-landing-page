import { kv, kvKey, KV_PREFIXES } from "./client"
import crypto from "crypto"

/**
 * Cache Configuration
 */
export type CacheConfig = {
  ttl: number // Time to live in seconds
  enableSemanticMatch?: boolean // Enable fuzzy matching for similar queries
  namespace?: string // Cache namespace for organization
}

/**
 * Default cache TTLs for different types of content
 */
export const CACHE_TTL = {
  AI_RESPONSE_SHORT: 300, // 5 minutes - for time-sensitive queries
  AI_RESPONSE_MEDIUM: 1800, // 30 minutes - general queries
  AI_RESPONSE_LONG: 3600, // 1 hour - factual/stable content
  AI_RESPONSE_VERY_LONG: 86400, // 24 hours - reference content
  MODEL_METADATA: 3600, // 1 hour
  USER_PREFERENCES: 1800, // 30 minutes
} as const

/**
 * Cached AI Response
 */
export type CachedResponse = {
  content: string
  modelId: string
  timestamp: number
  tokenUsage?: {
    input: number
    output: number
    cost: number
  }
  metadata?: Record<string, any>
}

/**
 * Generate cache key from prompt and model
 */
export function generateCacheKey(prompt: string, modelId: string, namespace = "default"): string {
  // Create deterministic hash of prompt + model
  const hash = crypto.createHash("sha256").update(`${prompt}:${modelId}`).digest("hex")
  return kvKey(KV_PREFIXES.CACHE, namespace, hash)
}

/**
 * Generate semantic cache key (normalized for similarity matching)
 */
export function generateSemanticKey(prompt: string): string {
  // Normalize prompt: lowercase, remove extra spaces, trim
  const normalized = prompt.toLowerCase().trim().replace(/\s+/g, " ")

  // For semantic matching, we'll also create a shorter hash
  // that groups similar queries together
  const words = normalized.split(" ")
  const keyWords = words.slice(0, 10).join(" ") // Use first 10 words as key

  return crypto.createHash("md5").update(keyWords).digest("hex").substring(0, 16)
}

/**
 * Cache AI response
 */
export async function cacheResponse(
  prompt: string,
  modelId: string,
  response: CachedResponse,
  config: CacheConfig = { ttl: CACHE_TTL.AI_RESPONSE_MEDIUM },
): Promise<void> {
  const key = generateCacheKey(prompt, modelId, config.namespace)

  try {
    await kv.set(key, response, { ex: config.ttl })

    // Also store semantic key mapping for fuzzy matching
    if (config.enableSemanticMatch) {
      const semanticKey = generateSemanticKey(prompt)
      const semanticMapKey = kvKey(KV_PREFIXES.CACHE, config.namespace || "default", "semantic", semanticKey)

      // Store mapping from semantic key to actual cache key
      const existing = (await kv.get<string[]>(semanticMapKey)) || []
      if (!existing.includes(key)) {
        await kv.set(semanticMapKey, [...existing, key], { ex: config.ttl })
      }
    }
  } catch (error) {
    console.error("[Cache] Failed to cache response:", error)
  }
}

/**
 * Get cached AI response
 */
export async function getCachedResponse(
  prompt: string,
  modelId: string,
  namespace = "default",
): Promise<CachedResponse | null> {
  const key = generateCacheKey(prompt, modelId, namespace)

  try {
    const cached = await kv.get<CachedResponse>(key)
    return cached
  } catch (error) {
    console.error("[Cache] Failed to get cached response:", error)
    return null
  }
}

/**
 * Get semantically similar cached response
 * Useful for finding cached responses to similar queries
 */
export async function getSemanticallySimilarResponse(
  prompt: string,
  modelId: string,
  namespace = "default",
): Promise<CachedResponse | null> {
  try {
    const semanticKey = generateSemanticKey(prompt)
    const semanticMapKey = kvKey(KV_PREFIXES.CACHE, namespace, "semantic", semanticKey)

    // Get all cache keys for this semantic cluster
    const cacheKeys = await kv.get<string[]>(semanticMapKey)
    if (!cacheKeys || cacheKeys.length === 0) return null

    // Try to get responses from cache keys
    const responses = await kv.mget<CachedResponse[]>(...cacheKeys)

    // Return first valid response for matching model
    for (const response of responses) {
      if (response && response.modelId === modelId) {
        return response
      }
    }

    return null
  } catch (error) {
    console.error("[Cache] Failed to get semantic match:", error)
    return null
  }
}

/**
 * Invalidate cache for a specific prompt/model
 */
export async function invalidateCache(prompt: string, modelId: string, namespace = "default"): Promise<void> {
  const key = generateCacheKey(prompt, modelId, namespace)
  try {
    await kv.del(key)
  } catch (error) {
    console.error("[Cache] Failed to invalidate cache:", error)
  }
}

/**
 * Invalidate all caches in a namespace
 */
export async function invalidateNamespace(namespace: string): Promise<void> {
  try {
    const pattern = kvKey(KV_PREFIXES.CACHE, namespace, "*")
    const keys = await kv.keys(pattern)
    if (keys.length > 0) {
      await kv.del(...keys)
    }
  } catch (error) {
    console.error("[Cache] Failed to invalidate namespace:", error)
  }
}

/**
 * Get cache statistics for a namespace
 */
export async function getCacheStats(namespace = "default"): Promise<{
  totalKeys: number
  semanticKeys: number
  estimatedSize: number
}> {
  try {
    const pattern = kvKey(KV_PREFIXES.CACHE, namespace, "*")
    const keys = await kv.keys(pattern)

    const semanticPattern = kvKey(KV_PREFIXES.CACHE, namespace, "semantic", "*")
    const semanticKeys = await kv.keys(semanticPattern)

    return {
      totalKeys: keys.length,
      semanticKeys: semanticKeys.length,
      estimatedSize: keys.length - semanticKeys.length, // Actual cached responses
    }
  } catch (error) {
    console.error("[Cache] Failed to get cache stats:", error)
    return { totalKeys: 0, semanticKeys: 0, estimatedSize: 0 }
  }
}

/**
 * Warmup cache with common queries (batch operation)
 */
export async function warmupCache(
  queries: Array<{ prompt: string; modelId: string; response: CachedResponse }>,
  config: CacheConfig = { ttl: CACHE_TTL.AI_RESPONSE_LONG },
): Promise<void> {
  try {
    const operations = queries.map(({ prompt, modelId, response }) =>
      cacheResponse(prompt, modelId, response, config),
    )
    await Promise.all(operations)
  } catch (error) {
    console.error("[Cache] Failed to warmup cache:", error)
  }
}

/**
 * Check if a query should be cached based on characteristics
 */
export function shouldCacheQuery(prompt: string, modelId: string): { cache: boolean; ttl: number } {
  const promptLower = prompt.toLowerCase()

  // Don't cache time-sensitive queries
  if (
    promptLower.includes("today") ||
    promptLower.includes("now") ||
    promptLower.includes("current") ||
    promptLower.includes("latest") ||
    promptLower.includes("recent")
  ) {
    return { cache: true, ttl: CACHE_TTL.AI_RESPONSE_SHORT }
  }

  // Long cache for factual/reference queries
  if (
    promptLower.includes("what is") ||
    promptLower.includes("define") ||
    promptLower.includes("explain") ||
    promptLower.includes("how to")
  ) {
    return { cache: true, ttl: CACHE_TTL.AI_RESPONSE_VERY_LONG }
  }

  // Don't cache user-specific or personalized queries
  if (promptLower.includes("my ") || promptLower.includes("i ") || promptLower.includes("for me")) {
    return { cache: false, ttl: 0 }
  }

  // Default: medium cache
  return { cache: true, ttl: CACHE_TTL.AI_RESPONSE_MEDIUM }
}
