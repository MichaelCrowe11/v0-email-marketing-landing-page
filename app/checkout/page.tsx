"use client"

import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Spinner } from "@/components/ui/spinner"
import { CheckoutForm } from "@/components/checkout-form"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

async function CheckoutContent({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; billing?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams
  const plan = params.plan || "pro"
  const billing = params.billing || "monthly"

  // If not authenticated, redirect to login with return URL
  if (!user) {
    const returnUrl = `/checkout?plan=${plan}&billing=${billing}`
    redirect(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`)
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
          <CheckoutForm plan={plan} billing={billing as "monthly" | "yearly"} />
        </div>
      </div>
    </div>
  )
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; billing?: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <CheckoutContent searchParams={searchParams} />
    </Suspense>
  )
}
