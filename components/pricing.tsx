"use client"

import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Shield, Sparkles, Zap, Database, Beaker, Calculator } from "lucide-react"
import { useState } from "react"
import { TrustIndicators } from "@/components/trust-indicators"

export function Pricing() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const products = [
    {
      name: "Core",
      bestFor: "Daily cultivation and ops",
      includes: "Behavior core, SOP generator, BE math, contamination triage",
      features: [
        "AI-powered contamination detection",
        "SOP generator & templates",
        "Biological efficiency calculator",
        "24/7 cultivation support",
      ],
      price: 97,
      savings: null,
      link: "https://buy.stripe.com/eVq9AT4pz7ZN2tGcN4ao814",
      cta: "Get Core",
      icon: Zap,
    },
    {
      name: "Spawn Master",
      bestFor: "Lab and spawn production",
      includes: "Grain prep, sterilization cycles, inoculation rates, QC gates",
      features: [
        "Grain preparation protocols",
        "Sterilization cycle optimization",
        "Inoculation rate calculators",
        "Quality control gates",
      ],
      price: 67,
      savings: null,
      link: "https://buy.stripe.com/eVq7sL9JT2Ft3xKaEWao815",
      cta: "Get Spawn Master",
      icon: Beaker,
    },
    {
      name: "Substrate Tech",
      bestFor: "Formulas and economics",
      includes: "Hydration calculators, supplementation, cost per block",
      features: [
        "Hydration calculators",
        "Supplementation formulas",
        "Cost per block analysis",
        "Yield optimization",
      ],
      price: 67,
      savings: null,
      link: "https://buy.stripe.com/dRm14n09jbbZgkwdR8ao816",
      cta: "Get Substrate Tech",
      icon: Calculator,
    },
    {
      name: "Full Access",
      subtitle: "3 modules",
      bestFor: "Comprehensive cultivation",
      includes: "Core + Spawn Master + Substrate Tech",
      features: [
        "All Core features",
        "All Spawn Master features",
        "All Substrate Tech features",
        "Priority support",
      ],
      price: 159,
      savings: 72,
      link: "https://buy.stripe.com/9B69AT09jfsf4BOfZgao817",
      cta: "Get Full Access",
      featured: true,
      icon: Database,
    },
  ]

  const testimonials = [
    {
      text: "Cut contamination by 40% in first month",
      author: "Commercial Grower",
    },
    {
      text: "Saved 15+ hours per week on planning",
      author: "Lab Manager",
    },
  ]

  return (
    <section id="pricing" className="relative px-4 py-16 sm:py-24 md:py-32 mobile-contain-content">
      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6 animate-fade-in">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-foreground">Founders Pricing</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 animate-slide-up-fade">
            Choose Your Access Level
          </h2>
          <p className="text-lg text-foreground/90 max-w-2xl mx-auto mb-8 animate-slide-up-fade animation-delay-200">
            One-time payment. Lifetime access. 12 months of updates included.
          </p>

          {/* View Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-accent/10 border border-border/50 animate-fade-in animation-delay-400">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "cards"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "table"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Compare
            </button>
          </div>
        </div>

        {/* Card View */}
        {viewMode === "cards" && (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {products.map((product, index) => {
              const Icon = product.icon
              return (
                <div
                  key={index}
                  className={`relative flex flex-col ${product.featured ? "md:col-span-2 lg:col-span-1" : ""}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Most Popular Badge */}
                  {product.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                      <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                        <Sparkles className="inline w-3 h-3 mr-1" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={`h-full flex flex-col rounded-2xl border p-6 sm:p-8 transition-all duration-500 group pricing-card-mobile-optimized ${
                      product.featured
                        ? "bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-cyan-500/5 border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 hover:scale-[1.02]"
                        : "glass-card hover:border-accent/50 hover:-translate-y-1 hover:shadow-xl"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                        product.featured
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                          : "bg-accent/10 text-foreground"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-1">{product.name}</h3>
                      {product.subtitle && (
                        <p className="text-sm text-foreground/70 font-medium">{product.subtitle}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-5xl font-bold text-foreground">${product.price}</span>
                      </div>
                      {product.savings ? (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base font-bold text-green-500 animate-pulse">
                            Save ${product.savings}
                          </span>
                          <span className="text-sm text-foreground/60 line-through">
                            ${product.price + product.savings}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-foreground/70">one-time payment</span>
                      )}
                    </div>

                    {/* Best For */}
                    <div className="rounded-xl border border-border/50 bg-accent/5 p-4 mb-6">
                      <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">Best For</p>
                      <p className="text-sm font-medium text-foreground">{product.bestFor}</p>
                    </div>

                    {/* Features */}
                    <div className="flex-1 mb-6 space-y-3">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 group/item">
                          <div
                            className={`mt-0.5 rounded-full p-0.5 ${
                              product.featured ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-accent/20"
                            }`}
                          >
                            <Check
                              className={`w-4 h-4 ${product.featured ? "text-white" : "text-accent"} transition-transform group-hover/item:scale-110`}
                            />
                          </div>
                          <span className="text-sm text-foreground/90 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      size="lg"
                      className={`w-full h-12 rounded-xl text-base font-bold group/btn transition-all duration-300 ${
                        product.featured
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/50"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                      asChild
                    >
                      <a href={product.link} target="_blank" rel="noopener noreferrer">
                        {product.cta}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>

                    {/* Testimonial for featured */}
                    {product.featured && testimonials[0] && (
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <p className="text-xs italic text-foreground/70">"{testimonials[0].text}"</p>
                        <p className="text-xs text-foreground/50 mt-1">— {testimonials[0].author}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="mb-12 overflow-x-auto">
            <div className="glass-card rounded-2xl p-6 sm:p-8 min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-4 px-4 text-sm font-bold text-foreground">Feature</th>
                    {products.map((product, idx) => (
                      <th key={idx} className="text-center py-4 px-4">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-lg font-bold text-foreground">{product.name}</span>
                          <span className="text-2xl font-bold text-foreground">${product.price}</span>
                          {product.featured && (
                            <span className="text-xs font-bold text-purple-500">BEST VALUE</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    "AI Contamination Detection",
                    "SOP Generator",
                    "BE Calculator",
                    "Grain Prep Protocols",
                    "Sterilization Optimization",
                    "Hydration Calculators",
                    "Cost Analysis",
                    "Priority Support",
                  ].map((feature, idx) => (
                    <tr key={idx} className="border-b border-border/30 hover:bg-accent/5 transition-colors">
                      <td className="py-4 px-4 text-sm text-foreground">{feature}</td>
                      {products.map((product, pIdx) => {
                        const hasFeature =
                          (idx < 3 && (pIdx === 0 || pIdx === 3)) ||
                          (idx >= 3 && idx < 5 && (pIdx === 1 || pIdx === 3)) ||
                          (idx >= 5 && idx < 7 && (pIdx === 2 || pIdx === 3)) ||
                          (idx === 7 && pIdx === 3)
                        return (
                          <td key={pIdx} className="py-4 px-4 text-center">
                            {hasFeature ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-foreground/30">—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mb-12">
          <TrustIndicators showEarlyAccess={true} />
        </div>

        {/* Bottom Features */}
        <div className="rounded-2xl border border-border/50 glass-card p-6 sm:p-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {["Instant Access", "Lifetime Updates", "No Subscription", "Cancel Anytime"].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">Pricing FAQs</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "Is this really a one-time payment?",
                a: "Yes! Pay once and get lifetime access. No recurring charges, no hidden fees. You'll receive 12 months of updates included.",
              },
              {
                q: "Can I upgrade later?",
                a: "Absolutely. You can upgrade from any module to Full Access at any time. Just pay the difference.",
              },
              {
                q: "What if I'm not satisfied?",
                a: "We offer a 30-day money-back guarantee. If Crowe Logic AI doesn't meet your needs, we'll refund you in full.",
              },
              {
                q: "Do you offer discounts for multiple users?",
                a: "Yes! Contact us for team pricing if you need access for multiple team members at your facility.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 hover:border-accent/50 transition-all">
                <h4 className="text-base font-bold text-foreground mb-2">{faq.q}</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
