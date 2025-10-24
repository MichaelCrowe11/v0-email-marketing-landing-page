import { notFound } from "next/navigation"
import { getGPTProductById } from "@/lib/gpt-products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowLeft, ExternalLink, Sparkles, Brain, Database, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import GPTCheckout from "@/components/gpt-checkout"

export default function GPTDetailPage({ params }: { params: { gptId: string } }) {
  const gpt = getGPTProductById(params.gptId)

  if (!gpt) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/michaels-gpts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Michael's GPTs
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{gpt.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-foreground">{gpt.name}</h1>
                    {gpt.popular && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-foreground/70">{gpt.description}</p>
                </div>
              </div>
            </div>

            {/* Long Description */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">About This GPT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 leading-relaxed">{gpt.longDescription}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-3">
                  {gpt.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-foreground/70">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent" />
                  What It Can Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {gpt.capabilities.map((capability, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-foreground/70">
                      <Zap className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Knowledge Base */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Database className="w-5 h-5 text-accent" />
                  Training & Knowledge Base
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {gpt.knowledgeBase.map((knowledge, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-foreground/70">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{knowledge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Purchase */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Pricing Card */}
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <div className="text-4xl font-bold text-foreground mb-2">${gpt.price}</div>
                  <CardDescription>One-time payment • Lifetime access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">Includes:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2 text-foreground/70">
                        <Check className="w-4 h-4 text-accent mt-0.5" />
                        <span>Lifetime GPT access</span>
                      </li>
                      <li className="flex items-start gap-2 text-foreground/70">
                        <Check className="w-4 h-4 text-accent mt-0.5" />
                        <span>All future updates</span>
                      </li>
                      <li className="flex items-start gap-2 text-foreground/70">
                        <Check className="w-4 h-4 text-accent mt-0.5" />
                        <span>24/7 availability</span>
                      </li>
                      <li className="flex items-start gap-2 text-foreground/70">
                        <Check className="w-4 h-4 text-accent mt-0.5" />
                        <span>Platform integration option</span>
                      </li>
                    </ul>
                  </div>

                  <GPTCheckout gptId={gpt.id} />

                  {gpt.openAILink && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-foreground/60">Or</span>
                        </div>
                      </div>

                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <a href={gpt.openAILink} target="_blank" rel="noopener noreferrer">
                          Try on OpenAI First
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Trust Signals */}
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5" />
                    <span className="text-foreground/70">Secure payment via Stripe</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5" />
                    <span className="text-foreground/70">Instant access after purchase</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5" />
                    <span className="text-foreground/70">30-day satisfaction guarantee</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
