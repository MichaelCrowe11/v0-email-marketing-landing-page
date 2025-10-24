import { createClient } from "@/lib/supabase/server"

export type SubscriptionTier = "free" | "pro" | "expert"

export interface SubscriptionFeatures {
  unlimited_chat: boolean
  crowe_vision: boolean
  forum_access: boolean
  knowledge_base: boolean
  environmental_monitoring: boolean
  species_library: boolean
  sops_access: boolean
  priority_support: boolean
  gpt_modules: boolean
  consulting_calls: boolean
  early_access: boolean
}

const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    unlimited_chat: false,
    crowe_vision: false,
    forum_access: true,
    knowledge_base: true,
    environmental_monitoring: false,
    species_library: true,
    sops_access: false,
    priority_support: false,
    gpt_modules: false,
    consulting_calls: false,
    early_access: false,
  },
  pro: {
    unlimited_chat: true,
    crowe_vision: true,
    forum_access: true,
    knowledge_base: true,
    environmental_monitoring: true,
    species_library: true,
    sops_access: true,
    priority_support: false,
    gpt_modules: false,
    consulting_calls: false,
    early_access: false,
  },
  expert: {
    unlimited_chat: true,
    crowe_vision: true,
    forum_access: true,
    knowledge_base: true,
    environmental_monitoring: true,
    species_library: true,
    sops_access: true,
    priority_support: true,
    gpt_modules: true,
    consulting_calls: true,
    early_access: true,
  },
}

export async function getUserSubscription() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      tier: "free" as SubscriptionTier,
      status: "inactive",
      features: TIER_FEATURES.free,
    }
  }

  const { data: userData } = await supabase
    .from("users")
    .select("subscription_tier, subscription_status")
    .eq("id", user.id)
    .single()

  const tier = (userData?.subscription_tier || "free") as SubscriptionTier
  const status = userData?.subscription_status || "inactive"

  return {
    tier,
    status,
    features: TIER_FEATURES[tier],
  }
}

export async function hasFeatureAccess(feature: keyof SubscriptionFeatures): Promise<boolean> {
  const subscription = await getUserSubscription()
  return subscription.features[feature]
}

export async function requireFeatureAccess(feature: keyof SubscriptionFeatures) {
  const hasAccess = await hasFeatureAccess(feature)

  if (!hasAccess) {
    throw new Error(`This feature requires a subscription. Please upgrade your plan.`)
  }

  return true
}
