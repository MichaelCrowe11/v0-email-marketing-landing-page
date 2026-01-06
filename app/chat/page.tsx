import { createClient } from '@/lib/azure/client'
import { Suspense } from "react"

// Prevent static generation - this page requires runtime auth
export const dynamic = 'force-dynamic'
import { getUserSubscription } from "@/lib/subscription"
import { ChatContainer } from "@/components/chat/chat-container"
import { ChatMeter } from "@/components/chat/chat-meter"
import { getChatQuota } from "@/lib/chat-metering"

function ChatLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading Crowe Logic AI...</p>
      </div>
    </div>
  )
}

async function ChatContent() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const subscription = await getUserSubscription()
  const hasUnlimitedAccess = subscription.features.unlimited_chat

  let quota = null
  if (user && !hasUnlimitedAccess) {
    quota = await getChatQuota(user.id)
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden touch-pan-y">
      {user && !hasUnlimitedAccess && quota && (
        <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <ChatMeter initialQuota={quota.quota} initialUsed={quota.used} initialResetAt={quota.resetAt} />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <ChatContainer hasUnlimitedAccess={hasUnlimitedAccess} />
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  )
}
