/**
 * Usage Tracking & Rate Limiting
 * 
 * Track API usage and enforce rate limits based on user tier
 */

export type UserTier = 'free' | 'basic' | 'pro' | 'enterprise'

export interface UsageLimits {
  messagesPerDay: number
  imagesPerDay: number
  voiceMinutesPerDay: number
  reasoningTracesPerDay: number
}

export const TIER_LIMITS: Record<UserTier, UsageLimits> = {
  free: {
    messagesPerDay: 10,
    imagesPerDay: 0,
    voiceMinutesPerDay: 0,
    reasoningTracesPerDay: 0,
  },
  basic: {
    messagesPerDay: 100,
    imagesPerDay: 5,
    voiceMinutesPerDay: 30,
    reasoningTracesPerDay: 20,
  },
  pro: {
    messagesPerDay: -1, // unlimited
    imagesPerDay: -1,
    voiceMinutesPerDay: -1,
    reasoningTracesPerDay: -1,
  },
  enterprise: {
    messagesPerDay: -1,
    imagesPerDay: -1,
    voiceMinutesPerDay: -1,
    reasoningTracesPerDay: -1,
  },
}

export interface UsageRecord {
  userId: string
  tier: UserTier
  date: string // YYYY-MM-DD
  messagesUsed: number
  imagesUsed: number
  voiceMinutesUsed: number
  reasoningTracesUsed: number
}

/**
 * Check if user has exceeded their daily limits
 */
export function checkUsageLimit(
  usage: UsageRecord,
  type: keyof UsageLimits
): { allowed: boolean; remaining: number; limit: number } {
  const limits = TIER_LIMITS[usage.tier]
  const limit = limits[type]
  
  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1 }
  }

  const usedKey = `${type.replace('PerDay', 'Used')}` as keyof UsageRecord
  const used = usage[usedKey] as number
  const remaining = Math.max(0, limit - used)
  const allowed = used < limit

  return { allowed, remaining, limit }
}

/**
 * Get user's current tier (placeholder - implement with actual auth)
 */
export async function getUserTier(userId: string): Promise<UserTier> {
  // TODO: Implement actual tier lookup from database
  // For now, return 'free' as default
  return 'free'
}

/**
 * Track usage for a user
 */
export async function trackUsage(
  userId: string,
  type: keyof UsageLimits,
  amount: number = 1
): Promise<void> {
  // TODO: Implement actual usage tracking in database
  console.log(`[Usage] User ${userId} used ${amount} ${type}`)
}

/**
 * Get usage statistics for a user
 */
export async function getUsageStats(userId: string, date: string): Promise<UsageRecord> {
  // TODO: Implement actual usage retrieval from database
  const tier = await getUserTier(userId)
  
  return {
    userId,
    tier,
    date,
    messagesUsed: 0,
    imagesUsed: 0,
    voiceMinutesUsed: 0,
    reasoningTracesUsed: 0,
  }
}

/**
 * Calculate cost for a user's usage
 */
export function calculateCost(usage: UsageRecord): number {
  // Azure OpenAI costs (approximate)
  const MESSAGE_COST = 0.0015 // per message
  const IMAGE_COST = 0.01 // per image analysis
  const VOICE_COST = 0.006 // per minute
  const REASONING_COST = 0.002 // per trace

  return (
    usage.messagesUsed * MESSAGE_COST +
    usage.imagesUsed * IMAGE_COST +
    usage.voiceMinutesUsed * VOICE_COST +
    usage.reasoningTracesUsed * REASONING_COST
  )
}

/**
 * Get tier pricing
 */
export const TIER_PRICING: Record<UserTier, number> = {
  free: 0,
  basic: 9.99,
  pro: 29.99,
  enterprise: 99.99,
}

/**
 * Calculate profit margin for a tier
 */
export function calculateMargin(tier: UserTier, monthlyUsage: UsageRecord): number {
  const revenue = TIER_PRICING[tier]
  const cost = calculateCost(monthlyUsage) * 30 // monthly cost
  const profit = revenue - cost
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0

  return margin
}
