"use client"

import { useState } from "react"
import Image from "next/image"
import { ScrollReveal } from "./scroll-reveal"
import { Badge } from "./ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Sparkles, TrendingUp, Zap, BookOpen, Calculator, Microscope, AlertTriangle } from "lucide-react"

interface Feature {
  image: string
  videoId?: string
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
      image: "https://img.youtube.com/vi/o-9_9lMnTjM/maxresdefault.jpg",
      videoId: "o-9_9lMnTjM",
      title: "SOP Generator",
      description: "Room-ready procedures tailored to your facility and strain set.",
      category: "planning",
      badge: "popular",
      useCase: "Generate custom SOPs for your specific strains and facility setup in minutes, not days.",
      successMetric: "Facilities report 40% faster onboarding with AI-generated SOPs",
      learnMoreLink: "/docs#sop-generator",
    },
    {
      image: "https://img.youtube.com/vi/e1DyNs9XQVQ/maxresdefault.jpg",
      videoId: "e1DyNs9XQVQ",
      title: "BE & Cost Math",
      description: "Hydration, supplementation, BE targets, and cost per block.",
      category: "analysis",
      badge: "advanced",
      useCase: "Calculate precise substrate formulations and predict biological efficiency for any strain.",
      successMetric: "Users achieve 15-20% higher BE with optimized formulations",
      learnMoreLink: "/docs#be-cost-math",
    },
    {
      image: "https://img.youtube.com/vi/-z0s3GwJxpM/maxresdefault.jpg",
      videoId: "-z0s3GwJxpM",
      title: "Spawn Master",
      description: "Grain prep, sterilization cycles, inoculation rates, QC checklists.",
      category: "planning",
      useCase: "Optimize spawn production with precise grain prep protocols and contamination prevention.",
      successMetric: "Reduce spawn contamination rates by up to 60%",
      learnMoreLink: "/docs#spawn-master",
    },
    {
      image: "https://i.ytimg.com/vi/Yf5WCbAs32s/hqdefault.jpg?sqp=-oaymwFBCNACELwBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGEogTyhlMA8=&rs=AOn4CLAcePkk-o7rtwQuRS36_LvSZuZ8UQ",
      videoId: "bgqt0q1I7J8",
      title: "Contam Triage",
      description: "Rapid ID, containment, root-cause analysis, and CAPA playbooks.",
      category: "support",
      badge: "new",
      useCase: "Identify contamination sources instantly with visual analysis and get actionable remediation plans.",
      successMetric: "Average contamination response time reduced from hours to minutes",
      learnMoreLink: "/docs#contam-triage",
    },
    {
      image: "https://i.ytimg.com/vi/z2fpfQGNbQA/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAROOPUSBYXSCvKyE-p5QEyMVjHqA",
      title: "Crowe Vision Analysis",
      description: "Advanced visual analysis for growth monitoring and contamination detection.",
      category: "ai-tools",
      badge: "new",
      useCase: "Upload photos of your grows for instant AI-powered analysis and recommendations.",
      successMetric: "Detect issues 3-5 days earlier than visual inspection alone",
      learnMoreLink: "/crowe-vision",
    },
    {
      image: "https://i.ytimg.com/vi/mNnTXNS76Dw/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAGa1t-l7RfUYO7jiala79Yp6g4WA",
      title: "Species Library",
      description: "Comprehensive database of cultivation parameters for 100+ species.",
      category: "planning",
      useCase: "Access detailed growing parameters, substrate preferences, and environmental requirements.",
      learnMoreLink: "/species-library",
    },
    {
      image: "https://i.ytimg.com/vi/90MnwqxIBeg/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDzjqUcVGVBk9uOnAo5h5Sh_-ZaYA",
      title: "Expert Consultation",
      description: "Direct access to Michael Crowe's 20+ years of cultivation expertise.",
      category: "support",
      badge: "popular",
      useCase: "Get personalized guidance for complex cultivation challenges and facility optimization.",
      successMetric: "90% of consultations result in measurable yield improvements",
      learnMoreLink: "/consultations",
    },
    {
      image: "/crowe-logic-avatar-writing-business-plan-with-mush.jpg",
      title: "Business Planning",
      description: "Financial modeling, market analysis, and scaling strategies for commercial operations.",
      category: "planning",
      badge: "advanced",
      useCase: "Build comprehensive business plans with accurate cost projections and revenue forecasts.",
      learnMoreLink: "/docs#business-planning",
    },
  ]

  const categories = [
    { id: "all", label: "All Features", icon: Sparkles },
    { id: "ai-tools", label: "AI Tools", icon: Zap },
    { id: "analysis", label: "Analysis", icon: Calculator },
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
      case "new": return <Sparkles className="w-3 h-3" />
      case "popular": return <TrendingUp className="w-3 h-3" />
      case "advanced": return <Zap className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <section id="features" className="px-4 py-24 md:py-32 bg-accent/5 mobile-contain-content">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            What's Inside{" "}
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Crowe Logic AI
            </span>
          </h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto mb-8">
            Comprehensive tools for every stage of mushroom cultivation
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredFeatures.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div
                className="group h-full rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 feature-card-mobile-optimized"
              >
                <div className="relative overflow-hidden aspect-video">
                  {feature.videoId ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-black border-b-8 border-b-transparent ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                    />
                  )}
                  
                  {feature.badge && (
                    <div className="absolute top-3 right-3">
                      <Badge variant={getBadgeVariant(feature.badge)} className="gap-1 shadow-lg">
                        {getBadgeIcon(feature.badge)}
                        {feature.badge.charAt(0).toUpperCase() + feature.badge.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col h-[calc(100%-theme(spacing.48))]">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="text-xs text-foreground/80 italic border-l-2 border-primary/50 pl-3 py-1">
                      {feature.useCase}
                    </div>
                    
                    {feature.successMetric && (
                      <div className="flex items-start gap-2 text-xs text-primary/90 bg-primary/5 rounded-md p-2">
                        <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{feature.successMetric}</span>
                      </div>
                    )}
                    
                    {feature.learnMoreLink && (
                      <a
                        href={feature.learnMoreLink}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors group/link"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Learn More</span>
                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                      </a>
                    )}
                  </div>
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
