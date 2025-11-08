"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Calendar, Crown, Sparkles } from "lucide-react"
import Link from "next/link"

const consultationPackages = [
  {
    id: "1hr",
    name: "1-Hour Consultation",
    price: 425,
    duration: "1 hour",
    icon: Clock,
    description: "Perfect for specific questions or quick troubleshooting",
    features: [
      "Pre-call questionnaire",
      "Custom recommendations",
      "Follow-up summary document",
      "2 weeks of email support",
      "Contamination troubleshooting",
      "Yield optimization guidance",
    ],
    priceId: process.env.NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID,
    popular: false,
  },
  {
    id: "3hr",
    name: "3-Hour Package",
    price: 1150,
    duration: "3 hours",
    icon: Calendar,
    savings: 125,
    description: "Extended consultation for comprehensive facility support",
    features: [
      "Everything in 1-hour session",
      "Extended 3-hour consultation",
      "Detailed action plan",
      "30 days of email support",
      "Facility setup guidance",
      "Staff training recommendations",
      "Equipment optimization",
    ],
    priceId: process.env.NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID,
    popular: true,
  },
  {
    id: "fullday",
    name: "Full Day (6 Hours)",
    price: 2250,
    duration: "6 hours",
    icon: Sparkles,
    savings: 300,
    description: "Intensive consultation for facility audits and team training",
    features: [
      "Full 6-hour consultation",
      "On-site or virtual options",
      "Comprehensive facility audit",
      "Detailed report with recommendations",
      "30 days of follow-up support",
      "Team training session",
      "Operational workflow optimization",
      "Custom SOP review",
    ],
    priceId: process.env.NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID,
    popular: false,
  },
  {
    id: "retainer",
    name: "Premium Retainer",
    price: 25000,
    duration: "Monthly",
    icon: Crown,
    description: "Exclusive ongoing relationship for serious commercial operations",
    features: [
      "Priority access to Michael Crowe",
      "Unlimited strategic consulting",
      "Facility optimization",
      "Operational troubleshooting",
      "Custom SOP development",
      "Direct phone/video access",
      "Commercial operation support",
      "For serious businesses only",
    ],
    priceId: process.env.NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID,
    popular: false,
    premium: true,
  },
]

export default function ConsultationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Expert Consultation Services
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Work Directly with Michael Crowe
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            20+ years of commercial mycology expertise at your service. From quick troubleshooting
            to comprehensive facility design and ongoing strategic support.
          </p>
        </div>

        {/* Consultation Packages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {consultationPackages.map((pkg) => {
            const Icon = pkg.icon

            return (
              <Card
                key={pkg.id}
                className={`relative p-8 ${pkg.popular ? "border-primary shadow-lg" : ""} ${pkg.premium ? "border-amber-500 shadow-2xl bg-gradient-to-br from-amber-50/5 to-background dark:from-amber-950/10" : ""}`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                {pkg.premium && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600">
                    Premium
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${pkg.premium ? "bg-amber-500/10" : "bg-primary/10"}`}>
                    <Icon className={`w-6 h-6 ${pkg.premium ? "text-amber-500" : "text-primary"}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{pkg.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">${pkg.price.toLocaleString()}</span>
                    {pkg.id === "retainer" && <span className="text-muted-foreground">/month</span>}
                  </div>
                  {pkg.savings && (
                    <p className="text-sm text-green-600 mt-2">Save ${pkg.savings} vs hourly rate</p>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full mb-6"
                  variant={pkg.popular ? "default" : pkg.premium ? "default" : "outline"}
                  asChild
                >
                  <Link href={`/checkout?consultation=${pkg.id}`}>
                    Book {pkg.name}
                  </Link>
                </Button>

                <div className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${pkg.premium ? "text-amber-500" : "text-primary"}`} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Enterprise Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="p-8 sm:p-12 bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Enterprise Solutions
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Large-Scale Facility Design
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Planning a commercial cultivation facility? We offer comprehensive facility design services
                for operations of all sizes. Recent projects include an 80-room facility in Abu Dhabi.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-8 text-left">
                <div className="space-y-3">
                  <h3 className="font-semibold">Small-Scale (1-5 Rooms)</h3>
                  <p className="text-sm text-muted-foreground">Complete facility design, equipment recommendations, workflow optimization</p>
                  <p className="text-2xl font-bold">$50,000</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Enterprise (10+ Rooms)</h3>
                  <p className="text-sm text-muted-foreground">Custom implementation, on-site visits, ongoing support</p>
                  <p className="text-2xl font-bold">Custom Quote</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href={`/checkout?service=facility-setup`}>
                    Book Small-Scale ($50k)
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    Request Enterprise Quote
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* What to Expect */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What to Expect</h2>
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">1. Schedule Your Session</h3>
              <p className="text-sm text-muted-foreground">
                Choose your package and complete payment. You'll receive a booking link to schedule at your convenience.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">2. Pre-Consultation Questionnaire</h3>
              <p className="text-sm text-muted-foreground">
                Fill out a brief questionnaire so Michael can prepare specifically for your needs and maximize the value of your time together.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">3. Your Consultation</h3>
              <p className="text-sm text-muted-foreground">
                Meet with Michael via video call (or on-site for full-day sessions). Get actionable recommendations based on 20+ years of commercial experience.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">4. Follow-Up Support</h3>
              <p className="text-sm text-muted-foreground">
                Receive a detailed summary document and email support for 2-30 days depending on your package.
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How quickly can I schedule?</h3>
              <p className="text-muted-foreground">
                Most consultations can be scheduled within 1-2 weeks. Premium retainer clients get priority access with same-week availability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Are on-site visits available?</h3>
              <p className="text-muted-foreground">
                Yes! Full-day consultations and facility design services can include on-site visits. Travel expenses are quoted separately based on location.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What if I need ongoing support?</h3>
              <p className="text-muted-foreground">
                The Premium Retainer ($25,000/month) is perfect for businesses that need continuous access to expert guidance. It includes unlimited consulting hours and priority access.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I get a refund?</h3>
              <p className="text-muted-foreground">
                If you need to cancel, please do so at least 48 hours before your scheduled consultation for a full refund. Cancellations within 48 hours are non-refundable but can be rescheduled once.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
