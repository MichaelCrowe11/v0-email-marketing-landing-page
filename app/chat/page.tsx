import { getUserSubscription } from "@/lib/subscription"
import { FeatureGate } from "@/components/feature-gate"
import { ChatContainer } from "@/components/chat/chat-container"

export default async function ChatPage() {
  const subscription = await getUserSubscription()
  const hasAccess = subscription.features.unlimited_chat

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <FeatureGate hasAccess={hasAccess} feature="Unlimited AI Chat" requiredTier="pro">
          <ChatContainer />
        </FeatureGate>
      </div>
    </div>
  )
}
