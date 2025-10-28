import { kv } from "@vercel/kv"

/**
 * Vercel KV Client
 *
 * Provides distributed caching and rate limiting for AI operations.
 *
 * Setup instructions:
 * 1. Go to https://vercel.com/dashboard/stores
 * 2. Create a new KV store
 * 3. Link it to your project
 * 4. Environment variables will be automatically added
 */

export { kv }

// KV key prefixes for organization
export const KV_PREFIXES = {
  RATE_LIMIT: "ratelimit:",
  CACHE: "cache:",
  REQUEST_DEDUP: "dedup:",
  TOKEN_USAGE: "tokens:",
  MODEL_HEALTH: "health:",
} as const

/**
 * Helper to generate namespaced KV keys
 */
export function kvKey(prefix: string, ...parts: string[]): string {
  return `${prefix}${parts.join(":")}`
}
