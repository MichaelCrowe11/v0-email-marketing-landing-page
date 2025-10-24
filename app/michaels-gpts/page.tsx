import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GPT_PRODUCTS } from "@/lib/gpt-products"
import Link from "next/link"
import { Check, Star, ExternalLink, Sparkles } from "lucide-react"

export default function MichaelsGPTsPage() {
  const categories = [
    { id: "cultivation", name: "Cultivation Experts", description: "AI assistants for growing mushrooms" },
    { id: "business", name: "Business Advisors", description: "Strategic guidance for mushroom farms" },
    { id: "research", name: "Research Assistants", description: "Academic and experimental support" },
    { id: "specialty", name: "Specialty Tools", description: "Focused problem-solving assistants" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Powered by OpenAI GPT-4</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">Michael's GPTs</h1>
          <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
            Custom AI assistants trained on Michael Crowe's 20+ years of professional mushroom cultivation experience.
            Available as standalone OpenAI GPTs or integrated into your Crowe Logic platform.
          </p>
        </div>

        {/* Value Proposition */}
        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 mb-16">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                <p className="text-foreground/70">Expert guidance anytime</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">20+ Years</div>
                <p className="text-foreground/70">Professional experience</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">One-Time</div>
                <p className="text-foreground/70">Lifetime access included</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPT Products by Category */}
        {categories.map((category) => {
          const categoryGPTs = GPT_PRODUCTS.filter((gpt) => gpt.category === category.id)

          if (categoryGPTs.length === 0) return null

          return (
            <div key={category.id} className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">{category.name}</h2>
                <p className="text-foreground/60">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryGPTs.map((gpt) => (
                  <Card
                    key={gpt.id}
                    className="bg-card border-border/50 hover:border-accent/50 transition-all duration-200 flex flex-col"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-4xl">{gpt.icon}</div>
                        {gpt.popular && (
                          <Badge className="bg-accent text-accent-foreground">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-foreground">{gpt.name}</CardTitle>
                      <CardDescription className="text-foreground/60">{gpt.description}</CardDescription>
                      <div className="text-3xl font-bold text-foreground mt-4">${gpt.price}</div>
                      <p className="text-sm text-foreground/60">one-time payment</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {gpt.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-foreground/70">
                              <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto space-y-2">
                        <Button asChild className="w-full bg-foreground text-background hover:bg-foreground/90">
                          <Link href={`/michaels-gpts/${gpt.id}`}>View Details</Link>
                        </Button>
                        {gpt.openAILink && (
                          <Button asChild variant="outline" className="w-full bg-transparent">
                            <a href={gpt.openAILink} target="_blank" rel="noopener noreferrer">
                              Try on OpenAI
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {/* Bundle Offer */}
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 mt-16">
          <CardContent className="p-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-accent text-accent-foreground mb-4">
                <Star className="w-3 h-3 mr-1" />
                Best Value
              </Badge>
              <h3 className="text-3xl font-bold text-foreground mb-3">Complete GPT Collection</h3>
              <p className="text-foreground/70 mb-6">
                Get all 6 GPT assistants for one discounted price. Save $200 compared to individual purchases.
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-2xl text-foreground/60 line-through">$603</span>
                <span className="text-4xl font-bold text-foreground">$397</span>
              </div>
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                Get Complete Collection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platform Integration */}
        <Card className="bg-card border-border/50 mt-16">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Platform Integration Available</h3>
                <p className="text-foreground/70 mb-4">
                  Already a Crowe Logic platform member? Add any GPT assistant directly to your dashboard for seamless
                  integration with your cultivation data.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-foreground/70">
                    <Check className="w-5 h-5 text-accent mt-0.5" />
                    <span>Access from your dashboard</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground/70">
                    <Check className="w-5 h-5 text-accent mt-0.5" />
                    <span>Integrated with your project data</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground/70">
                    <Check className="w-5 h-5 text-accent mt-0.5" />
                    <span>Contextual recommendations</span>
                  </li>
                </ul>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
              <div className="bg-accent/5 rounded-lg p-6 border border-accent/20">
                <h4 className="font-semibold text-foreground mb-3">How It Works:</h4>
                <ol className="space-y-3 text-sm text-foreground/70">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>Purchase your GPT assistant</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>Choose OpenAI access or platform integration</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>Start getting expert guidance 24/7</span>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
