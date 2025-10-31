"use client"

import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield, Sparkles, Zap, Users } from "lucide-react"
import { useState } from "react"
import { TrustIndicators } from "@/components/trust-indicators"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PricingTiers() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState<string | null>(null)

  const plans = [
    {
      tier: "pro",
      name: "Pro Access",
      description: "Complete AI-powered mycological platform",
      monthlyPrice: 97,
      yearlyPrice: 997,
      savings: 167,
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
      yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
      features: [
        "Unlimited AI chat with 11 models",
        "Crowe Vision contamination analysis",
        "Forum with AI assistance",
        "Complete knowledge base (61+ articles)",
        "Environmental monitoring tools",
        "Species library & SOPs",
        "Cultivation project tracking",
        "Email support"
      ],
      icon: Zap,
      cta: "Start Pro Access"
    },
    {
      tier: "expert",
      name: "Expert Access",
      description: "Everything in Pro plus advanced features",
      monthlyPrice: 197,
      yearlyPrice: 1997,
      savings: 367,
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_EXPERT_MONTHLY_PRICE_ID,
      yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_EXPERT_YEARLY_PRICE_ID,
      features: [
        "Everything in Pro Access",
        "All GPT modules included ($391 value)",
        "Priority support",
        "Monthly group consulting calls",
        "Early access to new features",
        "Advanced analytics dashboard",
        "Custom cultivation templates",
        "Direct expert consultation"
      ],
      featured: true,
      icon: Sparkles,
      cta: "Start Expert Access"
    },
    {
      tier: "master",
      name: "Master Access",
      description: "Enterprise-grade solution for facilities",
      monthlyPrice: 497,
      yearlyPrice: 4997,
      savings: 967,
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_MASTER_MONTHLY_PRICE_ID,
      yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_MASTER_YEARLY_PRICE_ID,
      features: [
        "Everything in Expert Access",
        "White-label capabilities",
        "Multi-facility management",
        "Team collaboration tools",
        "API access for integrations",
        "Dedicated account manager",
        "Custom SOP creation service",
        "Quarterly strategy consultations"
      ],
      icon: Users,
      cta: "Contact Sales"
    }
  ]

  const handleCheckout = async (plan: typeof plans[0]) => {
    setLoading(plan.tier)

    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error("Stripe failed to load")

      const priceId = billingCycle === "monthly"
        ? plan.monthlyPriceId
        : plan.yearlyPriceId

      if (!priceId) {
        console.error("Price ID not configured for", plan.name)
        return
      }

      // For Master tier, redirect to contact form
      if (plan.tier === "master") {
        window.location.href = "/contact?plan=master"
        return
      }

      // Create checkout session
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          tierName: plan.tier,
          billingCycle
        })
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        console.error("Stripe checkout error:", error)
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id="pricing" className="relative px-4 py-16 sm:py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Trusted by 500+ Growers</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose Your Growth Path
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Science-backed cultivation tools that scale with your operation
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-accent">Save up to $967</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative rounded-2xl border p-8 ${
                plan.featured
                  ? "border-accent shadow-xl scale-105"
                  : "border-border"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <plan.icon className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                {billingCycle === "yearly" && plan.savings && (
                  <p className="text-sm text-accent mt-2">
                    Save ${plan.savings} annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout(plan)}
                disabled={loading === plan.tier}
                className={`w-full ${
                  plan.featured
                    ? "bg-accent hover:bg-accent/90"
                    : ""
                }`}
                variant={plan.featured ? "default" : "outline"}
              >
                {loading === plan.tier ? (
                  "Processing..."
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16">
          <TrustIndicators />
        </div>

        {/* FAQs */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, and ACH bank transfers for annual plans through our secure Stripe checkout.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-muted-foreground">
                We offer a 14-day money-back guarantee on all plans. If you're not satisfied, contact us for a full refund.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Do you offer discounts for non-profits?</h4>
              <p className="text-muted-foreground">
                Yes! We offer special pricing for educational institutions and registered non-profits. Contact us for details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}