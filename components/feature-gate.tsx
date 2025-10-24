"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface FeatureGateProps {
  hasAccess: boolean
  feature: string
  requiredTier: "pro" | "expert"
  children: ReactNode
}

export function FeatureGate({ hasAccess, feature, requiredTier, children }: FeatureGateProps) {
  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <Card className="p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Upgrade to Access {feature}</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        This feature is available with {requiredTier === "expert" ? "Expert" : "Pro"} Access. Upgrade now to unlock 20
        years of mycology expertise.
      </p>
      <Button size="lg" asChild>
        <Link href="/pricing">View Plans</Link>
      </Button>
    </Card>
  )
}
