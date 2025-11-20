"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AI_MODELS } from "@/lib/ai-models-marketplace"
import { Check, Star, Zap, ArrowRight } from "lucide-react"
import { useState } from "react"

export default function AIModelsPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (modelId: string) => {
    setLoading(modelId)
    try {
      const response = await fetch("/api/ai-models/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Failed to create subscription")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Failed to initiate subscription. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const categories = [
    { id: "azure-openai", name: "Azure OpenAI Models", description: "Enterprise-grade AI powered by Microsoft Azure" },
    { id: "azure-ai", name: "Azure AI Services", description: "Specialized computer vision and multi-agent systems" },
    { id: "custom-models", name: "Custom Fine-Tuned Models", description: "Models trained on Michael's expertise" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-accent" />
            <h1 className="text-5xl font-bold text-foreground">AI Model Access</h1>
          </div>
          <p className="text-foreground/70 text-lg max-w-3xl">
            Subscribe to enterprise AI models hosted on Azure for your cultivation applications. Get API access, SDKs, and expert support.
          </p>
        </div>

        {/* Value Proposition */}
        <Card className="bg-gradient-to-br from-accent/10 via-card to-card border-accent/20 mb-16">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Why Subscribe?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-accent font-semibold mb-2">Azure Infrastructure</div>
                <p className="text-sm text-foreground/70">Enterprise-grade reliability and security</p>
              </div>
              <div>
                <div className="text-accent font-semibold mb-2">Expert Models</div>
                <p className="text-sm text-foreground/70">Fine-tuned on mycology domain knowledge</p>
              </div>
              <div>
                <div className="text-accent font-semibold mb-2">API Access</div>
                <p className="text-sm text-foreground/70">REST APIs and Python SDKs included</p>
              </div>
              <div>
                <div className="text-accent font-semibold mb-2">Usage Analytics</div>
                <p className="text-sm text-foreground/70">Real-time monitoring and insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Categories */}
        {categories.map((category) => {
          const categoryModels = AI_MODELS.filter((m) => m.category === category.id)

          if (categoryModels.length === 0) return null

          return (
            <div key={category.id} className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">{category.name}</h2>
                <p className="text-foreground/60">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryModels.map((model) => (
                  <Card
                    key={model.id}
                    className={`bg-card border-border/50 hover:border-accent/50 transition-all duration-300 flex flex-col ${
                      model.popular ? "ring-2 ring-accent/30 shadow-lg" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={model.modelType === "fine-tuned" ? "default" : "secondary"}>
                              {model.modelType.toUpperCase()}
                            </Badge>
                            {model.popular && (
                              <Badge className="bg-accent text-accent-foreground">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl text-foreground">{model.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-foreground/60 min-h-[3rem]">
                        {model.description}
                      </CardDescription>

                      {/* Key Stats */}
                      {model.rateLimits && (
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/30">
                          <div>
                            <div className="text-xs text-foreground/50">Requests/min</div>
                            <div className="text-lg font-bold text-foreground">
                              {model.rateLimits.requestsPerMinute}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-foreground/50">Tokens/min</div>
                            <div className="text-lg font-bold text-foreground">
                              {(model.rateLimits.tokensPerMinute / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-3xl font-bold text-foreground mt-6">
                        ${model.monthlyPrice}
                        <span className="text-base font-normal text-foreground/60">/month</span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-2.5 mb-6 flex-1">
                        {model.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/70">
                            <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleSubscribe(model.id)}
                        disabled={loading === model.id}
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {loading === model.id ? (
                          "Processing..."
                        ) : (
                          <>
                            Subscribe Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {/* FAQ Section */}
        <Card className="bg-card/50 border-border/50 mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How do I access my API keys?</h4>
                <p className="text-sm text-foreground/70">
                  After subscribing, you'll receive API keys in your account dashboard. You can regenerate keys anytime.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-foreground/70">
                  Yes! Cancel anytime and you'll retain access until the end of your billing period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">What happens if I exceed rate limits?</h4>
                <p className="text-sm text-foreground/70">
                  Requests will be throttled. Contact us for custom plans with higher limits.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Do you offer enterprise plans?</h4>
                <p className="text-sm text-foreground/70">
                  Yes! Contact us for custom enterprise plans with dedicated infrastructure and support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-br from-accent/5 via-card to-card border-accent/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">Need Custom AI Solutions?</h3>
            <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
              We offer custom model fine-tuning, dedicated infrastructure, and enterprise support packages.
            </p>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:michael@crowelogic.com">Contact Sales</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
