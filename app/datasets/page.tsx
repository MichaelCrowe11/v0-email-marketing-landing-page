"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DATASETS } from "@/lib/datasets"
import { Check, Star, Database, Download } from "lucide-react"
import { useState } from "react"

export default function DatasetsPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (datasetId: string) => {
    setLoading(datasetId)
    try {
      const response = await fetch("/api/datasets/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datasetId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("Purchase error:", error)
      alert("Failed to initiate purchase. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-12 h-12 text-accent" />
            <h1 className="text-5xl font-bold text-foreground">Dataset Marketplace</h1>
          </div>
          <p className="text-foreground/70 text-lg max-w-3xl">
            Premium mushroom cultivation datasets for AI/ML training, research, and commercial applications. Curated from 500+ hours of professional cultivation processes.
          </p>
        </div>

        {/* Value Proposition */}
        <Card className="bg-gradient-to-br from-accent/10 via-card to-card border-accent/20 mb-16">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Why Our Datasets?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-accent font-semibold mb-2">Expert Knowledge</div>
                <p className="text-sm text-foreground/70">20+ years of commercial cultivation expertise</p>
              </div>
              <div>
                <div className="text-accent font-semibold mb-2">Multi-Modal Data</div>
                <p className="text-sm text-foreground/70">Video frames, audio, transcripts, and metadata</p>
              </div>
              <div>
                <div className="text-accent font-semibold mb-2">High Quality Labels</div>
                <p className="text-sm text-foreground/70">Professional annotations and timestamped processes</p>
              </div>
              <div>
                <div className="text-accent font-semibold mb-2">Rare Domain</div>
                <p className="text-sm text-foreground/70">Specialized agricultural automation dataset</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {DATASETS.map((dataset) => (
            <Card
              key={dataset.id}
              className={`bg-card border-border/50 hover:border-accent/50 transition-all duration-300 flex flex-col ${
                dataset.popular ? "ring-2 ring-accent/30 shadow-lg" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Badge className="mb-3" variant={dataset.category === "enterprise" ? "default" : "secondary"}>
                      {dataset.category.toUpperCase()}
                    </Badge>
                    <CardTitle className="text-2xl text-foreground">{dataset.name.split(" - ")[1]}</CardTitle>
                  </div>
                  {dataset.popular && (
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-foreground/60 min-h-[3rem]">{dataset.description}</CardDescription>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/30">
                  <div>
                    <div className="text-xs text-foreground/50">Samples</div>
                    <div className="text-lg font-bold text-foreground">{dataset.sampleCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-foreground/50">Size</div>
                    <div className="text-lg font-bold text-foreground">{dataset.downloadSize}</div>
                  </div>
                </div>

                {/* Formats */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {dataset.formats.map((format) => (
                    <Badge key={format} variant="outline" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                </div>

                <div className="text-4xl font-bold text-foreground mt-6">
                  ${dataset.price.toLocaleString()}
                  <span className="text-base font-normal text-foreground/60"> one-time</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2.5 mb-6 flex-1">
                  {dataset.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/70">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <Button
                    onClick={() => handlePurchase(dataset.id)}
                    disabled={loading === dataset.id}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {loading === dataset.id ? (
                      "Processing..."
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Purchase Dataset
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-center text-foreground/50">
                    {dataset.license}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">Need Custom Datasets or Enterprise Solutions?</h3>
            <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
              We offer custom dataset curation, annotation services, and exclusive licensing options for enterprise clients.
            </p>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:michael@crowelogic.com">Contact Us</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
