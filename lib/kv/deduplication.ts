import { kv, kvKey, KV_PREFIXES } from "./client"
import crypto from "crypto"

/**
 * Request deduplication prevents duplicate requests from being processed
 * when users accidentally submit the same request multiple times
 */

export type DedupConfig = {
  windowMs: number // How long to consider a request a duplicate
  returnCachedResult?: boolean // Return cached result if request is duplicate
}

export const DEFAULT_DEDUP_CONFIG: DedupConfig = {
  windowMs: 5000, // 5 seconds
  returnCachedResult: true,
}

export type RequestFingerprint = {
  userId: string
  prompt: string
  modelId: string
  timestamp: number
}

export type DedupResult<T = any> = {
  isDuplicate: boolean
  requestId: string
  existingResult?: T
  shouldWait?: boolean // If true, should wait for in-flight request
}

/**
 * Generate unique request ID from fingerprint
 */
export function generateRequestId(fingerprint: RequestFingerprint): string {
  const data = `${fingerprint.userId}:${fingerprint.prompt}:${fingerprint.modelId}`
  return crypto.createHash("sha256").update(data).digest("hex")
}

/**
 * Check if request is a duplicate
 */
export async function checkDuplicate<T = any>(
  fingerprint: RequestFingerprint,
  config: DedupConfig = DEFAULT_DEDUP_CONFIG,
): Promise<DedupResult<T>> {
  const requestId = generateRequestId(fingerprint)
  const key = kvKey(KV_PREFIXES.REQUEST_DEDUP, requestId)

  try {
    // Check if request exists
    const existing = await kv.get<{ status: "pending" | "completed"; result?: T; timestamp: number }>(key)

    if (!existing) {
      // Not a duplicate - register this request as pending
      await kv.set(
        key,
        {
          status: "pending",
          timestamp: Date.now(),
        },
        { px: config.windowMs },
      )

      return {
        isDuplicate: false,
        requestId,
      }
    }

    // Check if window has expired
    const age = Date.now() - existing.timestamp
    if (age > config.windowMs) {
      // Window expired - treat as new request
      await kv.set(
        key,
        {
          status: "pending",
          timestamp: Date.now(),
        },
        { px: config.windowMs },
      )

      return {
        isDuplicate: false,
        requestId,
      }
    }

    // Is a duplicate
    if (existing.status === "completed" && config.returnCachedResult && existing.result) {
      return {
        isDuplicate: true,
        requestId,
        existingResult: existing.result,
      }
    }

    // Request is still in flight
    return {
      isDuplicate: true,
      requestId,
      shouldWait: true,
    }
  } catch (error) {
    console.error("[Dedup] Error checking duplicate:", error)
    // Fail open - allow request
    return {
      isDuplicate: false,
      requestId,
    }
  }
}

/**
 * Mark request as completed with result
 */
export async function completeRequest<T = any>(
  requestId: string,
  result: T,
  ttlMs = DEFAULT_DEDUP_CONFIG.windowMs,
): Promise<void> {
  const key = kvKey(KV_PREFIXES.REQUEST_DEDUP, requestId)

  try {
    await kv.set(
      key,
      {
        status: "completed",
        result,
        timestamp: Date.now(),
      },
      { px: ttlMs },
    )
  } catch (error) {
    console.error("[Dedup] Error completing request:", error)
  }
}

/**
 * Cancel/remove a pending request
 */
export async function cancelRequest(requestId: string): Promise<void> {
  const key = kvKey(KV_PREFIXES.REQUEST_DEDUP, requestId)

  try {
    await kv.del(key)
  } catch (error) {
    console.error("[Dedup] Error canceling request:", error)
  }
}

/**
 * Wait for in-flight request to complete
 */
export async function waitForRequest<T = any>(
  requestId: string,
  timeoutMs = 30000,
  pollIntervalMs = 500,
): Promise<T | null> {
  const key = kvKey(KV_PREFIXES.REQUEST_DEDUP, requestId)
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutMs) {
    try {
      const data = await kv.get<{ status: "pending" | "completed"; result?: T }>(key)

      if (!data) {
        // Request removed or expired
        return null
      }

      if (data.status === "completed" && data.result) {
        return data.result
      }

      // Still pending, wait and retry
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    } catch (error) {
      console.error("[Dedup] Error waiting for request:", error)
      return null
    }
  }

  // Timeout
  return null
}

/**
 * Deduplicated request executor
 * Wraps an async operation with automatic deduplication
 */
export async function executeDeduplicated<T>(
  fingerprint: RequestFingerprint,
  operation: () => Promise<T>,
  config: DedupConfig = DEFAULT_DEDUP_CONFIG,
): Promise<{ result: T; fromCache: boolean }> {
  const dedupCheck = await checkDuplicate<T>(fingerprint, config)

  // If duplicate and we have cached result, return it
  if (dedupCheck.isDuplicate && dedupCheck.existingResult) {
    return {
      result: dedupCheck.existingResult,
      fromCache: true,
    }
  }

  // If duplicate and should wait, wait for in-flight request
  if (dedupCheck.isDuplicate && dedupCheck.shouldWait) {
    console.log("[Dedup] Waiting for in-flight request:", dedupCheck.requestId)
    const result = await waitForRequest<T>(dedupCheck.requestId)

    if (result) {
      return {
        result,
        fromCache: true,
      }
    }

    // Timeout or error - fall through to execute operation
  }

  // Execute operation
  try {
    const result = await operation()

    // Store result for potential duplicates
    await completeRequest(dedupCheck.requestId, result, config.windowMs)

    return {
      result,
      fromCache: false,
    }
  } catch (error) {
    // Remove pending request on error
    await cancelRequest(dedupCheck.requestId)
    throw error
  }
}

/**
 * Get deduplication statistics
 */
export async function getDedupStats(): Promise<{
  pendingRequests: number
  completedRequests: number
  totalRequests: number
}> {
  try {
    const keys = await kv.keys(`${KV_PREFIXES.REQUEST_DEDUP}*`)
    if (keys.length === 0) {
      return { pendingRequests: 0, completedRequests: 0, totalRequests: 0 }
    }

    const data = await kv.mget<Array<{ status: "pending" | "completed" }>>(...keys)

    const pending = data.filter((d) => d?.status === "pending").length
    const completed = data.filter((d) => d?.status === "completed").length

    return {
      pendingRequests: pending,
      completedRequests: completed,
      totalRequests: keys.length,
    }
  } catch (error) {
    console.error("[Dedup] Error getting stats:", error)
    return { pendingRequests: 0, completedRequests: 0, totalRequests: 0 }
  }
}

/**
 * Clear all deduplication data (admin function)
 */
export async function clearAllDedup(): Promise<void> {
  try {
    const keys = await kv.keys(`${KV_PREFIXES.REQUEST_DEDUP}*`)
    if (keys.length > 0) {
      await kv.del(...keys)
    }
  } catch (error) {
    console.error("[Dedup] Error clearing dedup data:", error)
  }
}
