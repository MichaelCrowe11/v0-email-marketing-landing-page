import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

export function Pricing() {
  const products = [
    {
      name: "Core",
      bestFor: "Daily cultivation and ops",
      includes: "Behavior core, SOP generator, BE math, contamination triage",
      price: 97,
      savings: null,
      link: "https://buy.stripe.com/eVq9AT4pz7ZN2tGcN4ao814",
      cta: "Get Core",
    },
    {
      name: "Spawn Master",
      bestFor: "Lab and spawn production",
      includes: "Grain prep, sterilization cycles, inoculation rates, QC gates",
      price: 67,
      savings: null,
      link: "https://buy.stripe.com/eVq7sL9JT2Ft3xKaEWao815",
      cta: "Get Spawn Master",
    },
    {
      name: "Substrate Tech",
      bestFor: "Formulas and economics",
      includes: "Hydration calculators, supplementation, cost per block",
      price: 67,
      savings: null,
      link: "https://buy.stripe.com/dRm14n09jbbZgkwdR8ao816",
      cta: "Get Substrate Tech",
    },
    {
      name: "Full Access",
      subtitle: "3 modules",
      bestFor: "Comprehensive cultivation",
      includes: "Core + Spawn Master + Substrate Tech",
      price: 159,
      savings: 72,
      link: "https://buy.stripe.com/9B69AT09jfsf4BOfZgao817",
      cta: "Get Full Access",
      featured: true,
    },
  ]

  return (
    <section id="pricing" className="relative px-4 py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-foreground">Founders Pricing</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Choose Your Access Level
          </h2>
          <p className="text-lg text-foreground/90 max-w-2xl mx-auto">
            One-time payment. Lifetime access. 12 months of updates included.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <div key={index} className={`relative ${product.featured ? "md:col-span-2 lg:col-span-1" : ""}`}>
              {product.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                    BEST VALUE
                  </div>
                </div>
              )}

              <div
                className={`h-full rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg ${
                  product.featured ? "border-accent shadow-lg" : "border-border/50"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{product.name}</h3>
                  {product.subtitle && <p className="text-sm text-foreground">{product.subtitle}</p>}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-foreground">${product.price}</span>
                  </div>
                  {product.savings ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-accent">Save ${product.savings}</span>
                      <span className="text-sm text-foreground/90 line-through">
                        ${product.price + product.savings}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-foreground">one-time payment</span>
                  )}
                </div>

                <div className="mb-6 space-y-3">
                  <div className="rounded-lg border border-border/50 bg-accent/5 p-3">
                    <p className="text-xs font-medium text-accent mb-1">{product.bestFor}</p>
                    <p className="text-sm text-foreground">{product.includes}</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className={`w-full h-11 rounded-lg text-sm font-medium group ${
                    product.featured
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-accent text-accent-foreground hover:bg-accent/90"
                  }`}
                  asChild
                >
                  <a href={product.link} target="_blank" rel="noopener noreferrer">
                    {product.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border/50 bg-card p-6 text-center">
          <div className="flex flex-wrap justify-center gap-8">
            {["Instant Access", "Lifetime Updates", "No Subscription"].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
