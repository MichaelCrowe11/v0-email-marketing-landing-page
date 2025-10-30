"use client"

import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function GPTsPage() {
  const aiModules = [
    {
      name: "Michael's GPT - Core",
      price: 97,
      description: "Behavior core + SOP generator + BE math + contamination triage",
      features: [
        "12 months of updates",
        "Perpetual access",
        "SOP generation",
        "Contamination triage",
        "BE math calculations",
      ],
      link: "https://buy.stripe.com/7sY8wP2hrgwjd8kbJ0",
      logo: "/crowe-avatar.png",
    },
    {
      name: "Michael's GPT - Spawn Master",
      price: 67,
      description: "Grain prep, sterilization cycles, inoculation rates, and QC gates",
      features: [
        "12 months of updates",
        "Perpetual access",
        "Grain preparation protocols",
        "Sterilization cycles",
        "Inoculation rate optimization",
        "Quality control gates",
      ],
      link: "https://buy.stripe.com/fZu00jbS10xlb0c5kC",
      logo: "/crowe-avatar.png",
    },
    {
      name: "Michael's GPT - Substrate Tech",
      price: 67,
      description: "Hydration calculators, supplementation formulas, and cost per block analysis",
      features: [
        "12 months of updates",
        "Perpetual access",
        "Hydration calculators",
        "Supplementation formulas",
        "Cost per block analysis",
      ],
      link: "https://buy.stripe.com/4gM9ATaNX93R9W8cN4",
      logo: "/crowe-avatar.png",
    },
    {
      name: "Michael's GPT - Inoculation AI",
      price: 67,
      description: "Sterile technique protocols, inoculation rates by species, agar work and culture management",
      features: [
        "12 months of updates",
        "Perpetual access",
        "Sterile technique protocols",
        "Species-specific inoculation rates",
        "Agar work guidance",
        "Culture management",
        "Contamination prevention",
        "Clean room setup",
      ],
      link: "https://buy.stripe.com/eVqeVdf4d2Ftc4g28q",
      logo: "/crowe-avatar.png",
    },
  ]

  const bundles = [
    {
      name: "Michael's GPTs - Full Access",
      subtitle: "Best Value - 3 Modules",
      price: 159,
      originalPrice: 231,
      savings: 72,
      description: "Complete package: Core + Spawn Master + Substrate Tech + bonus packs",
      features: [
        "All Core features",
        "All Spawn Master features",
        "All Substrate Tech features",
        "Bonus training materials",
        "12 months of updates",
        "Perpetual access to all modules",
      ],
      link: "https://buy.stripe.com/7sYeVd4pzeobfgs6oG",
      logo: "/crowe-avatar.png",
      featured: true,
    },
    {
      name: "Michael's GPTs - Ultimate Access",
      subtitle: "All 4 Modules",
      price: 197,
      originalPrice: 298,
      savings: 101,
      description: "Complete package: Core + Spawn Master + Substrate Tech + Inoculation AI + bonus packs",
      features: [
        "All Core features",
        "All Spawn Master features",
        "All Substrate Tech features",
        "All Inoculation AI features",
        "Premium bonus packs",
        "12 months of updates",
        "Perpetual access to all modules",
        "Priority support",
      ],
      link: "https://buy.stripe.com/eVq00j6xHfsffgs4gy",
      logo: "/crowe-avatar.png",
      featured: true,
    },
    {
      name: "Michael's GPTs - Lab Bundle",
      subtitle: "3 Specialties",
      price: 149,
      originalPrice: 201,
      savings: 52,
      description: "Lab-focused package: Spawn Master + Substrate Tech + Inoculation AI",
      features: [
        "All Spawn Master features",
        "All Substrate Tech features",
        "All Inoculation AI features",
        "Lab-specific training",
        "12 months of updates",
        "Perpetual access",
      ],
      link: "https://buy.stripe.com/9B600j2hr2Ft7O028q",
      logo: "/crowe-avatar.png",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/crowe-avatar.png"
                alt="Michael Crowe"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full ring-2 ring-accent/20"
                priority
              />
              <div>
                <h1 className="text-lg font-bold text-foreground">Michael's GPTs</h1>
                <p className="text-xs text-muted-foreground">Expert AI Assistants</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Image src="/crowe-avatar.png" alt="Michael Crowe" width={24} height={24} className="w-6 h-6 rounded-full ring-1 ring-accent/30" />
            <span className="text-sm font-medium text-foreground">Michael's Expert GPT Assistants</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Professional Mycology AI
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            20+ years of commercial cultivation expertise distilled into powerful AI assistants. Choose individual
            modules or save with bundle packages.
          </p>
        </div>
      </div>

      {/* Bundle Packages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Bundle Packages</h2>
          <p className="text-lg text-muted-foreground">Save up to $101 with our complete packages</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {bundles.map((bundle, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border bg-card p-6 sm:p-8 transition-all duration-300 hover:shadow-xl ${
                bundle.featured ? "border-accent shadow-lg ring-2 ring-accent/20" : "border-border"
              }`}
            >
              {bundle.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                    BEST VALUE
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <Image src={bundle.logo || "/placeholder.svg"} alt={bundle.name} width={48} height={48} className="h-12 w-12 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">{bundle.name}</h3>
                  <p className="text-sm text-muted-foreground">{bundle.subtitle}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-foreground">${bundle.price}</span>
                  {bundle.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">${bundle.originalPrice}</span>
                  )}
                </div>
                {bundle.savings && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    Save ${bundle.savings}
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-6">{bundle.description}</p>

              <ul className="space-y-3 mb-8">
                {bundle.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full ${
                  bundle.featured
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
                asChild
              >
                <a href={bundle.link} target="_blank" rel="noopener noreferrer">
                  Get {bundle.name.split(" - ")[1]}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Individual Modules</h2>
          <p className="text-lg text-muted-foreground">Build your own custom toolkit</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {aiModules.map((module, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-accent/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image src={module.logo || "/placeholder.svg"} alt={module.name} width={40} height={40} className="h-10 w-10 rounded-full" />
                <h3 className="text-lg font-bold text-foreground">{module.name.split(" - ")[1]}</h3>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">${module.price}</span>
                </div>
                <span className="text-sm text-muted-foreground">one-time payment</span>
              </div>

              <p className="text-sm text-muted-foreground mb-6">{module.description}</p>

              <ul className="space-y-2 mb-6">
                {module.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                <a href={module.link} target="_blank" rel="noopener noreferrer">
                  Get Module
                  <ArrowRight className="ml-2 w-3 h-3" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-accent/5 via-card to-card p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Transform Your Cultivation?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of professional cultivators using Michael's GPTs to optimize their operations and increase
            yields.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href={bundles[1].link} target="_blank" rel="noopener noreferrer">
                Get Ultimate Access
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/chat">Try Free Chat</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about Michael's GPTs</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <div className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="mb-3 text-lg font-semibold text-foreground">Is $97 a subscription?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No. $97 is a one-time founders price for Core. It includes 12 months of updates; you keep access forever.
              After 12 months, you can optionally add Updates & Support for $49/year.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="mb-3 text-lg font-semibold text-foreground">
              What makes this different from a normal chatbot?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A behavior core compiled from a year of dataset curation and full transcription of Michael's YouTube
              library, trained on his speech patterns and decision logic for the mycology domain.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="mb-3 text-lg font-semibold text-foreground">Can I use multiple GPTs together?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Yes! Each GPT is designed to work independently, but they complement each other perfectly. Bundle packages
              give you access to multiple specialized assistants at a discounted price.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="mb-3 text-lg font-semibold text-foreground">What happens after 12 months?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You keep perpetual access to your GPTs. The optional $49/year Updates & Support package gives you
              continued feature updates, new training data, and priority support.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="mb-3 text-lg font-semibold text-foreground">Do the GPTs work offline?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No, the GPTs require an internet connection to access the AI models and knowledge base. However, you can
              save responses and SOPs for offline reference.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="mb-3 text-lg font-semibold text-foreground">Can I get a refund?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Yes. We offer a 30-day money-back guarantee. If you're not satisfied with your GPT purchase, contact
              support for a full refund within 30 days of purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
