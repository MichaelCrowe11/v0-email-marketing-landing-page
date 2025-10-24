import { getUserSubscription } from "@/lib/subscription"
import { FeatureGate } from "@/components/feature-gate"
import { CroweVisionContent } from "@/components/crowe-vision/crowe-vision-content"

export default async function CroweVisionPage() {
  const subscription = await getUserSubscription()
  const hasAccess = subscription.features.crowe_vision

  return (
    <FeatureGate hasAccess={hasAccess} feature="Crowe Vision" requiredTier="pro">
      <CroweVisionContent />
    </FeatureGate>
  )
}
