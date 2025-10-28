/**
 * AI Observability & Monitoring
 *
 * Tracks token usage, costs, performance, and errors for AI operations
 */

import { kv, kvKey, KV_PREFIXES } from "@/lib/kv/client"

/**
 * Token usage event
 */
export type TokenUsageMetrics = {
  userId: string
  modelId: string
  inputTokens: number
  outputTokens: number
  cost: number
  timestamp: number
  cached: boolean
  latencyMs: number
  metadata?: Record<string, any>
}

/**
 * Aggregated usage stats
 */
export type UsageStats = {
  totalRequests: number
  totalTokens: number
  totalCost: number
  avgLatency: number
  cacheHitRate: number
  errorRate: number
  byModel: Record<
    string,
    {
      requests: number
      tokens: number
      cost: number
      avgLatency: number
    }
  >
}

/**
 * Track token usage for a request
 */
export async function trackTokenUsage(metrics: TokenUsageMetrics): Promise<void> {
  const now = Date.now()
  const dayKey = new Date(now).toISOString().split("T")[0] // YYYY-MM-DD

  try {
    // Store individual event (for recent history)
    const eventKey = kvKey(KV_PREFIXES.TOKEN_USAGE, metrics.userId, "events", `${now}`)
    await kv.set(eventKey, metrics, { ex: 86400 }) // Keep for 24 hours

    // Update daily aggregates
    await updateDailyAggregates(metrics, dayKey)

    // Update user totals
    await updateUserTotals(metrics)

    // Update model stats
    await updateModelStats(metrics)
  } catch (error) {
    console.error("[Observability] Failed to track token usage:", error)
  }
}

/**
 * Update daily aggregate statistics
 */
async function updateDailyAggregates(metrics: TokenUsageMetrics, dayKey: string): Promise<void> {
  const aggKey = kvKey(KV_PREFIXES.TOKEN_USAGE, "daily", dayKey)

  try {
    const current = (await kv.get<UsageStats>(aggKey)) || {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      avgLatency: 0,
      cacheHitRate: 0,
      errorRate: 0,
      byModel: {},
    }

    // Update totals
    current.totalRequests++
    current.totalTokens += metrics.inputTokens + metrics.outputTokens
    current.totalCost += metrics.cost

    // Update average latency (rolling average)
    current.avgLatency = (current.avgLatency * (current.totalRequests - 1) + metrics.latencyMs) / current.totalRequests

    // Update cache hit rate
    const cachedRequests = metrics.cached ? 1 : 0
    current.cacheHitRate =
      ((current.cacheHitRate * (current.totalRequests - 1)) / current.totalRequests) * (current.totalRequests - 1) +
      cachedRequests

    // Update model stats
    if (!current.byModel[metrics.modelId]) {
      current.byModel[metrics.modelId] = {
        requests: 0,
        tokens: 0,
        cost: 0,
        avgLatency: 0,
      }
    }

    const modelStats = current.byModel[metrics.modelId]
    modelStats.requests++
    modelStats.tokens += metrics.inputTokens + metrics.outputTokens
    modelStats.cost += metrics.cost
    modelStats.avgLatency = (modelStats.avgLatency * (modelStats.requests - 1) + metrics.latencyMs) / modelStats.requests

    // Store updated aggregates (keep for 90 days)
    await kv.set(aggKey, current, { ex: 7776000 })
  } catch (error) {
    console.error("[Observability] Failed to update daily aggregates:", error)
  }
}

/**
 * Update user totals
 */
async function updateUserTotals(metrics: TokenUsageMetrics): Promise<void> {
  const userKey = kvKey(KV_PREFIXES.TOKEN_USAGE, metrics.userId, "totals")

  try {
    const current = (await kv.get<{
      totalRequests: number
      totalTokens: number
      totalCost: number
      lastUsed: number
    }>(userKey)) || {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      lastUsed: 0,
    }

    current.totalRequests++
    current.totalTokens += metrics.inputTokens + metrics.outputTokens
    current.totalCost += metrics.cost
    current.lastUsed = metrics.timestamp

    // Keep user totals for 1 year
    await kv.set(userKey, current, { ex: 31536000 })
  } catch (error) {
    console.error("[Observability] Failed to update user totals:", error)
  }
}

