"use client"

import { ScrollReveal } from "./scroll-reveal"
import { Badge } from "./ui/badge"
import { Microscope, Calculator, FileText, Users, Leaf } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  badge?: "new" | "popular" | "advanced"
  useCase: string
  successMetric?: string
}

export function FeaturesSimplified() {
  const features: Feature[] = [
    {
      icon: <Microscope className="w-12 h-12 text-purple-500" />,
      title: "Contamination Triage",
      description: "Rapid ID, containment, root-cause analysis, and corrective action plans.",
      badge: "popular",
      useCase: "Upload a photo, get instant identification and remediation steps from 20+ years of real cases.",
      successMetric: "Response time reduced from hours to minutes",
    },
    {
      icon: <Calculator className="w-12 h-12 text-cyan-500" />,
      title: "Substrate Optimization",
      description: "Precise formulations, hydration calculations, and BE predictions.",
      badge: "advanced",
      useCase: "Calculate exact substrate recipes optimized for your species and facility conditions.",
      successMetric: "15-20% higher biological efficiency",
    },
    {
      icon: <FileText className="w-12 h-12 text-pink-500" />,
      title: "SOP Generation",
      description: "Room-ready procedures tailored to your facility and strain set.",
      badge: "new",
      useCase: "Generate professional SOPs in minutes with your specific parameters and branding.",
      successMetric: "40% faster staff onboarding",
    },
    {
      icon: <Users className="w-12 h-12 text-green-500" />,
      title: "Expert Consultation",
      description: "24/7 access to Michael Crowe's cultivation expertise.",
      badge: "popular",
      useCase: "Get personalized guidance for complex challenges and facility optimization.",
      successMetric: "90% see measurable improvements",
    },
    {
      icon: <Leaf className="w-12 h-12 text-emerald-500" />,
      title: "Species Library",
      description: "Comprehensive database of cultivation parameters for 100+ species.",
      useCase: "Access detailed growing parameters, substrate preferences, and environmental requirements.",
    },
  ]

  const getBadgeVariant = (badge?: string) => {
    switch (badge) {
      case "new": return "default"
      case "popular": return "secondary"
      case "advanced": return "outline"
      default: return "outline"
    }
  }

  return (
    <section id="features" className="px-4 py-24 md:py-32 bg-accent/5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Tools Built from{" "}
            <span className="text-purple-500">
              Real Production Experience
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature comes from solving actual problems on the cultivation floor
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="group h-full rounded-2xl border-2 border-border/50 bg-card p-8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
                {/* Icon */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <div className="absolute -top-2 -right-2">
                      <Badge variant={getBadgeVariant(feature.badge)} className="shadow-lg">
                        {feature.badge.charAt(0).toUpperCase() + feature.badge.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-purple-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Use Case */}
                <div className="text-xs text-foreground/80 italic border-l-2 border-purple-500/50 pl-3 py-2 mb-4 bg-purple-500/5 rounded-r">
                  {feature.useCase}
                </div>

                {/* Success Metric */}
                {feature.successMetric && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-500 bg-purple-500/10 rounded-lg px-3 py-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>{feature.successMetric}</span>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
