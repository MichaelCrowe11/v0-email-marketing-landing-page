import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Biotech IDE | Crowe Logic",
  description: "Advanced coding environment for biotech application development",
}

export default function IDELayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen w-full overflow-hidden bg-background text-foreground">{children}</div>
}
