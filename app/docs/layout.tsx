import type React from "react"
import { DocsSidebar } from "@/components/docs-sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DocsSidebar />
      <main className="flex-1 md:ml-64">
        <div className="container mx-auto px-4 py-8 max-w-4xl">{children}</div>
      </main>
    </div>
  )
}
