"use client"

import { useState } from "react"
import Image from "next/image"
import { ScrollReveal } from "./scroll-reveal"
import { Badge } from "./ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { TrendingUp, BookOpen, Calculator, Microscope, AlertTriangle, Leaf, FlaskConical, Target } from "lucide-react"

interface Feature {
  title: string
  description: string
  category: "ai-tools" | "analysis" | "planning" | "support"
  badge?: "new" | "popular" | "advanced"
  useCase: string
  successMetric?: string
  learnMoreLink?: string
}

export function Features() {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const features: Feature[] = [
    {
      title: "Contamination Triage",
      description: "Rapid identification, containment strategies, and corrective action plans.",
      category: "support",
      badge: "popular",
      useCase: "Upload a photo and get instant contamination ID with step-by-step remediation from 20+ years of production cases.",
      successMetric: "Response time reduced from hours to minutes",
      learnMoreLink: "/docs#contam-triage",
    },
    {
      title: "Substrate Optimization",
      description: "Precise formulations, hydration calculations, and BE predictions.",
      category: "analysis",
      badge: "advanced",
      useCase: "Calculate exact substrate recipes for any species with real production data from Southwest Mushrooms.",
      successMetric: "15-20% higher biological efficiency",
      learnMoreLink: "/docs#substrate-optimization",
    },
    {
      title: "Vision Analysis",
      description: "AI-powered photo analysis for growth monitoring and problem detection.",
      category: "ai-tools",
      badge: "new",
      useCase: "Upload photos of your grows for instant analysis and recommendations based on visual patterns.",
      successMetric: "Detect issues 3-5 days earlier",
      learnMoreLink: "/crowe-vision",
    },
    {
      title: "SOP Generator",
      description: "Custom standard operating procedures for your facility and strains.",
      category: "planning",
      badge: "popular",
      useCase: "Generate professional SOPs tailored to your specific setup in minutes instead of days.",
      successMetric: "40% faster team onboarding",
      learnMoreLink: "/docs#sop-generator",
    },
    {
      title: "Species Database",
      description: "Cultivation parameters for 100+ mushroom species.",
      category: "planning",
      useCase: "Access detailed growing parameters, substrate preferences, and environmental requirements.",
      learnMoreLink: "/species-library",
    },
    {
      title: "Production Troubleshooting",
      description: "Real-time guidance for yield issues, environmental problems, and quality control.",
      category: "support",
      useCase: "Get expert advice on complex cultivation challenges from someone who's been on the floor.",
      successMetric: "90% of issues resolved in first consultation",
      learnMoreLink: "/consultations",
    },
  ]

  const categories = [
    { id: "all", label: "All Tools", icon: Target },
    { id: "ai-tools", label: "Vision Analysis", icon: Microscope },
    { id: "analysis", label: "Calculations", icon: Calculator },
    { id: "planning", label: "Planning", icon: BookOpen },
    { id: "support", label: "Support", icon: Microscope },
  ]

  const filteredFeatures = activeCategory === "all" 
    ? features 
    : features.filter(f => f.category === activeCategory)

  const getBadgeVariant = (badge?: string) => {
    switch (badge) {
      case "new": return "default"
      case "popular": return "secondary"
      case "advanced": return "outline"
      default: return "outline"
    }
  }

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case "new": return <Leaf className="w-3 h-3" />
      case "popular": return <TrendingUp className="w-3 h-3" />
      case "advanced": return <FlaskConical className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <section id="features" className="px-4 py-24 md:py-32 bg-accent/5 mobile-contain-content">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Tools Built from{" "}
            <span className="text-purple-500">
              Real Production Experience
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Every feature comes from solving actual problems on the cultivation floor
          </p>

          {/* Category Filters */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="inline-flex mx-auto">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <TabsTrigger key={category.id} value={category.id} className="gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div
                className="group h-full rounded-xl border border-border/50 bg-card p-6 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 feature-card-mobile-optimized"
              >
                {/* Icon Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.category === 'support' && <Microscope className="w-6 h-6 text-purple-500" />}
                    {feature.category === 'analysis' && <Calculator className="w-6 h-6 text-purple-500" />}
                    {feature.category === 'ai-tools' && <Target className="w-6 h-6 text-purple-500" />}
                    {feature.category === 'planning' && <BookOpen className="w-6 h-6 text-purple-500" />}
                  </div>
                  
                  {feature.badge && (
                    <Badge variant={getBadgeVariant(feature.badge)} className="gap-1">
                      {getBadgeIcon(feature.badge)}
                      {feature.badge.charAt(0).toUpperCase() + feature.badge.slice(1)}
                    </Badge>
                  )}
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="text-xs text-foreground/80 italic border-l-2 border-primary/50 pl-3 py-2">
                    {feature.useCase}
                  </div>
                  
                  {feature.successMetric && (
                    <div className="flex items-start gap-2 text-xs text-primary/90 bg-primary/5 rounded-md p-3">
                      <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{feature.successMetric}</span>
                    </div>
                  )}
                  
                  {feature.learnMoreLink && (
                    <a
                      href={feature.learnMoreLink}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group/link mt-2"
                    >
                      <span className="font-medium">Learn More</span>
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No features found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
