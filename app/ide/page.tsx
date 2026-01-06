"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const IDEShell = dynamic(() => import("@/components/ide/ide-shell").then((mod) => ({ default: mod.IDEShell })), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading Crowe Mycology IDE...</p>
      </div>
    </div>
  ),
})

export default function IDEPage() {
  return <IDEShell />
}
