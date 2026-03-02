"use client"

import { useState } from "react"
import { LicenseGate } from "@/components/license-gate"
import { ChatContainer } from "@/components/chat/chat-container"

interface ChatWithLicenseProps {
  initiallyLicensed: boolean
  hasUnlimitedAccess: boolean
}

export function ChatWithLicense({ initiallyLicensed, hasUnlimitedAccess }: ChatWithLicenseProps) {
  const [licensed, setLicensed] = useState(initiallyLicensed)

  if (!licensed) {
    return <LicenseGate onActivated={() => setLicensed(true)} />
  }

  return (
    <div className="flex-1 overflow-hidden">
      <ChatContainer hasUnlimitedAccess={hasUnlimitedAccess} />
    </div>
  )
}
