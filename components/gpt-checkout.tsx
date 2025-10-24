"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startGPTCheckoutSession } from "@/app/actions/gpt-stripe"
import { Button } from "@/components/ui/button"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function GPTCheckout({ gptId }: { gptId: string }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const startCheckoutSessionForGPT = useCallback(() => startGPTCheckoutSession(gptId), [gptId])

  if (!showCheckout) {
    return (
      <Button
        onClick={() => setShowCheckout(true)}
        className="w-full bg-foreground text-background hover:bg-foreground/90"
      >
        Purchase Now
      </Button>
    )
  }

  return (
    <div id="gpt-checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckoutSessionForGPT }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
