import { Suspense } from "react"
import { getUserSubscription } from "@/lib/subscription"
import { ChatContainer } from "@/components/chat/chat-container"
import { ChatMeter } from "@/components/chat/chat-meter"
import { getChatQuota } from "@/lib/chat-metering"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function ChatLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
}

async function ChatContent() {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const subscription = await getUserSubscription()
  const hasUnlimitedAccess = subscription.features.unlimited_chat

  // Get chat quota for free/basic users
  let quota = null
  if (user && !hasUnlimitedAccess) {
    quota = await getChatQuota(user.id)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {user && !hasUnlimitedAccess && quota && (
        <div className="p-4 border-b border-border">
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