/**
 * Update model performance stats
 */
async function updateModelStats(metrics: TokenUsageMetrics): Promise<void> {
  const modelKey = kvKey(KV_PREFIXES.TOKEN_USAGE, "models", metrics.modelId)

  try {
    const current = (await kv.get<{
      totalRequests: number
      totalTokens: number
      totalCost: number
      avgLatency: number
      p95Latency: number
      p99Latency: number
      lastUsed: number
      latencyHistory: number[] // Keep last 100 latencies for percentile calculation
    }>(modelKey)) || {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      avgLatency: 0,
      p95Latency: 0,
      p99Latency: 0,
      lastUsed: 0,
      latencyHistory: [],
    }

    current.totalRequests++
    current.totalTokens += metrics.inputTokens + metrics.outputTokens
    current.totalCost += metrics.cost
    current.lastUsed = metrics.timestamp

    // Update latency stats
    current.avgLatency = (current.avgLatency * (current.totalRequests - 1) + metrics.latencyMs) / current.totalRequests

    // Update latency history (keep last 100)
    current.latencyHistory.push(metrics.latencyMs)
    if (current.latencyHistory.length > 100) {
      current.latencyHistory.shift()
    }

    // Calculate percentiles
    const sorted = [...current.latencyHistory].sort((a, b) => a - b)
    current.p95Latency = sorted[Math.floor(sorted.length * 0.95)] || 0
    current.p99Latency = sorted[Math.floor(sorted.length * 0.99)] || 0

    // Keep model stats for 90 days
    await kv.set(modelKey, current, { ex: 7776000 })
  } catch (error) {
    console.error("[Observability] Failed to update model stats:", error)
  }
}

/**
 * Get user usage statistics
 */
export async function getUserUsage(userId: string): Promise<{
  totalRequests: number
  totalTokens: number
  totalCost: number
  lastUsed: number
  recentEvents: TokenUsageMetrics[]
} | null> {
  try {
    const totalsKey = kvKey(KV_PREFIXES.TOKEN_USAGE, userId, "totals")
    const totals = await kv.get<{
      totalRequests: number
      totalTokens: number
      totalCost: number
      lastUsed: number
    }>(totalsKey)

    if (!totals) return null

    // Get recent events
    const eventPattern = kvKey(KV_PREFIXES.TOKEN_USAGE, userId, "events", "*")
    const eventKeys = await kv.keys(eventPattern)

    let recentEvents: TokenUsageMetrics[] = []
    if (eventKeys.length > 0) {
      // Get last 20 events
      const sortedKeys = eventKeys.sort().reverse().slice(0, 20)
      const events = await kv.mget<TokenUsageMetrics[]>(...sortedKeys)
      recentEvents = events.filter((e): e is TokenUsageMetrics => e !== null)
    }

    return {
      ...totals,
      recentEvents,
    }
  } catch (error) {
    console.error("[Observability] Failed to get user usage:", error)
    return null
  }
}

/**
 * Get daily statistics
 */
export async function getDailyStats(date?: string): Promise<UsageStats | null> {
  const dayKey = date || new Date().toISOString().split("T")[0]
  const aggKey = kvKey(KV_PREFIXES.TOKEN_USAGE, "daily", dayKey)

  try {
    const stats = await kv.get<UsageStats>(aggKey)
    return stats
  } catch (error) {
    console.error("[Observability] Failed to get daily stats:", error)
    return null
  }
}

/**
 * Get model performance statistics
 */
