"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startSubscriptionCheckout } from "@/app/actions/subscription-stripe"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  plan: string
  billing: "monthly" | "yearly"
}

export function CheckoutForm({ plan, billing }: CheckoutFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    console.log("[v0] Fetching client secret for plan:", plan, "billing:", billing)
    try {
      const clientSecret = await startSubscriptionCheckout(plan, billing)
      console.log("[v0] Client secret fetched successfully")
      return clientSecret
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      console.log("[v0] Error fetching client secret:", errorMessage)
      setError(errorMessage)

      // If authentication error, redirect to login
      if (errorMessage.includes("must be logged in")) {
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checkout Error</AlertTitle>
        <AlertDescription className="mt-2">
          {error}
          {error.includes("must be logged in") && <p className="mt-2">Redirecting to login page...</p>}
        </AlertDescription>
        {!error.includes("must be logged in") && (
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/pricing">Back to Pricing</Link>
            </Button>
          </div>
        )}
      </Alert>
    )
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
