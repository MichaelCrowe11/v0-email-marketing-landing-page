import { Suspense } from "react"

export const dynamic = 'force-dynamic'

import { hasValidLicense } from "@/lib/license"
import { ChatWithLicense } from "@/components/chat/chat-with-license"

function ChatLoading() {
  return (
    <div className="h-screen flex items-center justify-center" style={{ backgroundColor: "#1a1916" }}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: "#3d9a9a", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "#6b6560" }}>Loading Crowe Logic AI...</p>
      </div>
    </div>
  )
}

async function ChatContent() {
  const licensed = await hasValidLicense()

  return (
    <div className="h-screen flex flex-col overflow-hidden touch-pan-y" style={{ backgroundColor: "#1a1916" }}>
      <ChatWithLicense initiallyLicensed={licensed} hasUnlimitedAccess={licensed} />
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
