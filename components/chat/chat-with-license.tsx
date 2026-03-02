"use client"

import { useState } from "react"
import { ChatContainer } from "@/components/chat/chat-container"

interface ChatWithLicenseProps {
  initiallyLicensed: boolean
  hasUnlimitedAccess: boolean
}

export function ChatWithLicense({ initiallyLicensed, hasUnlimitedAccess }: ChatWithLicenseProps) {
  const [licensed, setLicensed] = useState(initiallyLicensed)

  // Always show the chat container — it handles the license gate inline on send
  return (
    <div className="flex-1 overflow-hidden">
      <ChatContainer
        hasUnlimitedAccess={hasUnlimitedAccess}
        isLicensed={licensed}
        onLicenseActivated={() => setLicensed(true)}
      />
    </div>
  )
}