export async function getModelStats(modelId: string): Promise<{
  totalRequests: number
  totalTokens: number
  totalCost: number
  avgLatency: number
  p95Latency: number
  p99Latency: number
  lastUsed: number
} | null> {
  const modelKey = kvKey(KV_PREFIXES.TOKEN_USAGE, "models", modelId)

  try {
    const stats = await kv.get<{
      totalRequests: number
      totalTokens: number
      totalCost: number
      avgLatency: number
      p95Latency: number
      p99Latency: number
      lastUsed: number
    }>(modelKey)

    return stats
  } catch (error) {
    console.error("[Observability] Failed to get model stats:", error)
    return null
  }
}

/**
 * Get all model statistics
 */
export async function getAllModelStats(): Promise<
  Record<
    string,
    {
      totalRequests: number
      totalTokens: number
      totalCost: number
      avgLatency: number
      p95Latency: number
      p99Latency: number
    }
  >
> {
  try {
    const pattern = kvKey(KV_PREFIXES.TOKEN_USAGE, "models", "*")
    const keys = await kv.keys(pattern)

    if (keys.length === 0) return {}

    const stats = await kv.mget<
      Array<{
        totalRequests: number
        totalTokens: number
        totalCost: number
        avgLatency: number
        p95Latency: number
        p99Latency: number
      }>
    >(...keys)

    const result: Record<string, any> = {}
    keys.forEach((key, i) => {
      if (stats[i]) {
        // Extract model ID from key
        const modelId = key.split(":").pop()
        if (modelId) {
          result[modelId] = stats[i]
        }
      }
    })

    return result
  } catch (error) {
    console.error("[Observability] Failed to get all model stats:", error)
    return {}
  }
}

/**
 * Get historical stats for date range
 */
export async function getHistoricalStats(startDate: string, endDate: string): Promise<Record<string, UsageStats>> {
  const result: Record<string, UsageStats> = {}

  try {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const days: string[] = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().split("T")[0])
    }

    // Fetch all days in parallel
    const statsPromises = days.map((day) => getDailyStats(day))
    const statsResults = await Promise.all(statsPromises)

    days.forEach((day, i) => {
      if (statsResults[i]) {
        result[day] = statsResults[i]!
      }
    })
  } catch (error) {
    console.error("[Observability] Failed to get historical stats:", error)
  }

  return result
}

/**
 * Export user data (for GDPR compliance)
 */
export async function exportUserData(userId: string): Promise<{
  totals: any
  events: TokenUsageMetrics[]
}> {
  try {
    const totalsKey = kvKey(KV_PREFIXES.TOKEN_USAGE, userId, "totals")
    const totals = await kv.get(totalsKey)

    const eventPattern = kvKey(KV_PREFIXES.TOKEN_USAGE, userId, "events", "*")
    const eventKeys = await kv.keys(eventPattern)

    let events: TokenUsageMetrics[] = []
    if (eventKeys.length > 0) {
      const eventData = await kv.mget<TokenUsageMetrics[]>(...eventKeys)
      events = eventData.filter((e): e is TokenUsageMetrics => e !== null)
    }

    return { totals, events }
  } catch (error) {
    console.error("[Observability] Failed to export user data:", error)
    return { totals: null, events: [] }
  }
}

/**
 * Delete user data (for GDPR compliance)
 */
export async function deleteUserData(userId: string): Promise<void> {
  try {
    // Delete totals
    const totalsKey = kvKey(KV_PREFIXES.TOKEN_USAGE, userId, "totals")
    await kv.del(totalsKey)

    // Delete all events
    const eventPattern = kvKey(KV_PREFIXES.TOKEN_USAGE, userId, "events", "*")
    const eventKeys = await kv.keys(eventPattern)
    if (eventKeys.length > 0) {
      await kv.del(...eventKeys)
    }
  } catch (error) {
    console.error("[Observability] Failed to delete user data:", error)
  }
}
