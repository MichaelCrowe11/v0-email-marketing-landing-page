"use server"

import { createClient } from "@/lib/supabase/server"

export type FeatureType = "chat" | "crowe_vision" | "video_studio" | "gpt_module" | "api_call"

interface UsageQuota {
  chat_messages_quota: number
  chat_messages_used: number
  crowe_vision_quota: number
  crowe_vision_used: number
  video_studio_quota: number
  video_studio_used: number
  gpt_modules_quota: number
  gpt_modules_used: number
  quota_reset_at: string
}

/**
 * Check if user has quota available for a feature
 * Returns true if user has quota or unlimited access (-1)
 */
export async function checkQuota(featureType: FeatureType): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data: quota } = await supabase.from("usage_quotas").select("*").eq("user_id", user.id).single()

  if (!quota) return false

  // Check if quota needs reset
  if (new Date(quota.quota_reset_at) <= new Date()) {
    await resetQuota(user.id)
    return true
  }

  // Map feature type to quota fields
  const quotaMap: Record<FeatureType, { quota: keyof UsageQuota; used: keyof UsageQuota }> = {
    chat: { quota: "chat_messages_quota", used: "chat_messages_used" },
    crowe_vision: { quota: "crowe_vision_quota", used: "crowe_vision_used" },
    video_studio: { quota: "video_studio_quota", used: "video_studio_used" },
    gpt_module: { quota: "gpt_modules_quota", used: "gpt_modules_used" },
    api_call: { quota: "chat_messages_quota", used: "chat_messages_used" }, // Use chat quota for API calls
  }

  const { quota: quotaField, used: usedField } = quotaMap[featureType]
  const quotaLimit = quota[quotaField] as number
  const quotaUsed = quota[usedField] as number

  // -1 means unlimited
  if (quotaLimit === -1) return true

  return quotaUsed < quotaLimit
}

/**
 * Track usage for a feature and increment the counter
 */
export async function trackUsage(
  featureType: FeatureType,
  metadata: Record<string, any> = {},
  tokensUsed = 0,
  costUsd = 0,
): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  // Check quota first
  const hasQuota = await checkQuota(featureType)
  if (!hasQuota) {
    throw new Error(`Quota exceeded for ${featureType}. Please upgrade your plan.`)
  }

  // Log the usage
  await supabase.from("api_usage_logs").insert({
    user_id: user.id,
    feature_type: featureType,
    tokens_used: tokensUsed,
    cost_usd: costUsd,
    metadata,
  })

  // Increment usage counter
  const quotaMap: Record<FeatureType, string> = {
    chat: "chat_messages_used",
    crowe_vision: "crowe_vision_used",
    video_studio: "video_studio_used",
    gpt_module: "gpt_modules_used",
    api_call: "chat_messages_used",
  }

  const usedField = quotaMap[featureType]

  await supabase.rpc("increment_usage", {
    p_user_id: user.id,
    p_field: usedField,
  })

  return true
}

/**
 * Get current usage stats for a user
 */
export async function getUsageStats() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: quota } = await supabase.from("usage_quotas").select("*").eq("user_id", user.id).single()

  if (!quota) return null

  // Check if quota needs reset
  if (new Date(quota.quota_reset_at) <= new Date()) {
    await resetQuota(user.id)
    return getUsageStats() // Recursively get fresh stats
  }

  return {
    chat: {
      used: quota.chat_messages_used,
      quota: quota.chat_messages_quota,
      unlimited: quota.chat_messages_quota === -1,
    },
    croweVision: {
      used: quota.crowe_vision_used,
      quota: quota.crowe_vision_quota,
      unlimited: quota.crowe_vision_quota === -1,
    },
    videoStudio: {
      used: quota.video_studio_used,
      quota: quota.video_studio_quota,
      unlimited: quota.video_studio_quota === -1,
    },
    gptModules: {
      used: quota.gpt_modules_used,
      quota: quota.gpt_modules_quota,
      unlimited: quota.gpt_modules_quota === -1,
    },
    resetAt: quota.quota_reset_at,
  }
}

/**
 * Reset quota for a user (called automatically when quota_reset_at is reached)
 */
async function resetQuota(userId: string) {
  const supabase = await createClient()

  await supabase
    .from("usage_quotas")
    .update({
      chat_messages_used: 0,
      crowe_vision_used: 0,
      video_studio_used: 0,
      gpt_modules_used: 0,
      quota_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
}

/**
 * Get usage history for analytics
 */
export async function getUsageHistory(days = 30) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: logs } = await supabase
    .from("api_usage_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: false })

  return logs || []
}
