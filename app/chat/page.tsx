import { getUserSubscription } from "@/lib/subscription"
import { FeatureGate } from "@/components/feature-gate"
import { ChatContainer } from "@/components/chat/chat-container"

function ChatLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
}

export default async function ChatPage() {
  try {
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
  } catch (error) {
    console.error("[v0] Error loading chat:", error)
    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="flex-1 overflow-hidden">
          <ChatContainer />
        </div>
      </div>
    )
  }
}
