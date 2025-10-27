"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Zap,
  CheckCircle2,
  Briefcase,
  Users,
  DollarSign
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    facilityType: "",
    roomCount: "",
    timeline: "",
    budget: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement actual form submission to your backend
    // For now, we'll simulate a submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-2xl py-20">
          <Card className="p-12 text-center border-primary/20 bg-card/50 backdrop-blur">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-primary/10 p-6">
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Request Received!</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for your interest in our enterprise facility design services.
              Michael Crowe will review your request and contact you within 24-48 hours
              to discuss your project.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <a href="/">Return Home</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/consultations">View Consultations</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Enterprise Solutions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Custom Facility Design & Build Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From boutique operations to multi-million dollar commercial facilities.
              Get a custom quote for your cultivation project.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-primary/20 bg-card/50 backdrop-blur">
              <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">80+</div>
              <div className="text-sm text-muted-foreground">Room Facility (Abu Dhabi)</div>
            </Card>
            <Card className="p-6 text-center border-primary/20 bg-card/50 backdrop-blur">
              <Users className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">500K+</div>
              <div className="text-sm text-muted-foreground">Community Members</div>
            </Card>
            <Card className="p-6 text-center border-primary/20 bg-card/50 backdrop-blur">
              <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">10+ Years</div>
              <div className="text-sm text-muted-foreground">Cultivation Expertise</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Complete Facility Design</div>
                  <p className="text-sm text-muted-foreground">
                    End-to-end planning from layout to equipment selection
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Custom SOPs</div>
                  <p className="text-sm text-muted-foreground">
                    Tailored standard operating procedures for your operation
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Staff Training Programs</div>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive training for your cultivation team
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Ongoing Support</div>
                  <p className="text-sm text-muted-foreground">
                    Retainer options for continuous consultation
                  </p>
                </div>
              </div>
            </div>

            <Card className="mt-8 p-6 border-primary/20 bg-primary/5">
              <h3 className="font-semibold mb-3">Pricing Guide</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1-5 Rooms:</span>
                  <span className="font-semibold">$50,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">6-20 Rooms:</span>
                  <span className="font-semibold">Custom Quote</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">21+ Rooms:</span>
                  <span className="font-semibold">Enterprise Quote</span>
                </div>
              </div>
            </Card>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <a href="mailto:Michael@CroweLogic.com" className="hover:text-primary">
                  Michael@CroweLogic.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Response within 24-48 hours</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-6">Request a Custom Quote</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Smith"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@company.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Facility Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="City, State/Country"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="facilityType">Facility Type *</Label>
                    <select
                      id="facilityType"
                      name="facilityType"
                      value={formData.facilityType}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select Type</option>
                      <option value="boutique">Boutique/Gourmet (1-5 rooms)</option>
                      <option value="small-commercial">Small Commercial (6-20 rooms)</option>
                      <option value="commercial">Commercial (21-50 rooms)</option>
                      <option value="enterprise">Enterprise (50+ rooms)</option>
                      <option value="research">Research Facility</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="roomCount">Number of Rooms *</Label>
                    <Input
                      id="roomCount"
                      name="roomCount"
                      type="number"
                      value={formData.roomCount}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 10"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="timeline">Project Timeline *</Label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select Timeline</option>
                      <option value="immediate">Immediate (0-3 months)</option>
                      <option value="short">Short-term (3-6 months)</option>
                      <option value="medium">Medium-term (6-12 months)</option>
                      <option value="long">Long-term (12+ months)</option>
                      <option value="planning">Planning Phase</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Estimated Budget Range</Label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select Range</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-250k">$100,000 - $250,000</option>
                      <option value="250k-500k">$250,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m-5m">$1,000,000 - $5,000,000</option>
                      <option value="5m+">$5,000,000+</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Project Details *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please describe your project, specific requirements, and any questions you have..."
                    className="mt-2 min-h-[150px]"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Request Custom Quote
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    By submitting this form, you agree to be contacted regarding your project.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="border-t border-border bg-gradient-to-b from-background to-primary/5 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recent Project Highlights</h2>
            <p className="text-muted-foreground">
              Trusted by cultivation facilities worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <MapPin className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Abu Dhabi, UAE</h3>
              <p className="text-muted-foreground text-sm mb-3">
                80-room commercial facility
              </p>
              <Badge variant="outline" className="border-primary/20">$2.25M Project</Badge>
            </Card>
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <Building2 className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">North America</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Multiple boutique gourmet facilities
              </p>
              <Badge variant="outline" className="border-primary/20">5-15 Rooms</Badge>
            </Card>
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Research Facilities</h3>
              <p className="text-muted-foreground text-sm mb-3">
                University and private research labs
              </p>
              <Badge variant="outline" className="border-primary/20">Custom Solutions</Badge>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
