"use client"

import { Suspense, useCallback, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startSubscriptionCheckout } from "@/app/actions/subscription-stripe"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get("plan") || "pro"
  const billing = searchParams.get("billing") || "monthly"
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await startSubscriptionCheckout(plan, billing as "monthly" | "yearly")
      return clientSecret
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)

      if (errorMessage.includes("must be logged in")) {
        // Store the intended destination to redirect back after login
        const returnUrl = `/checkout?plan=${plan}&billing=${billing}`
        setTimeout(() => {
          router.push(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`)
        }, 2000)
      }

      throw err
    }
  }, [plan, billing, router])

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-4xl px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
              {error.includes("must be logged in") && <p className="mt-2">Redirecting to login page...</p>}
            </AlertDescription>
          </Alert>

          {!error.includes("must be logged in") && (
            <div className="mt-4 flex gap-2">
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing">Back to Pricing</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

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
