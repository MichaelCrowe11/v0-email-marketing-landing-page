"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    id: "pro",
    name: "Pro Access",
    description: "Complete platform access with AI-powered cultivation tools",
    monthlyPrice: 97,
    yearlyPrice: 997,
    savings: 167,
    icon: Zap,
    features: [
      "Unlimited AI chat with 11 models",
      "Crowe Vision contamination analysis",
      "Forum with AI assistance",
      "Complete knowledge base (61+ articles)",
      "Environmental monitoring tools",
      "Species library & SOPs",
      "Cultivation project tracking",
      "Email support",
    ],
    cta: "Start Pro Access",
    popular: false,
  },
  {
    id: "expert",
    name: "Expert Access",
    description: "Everything in Pro plus priority support and advanced features", // Updated description to remove GPT modules reference
    monthlyPrice: 197,
    yearlyPrice: 1997,
    savings: 367,
    icon: Sparkles,
    features: [
      "Everything in Pro Access",
      "Priority support",
      "Monthly group consulting calls",
      "Early access to new features",
      "Advanced analytics dashboard",
      "Custom cultivation templates",
      "Direct expert consultation",
    ],
    cta: "Start Expert Access",
    popular: true,
  },
  {
    id: "master",
    name: "Master Grower",
    description: "Premium tier for commercial operations with exclusive benefits",
    monthlyPrice: 497,
    yearlyPrice: 4997,
    savings: 967,
    icon: Crown,
    features: [
      "Everything in Expert Access",
      "Quarterly 30-min 1-on-1 with Michael Crowe",
      "White-label capability (remove branding)",
      "Multi-facility management (5 locations)",
      "Team collaboration (up to 10 users)",
      "API access for custom integrations",
      "Dedicated account manager",
      "Custom SOP creation service",
    ],
    cta: "Start Master Grower",
    popular: false,
    premium: true,
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            20 Years of Mycology Expertise
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Choose Your Access Level</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant access to professional cultivation knowledge, AI-powered tools, and expert guidance
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={billingCycle === "monthly" ? "font-semibold" : "text-muted-foreground"}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={billingCycle === "yearly" ? "font-semibold" : "text-muted-foreground"}>
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save up to $967
            </Badge>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
            const savings = billingCycle === "yearly" ? plan.savings : 0

            return (
              <Card
                key={plan.id}
                className={`relative p-8 ${plan.popular ? "border-primary shadow-lg" : ""} ${plan.premium ? "border-amber-500 shadow-2xl bg-gradient-to-br from-amber-50/5 to-background dark:from-amber-950/10" : ""}`}
              >
                {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                {plan.premium && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600">
                    Premium
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">${price}</span>
                    <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
                  </div>
                  {savings > 0 && <p className="text-sm text-green-600 mt-2">Save ${savings} with yearly billing</p>}
                </div>

                <Button size="lg" className="w-full mb-6" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href={`/checkout?plan=${plan.id}&billing=${billingCycle}`}>{plan.cta}</Link>
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Consultation Services CTA */}
        <div className="mt-20 max-w-4xl mx-auto">
          <Card className="p-8 sm:p-12 bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Premium Consulting Services
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need Direct Expert Guidance?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Book a consultation with Michael Crowe for facility design, contamination troubleshooting, or strategic
                guidance. From 1-hour sessions to premium monthly retainers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/consultations">View Consultation Packages</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Request Enterprise Quote</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Starting at $425/hour • Premium Retainer: $25,000/month
              </p>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your
                billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee. If you're not satisfied, we'll refund your first payment in full.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
              <p className="text-muted-foreground">
                Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect
                at the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What's included in Master Grower?</h3>
              <p className="text-muted-foreground">
                Master Grower is designed for commercial operations. It includes quarterly 1-on-1 consultations with
                Michael Crowe, white-label capability, multi-facility management, team collaboration for up to 10 users,
                API access, and dedicated account management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer enterprise pricing?</h3>
              <p className="text-muted-foreground">
                Yes! For large-scale operations (10+ grow rooms), research institutions, or custom implementations, we
                offer enterprise pricing and custom solutions. Contact us for a quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
