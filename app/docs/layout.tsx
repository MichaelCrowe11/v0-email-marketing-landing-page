import type React from "react"
import { DocsNavProfessional } from "@/components/docs-nav-professional"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DocsNavProfessional />
      <main className="flex-1 ml-64">
        <div className="container mx-auto px-8 py-12 max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
