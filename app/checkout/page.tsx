"use client"

import { Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startSubscriptionCheckout } from "@/app/actions/subscription-stripe"
import { Spinner } from "@/components/ui/spinner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "pro"
  const billing = searchParams.get("billing") || "monthly"

  const fetchClientSecret = useCallback(
    () => startSubscriptionCheckout(plan, billing as "monthly" | "yearly"),
    [plan, billing],
  )

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
          <p className="text-muted-foreground">
            You're subscribing to {plan === "expert" ? "Expert" : "Pro"} Access ({billing})
          </p>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
