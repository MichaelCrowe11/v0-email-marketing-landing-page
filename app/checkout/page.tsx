"use client"

import { Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startSubscriptionCheckout } from "@/app/actions/subscription-stripe"
import { startConsultationCheckout, startServiceCheckout } from "@/app/actions/consultation-checkout"
import { Spinner } from "@/components/ui/spinner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")
  const billing = searchParams.get("billing") || "monthly"
  const consultation = searchParams.get("consultation")
  const service = searchParams.get("service")

  const fetchClientSecret = useCallback(() => {
    // Handle subscription checkouts (pro, expert, master)
    if (plan) {
      return startSubscriptionCheckout(plan, billing as "monthly" | "yearly")
    }

    // Handle consultation bookings
    if (consultation) {
      return startConsultationCheckout(consultation)
    }

    // Handle service purchases (facility setup, etc.)
    if (service) {
      return startServiceCheckout(service)
    }

    // Default to pro
    return startSubscriptionCheckout("pro", "monthly")
  }, [plan, billing, consultation, service])

  // Determine checkout title and description
  const getCheckoutInfo = () => {
    if (plan) {
      const planNames: Record<string, string> = {
        pro: "Pro Access",
        expert: "Expert Access",
        master: "Master Grower",
      }
      return {
        title: "Complete Your Subscription",
        description: `You're subscribing to ${planNames[plan] || "Pro Access"} (${billing})`,
      }
    }
    if (consultation) {
      const consultNames: Record<string, string> = {
        "1hr": "1-Hour Consultation ($425)",
        "3hr": "3-Hour Package ($1,150)",
        fullday: "Full Day Consultation ($2,250)",
        retainer: "Premium Retainer ($25,000/month)",
      }
      return {
        title: "Book Your Consultation",
        description: `Booking: ${consultNames[consultation] || "Consultation"} with Michael Crowe`,
      }
    }
    if (service === "facility-setup") {
      return {
        title: "Facility Design Service",
        description: "Commercial Facility Setup - Small Scale (1-5 rooms) - $50,000",
      }
    }
    return {
      title: "Complete Your Purchase",
      description: "Crowe Logic AI",
    }
  }

  const { title, description } = getCheckoutInfo()

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
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
