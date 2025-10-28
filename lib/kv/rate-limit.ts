import { kv, kvKey, KV_PREFIXES } from "./client"
import { getModelById, type ModelOption } from "@/lib/ai-models"

/**
 * Rate Limit Configuration
 */
export type RateLimitConfig = {
  maxRequests: number // Maximum requests in window
  windowMs: number // Time window in milliseconds
  penaltyMs?: number // Lockout period after exceeding limit
}

/**
 * Rate limit tiers based on subscription level
 */
export const RATE_LIMIT_TIERS = {
  free: {
    maxRequests: 10,
    windowMs: 60000, // 1 minute
    penaltyMs: 300000, // 5 minutes
  },
  pro: {
    maxRequests: 50,
    windowMs: 60000, // 1 minute
    penaltyMs: 60000, // 1 minute
  },
  expert: {
    maxRequests: 200,
    windowMs: 60000, // 1 minute
    penaltyMs: 30000, // 30 seconds
  },
  master: {
    maxRequests: 1000,
    windowMs: 60000, // 1 minute
    penaltyMs: 0, // No penalty
  },
} as const

/**
 * Per-model rate limits (for expensive/high-demand models)
 */
export const MODEL_RATE_LIMITS: Record<string, RateLimitConfig> = {
  "openai/o1": {
    maxRequests: 5,
    windowMs: 60000,
    penaltyMs: 120000,
  },
  "openai/gpt-4o": {
    maxRequests: 20,
    windowMs: 60000,
  },
  "anthropic/claude-3-opus-20240229": {
    maxRequests: 10,
    windowMs: 60000,
  },
  "anthropic/claude-3-5-sonnet-20241022": {
    maxRequests: 30,
    windowMs: 60000,
  },
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number // seconds
}

/**
 * Check and enforce rate limit for a user
 */
export async function checkRateLimit(
  userId: string,
  tier: keyof typeof RATE_LIMIT_TIERS = "free",
  modelId?: string,
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_TIERS[tier]
  const now = Date.now()

  // Check if user is in penalty/lockout period
  if (config.penaltyMs && config.penaltyMs > 0) {
    const penaltyKey = kvKey(KV_PREFIXES.RATE_LIMIT, userId, "penalty")
    const penaltyUntil = await kv.get<number>(penaltyKey)

    if (penaltyUntil && now < penaltyUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: penaltyUntil,
        retryAfter: Math.ceil((penaltyUntil - now) / 1000),
      }
    }
  }

  // Check per-model rate limit if specified
  if (modelId && MODEL_RATE_LIMITS[modelId]) {
    const modelResult = await checkModelRateLimit(userId, modelId)
    if (!modelResult.allowed) {
      return modelResult
    }
  }

  const key = kvKey(KV_PREFIXES.RATE_LIMIT, userId, tier)

  try {
    // Get current count
    const current = (await kv.get<number>(key)) || 0

    // Calculate reset time
    const ttl = await kv.ttl(key)
    const resetAt = ttl > 0 ? now + ttl * 1000 : now + config.windowMs

    if (current >= config.maxRequests) {
      // Rate limit exceeded - set penalty if configured
      if (config.penaltyMs && config.penaltyMs > 0) {
        const penaltyKey = kvKey(KV_PREFIXES.RATE_LIMIT, userId, "penalty")
        const penaltyUntil = now + config.penaltyMs
        await kv.set(penaltyKey, penaltyUntil, { px: config.penaltyMs })

        return {
          allowed: false,
          remaining: 0,
          resetAt: penaltyUntil,
          retryAfter: Math.ceil(config.penaltyMs / 1000),
        }
      }

      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter: Math.ceil((resetAt - now) / 1000),
      }
    }

    // Increment counter
    if (current === 0) {
      // First request in window
      await kv.set(key, 1, { px: config.windowMs })
    } else {
      await kv.incr(key)
    }

    return {
      allowed: true,
      remaining: config.maxRequests - (current + 1),
      resetAt,
    }
  } catch (error) {
    console.error("[RateLimit] Error checking rate limit:", error)
    // Fail open - allow request if KV is down
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
    }
  }
}

/**
 * Check per-model rate limit
 */
async function checkModelRateLimit(userId: string, modelId: string): Promise<RateLimitResult> {
  const config = MODEL_RATE_LIMITS[modelId]
  if (!config) {
    return {
      allowed: true,
      remaining: 999,
      resetAt: Date.now() + 60000,
    }
  }

  const key = kvKey(KV_PREFIXES.RATE_LIMIT, userId, "model", modelId)
  const now = Date.now()

  try {
    const current = (await kv.get<number>(key)) || 0
    const ttl = await kv.ttl(key)
    const resetAt = ttl > 0 ? now + ttl * 1000 : now + config.windowMs

    if (current >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter: Math.ceil((resetAt - now) / 1000),
      }
    }

    if (current === 0) {
      await kv.set(key, 1, { px: config.windowMs })
    } else {
      await kv.incr(key)
    }

    return {
      allowed: true,
      remaining: config.maxRequests - (current + 1),
      resetAt,
    }
  } catch (error) {
    console.error("[RateLimit] Error checking model rate limit:", error)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
    }
  }
}

/**
 * Get user's subscription tier from database
 * This should integrate with your Stripe subscription logic
 */
export async function getUserTier(userId: string): Promise<keyof typeof RATE_LIMIT_TIERS> {
  // TODO: Integrate with your Supabase subscription query
  // For now, return 'free' as default
  return "free"
}

/**
 * Reset rate limit for a user (admin function)
 */
export async function resetRateLimit(userId: string): Promise<void> {
  const keys = await kv.keys(`${KV_PREFIXES.RATE_LIMIT}${userId}:*`)
  if (keys.length > 0) {
    await kv.del(...keys)
  }
}
