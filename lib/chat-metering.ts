import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const DAILY_FREE_MESSAGES = 10

export async function getChatQuota(userId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  // Get or create usage quota
  const { data: quota, error } = await supabase.from("usage_quotas").select("*").eq("user_id", userId).single()

  if (error || !quota) {
    // Create new quota record
    const { data: newQuota } = await supabase
      .from("usage_quotas")
      .insert({
        user_id: userId,
        chat_messages_quota: DAILY_FREE_MESSAGES,
        chat_messages_used: 0,
        quota_reset_at: getNextResetTime(),
      })
      .select()
      .single()

    return {
      quota: DAILY_FREE_MESSAGES,
      used: 0,
      remaining: DAILY_FREE_MESSAGES,
      resetAt: getNextResetTime(),
    }
  }

  // Check if quota needs reset
  const now = new Date()
  const resetAt = new Date(quota.quota_reset_at)

  if (now >= resetAt) {
    // Reset quota
    const { data: updatedQuota } = await supabase
      .from("usage_quotas")
      .update({
        chat_messages_used: 0,
        quota_reset_at: getNextResetTime(),
      })
      .eq("user_id", userId)
      .select()
      .single()

    return {
      quota: quota.chat_messages_quota || DAILY_FREE_MESSAGES,
      used: 0,
      remaining: quota.chat_messages_quota || DAILY_FREE_MESSAGES,
      resetAt: getNextResetTime(),
    }
  }

  return {
    quota: quota.chat_messages_quota || DAILY_FREE_MESSAGES,
    used: quota.chat_messages_used || 0,
    remaining: (quota.chat_messages_quota || DAILY_FREE_MESSAGES) - (quota.chat_messages_used || 0),
    resetAt: quota.quota_reset_at,
  }
}

export async function incrementChatUsage(userId: string): Promise<boolean> {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  const quota = await getChatQuota(userId)

  if (quota.remaining <= 0) {
    return false // No quota remaining
  }

  await supabase
    .from("usage_quotas")
    .update({
      chat_messages_used: quota.used + 1,
    })
    .eq("user_id", userId)

  return true
}

function getNextResetTime(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow.toISOString()
}
