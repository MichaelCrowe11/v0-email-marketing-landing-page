import { createClient } from '@/lib/azure/client'

export type SubscriptionTier = "free" | "pro" | "expert" | "master"

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
  white_label: boolean
  multi_facility: boolean
  team_collaboration: boolean
  api_access: boolean
  dedicated_manager: boolean
  custom_sop_creation: boolean
  quarterly_consultation: boolean
}

const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    unlimited_chat: false,
    crowe_vision: true,
    forum_access: true,
    knowledge_base: true,
    environmental_monitoring: false,
    species_library: true,
    sops_access: false,
    priority_support: false,
    gpt_modules: false,
    consulting_calls: false,
    early_access: false,
    white_label: false,
    multi_facility: false,
    team_collaboration: false,
    api_access: false,
    dedicated_manager: false,
    custom_sop_creation: false,
    quarterly_consultation: false,
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
    white_label: false,
    multi_facility: false,
    team_collaboration: false,
    api_access: false,
    dedicated_manager: false,
    custom_sop_creation: false,
    quarterly_consultation: false,
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
    white_label: false,
    multi_facility: false,
    team_collaboration: false,
    api_access: false,
    dedicated_manager: false,
    custom_sop_creation: false,
    quarterly_consultation: false,
  },
  master: {
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
    white_label: true,
    multi_facility: true,
    team_collaboration: true,
    api_access: true,
    dedicated_manager: true,
    custom_sop_creation: true,
    quarterly_consultation: true,
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

export async function canAccessAzureAI(): Promise<boolean> {
  const subscription = await getUserSubscription()
  // Azure AI custom assistant available for Expert and Master tiers only
  return subscription.tier === "expert" || subscription.tier === "master"
}
