"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, XCircle, Shield, Eye, Droplets } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

export default function ContaminationGuidePage() {
  const [contaminants, setContaminants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadContaminants()
  }, [])

  async function loadContaminants() {
    try {
      const { data, error } = await supabase
        .from("contamination_guide")
        .select("*")
        .order("severity_level", { ascending: false })

      if (error) throw error
      setContaminants(data || [])
    } catch (error) {
      console.error("[v0] Error loading contamination guide:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "moderate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-accent/10 text-accent border-accent/20"
    }
  }

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "high":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case "moderate":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "low":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-accent" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading contamination guide...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-foreground">Contamination Prevention & Identification</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Contamination Field Guide</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rapid identification, containment strategies, and prevention protocols from 20+ years of commercial
            cultivation experience.
          </p>
        </div>

        {/* Prevention First Alert */}
        <Alert className="border-green-500/20 bg-green-500/5">
          <Shield className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-600 dark:text-green-400">Prevention is Everything</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            The best contamination strategy is prevention. Proper sterilization, clean technique, and environmental
            control eliminate 95% of contamination issues before they start. This guide is for the other 5%.
          </AlertDescription>
        </Alert>

        {/* Contaminants Grid */}
        <div className="space-y-6">
          {contaminants.map((contaminant) => (
            <Card
              key={contaminant.id}
              className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getSeverityIcon(contaminant.severity_level)}</div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-2xl mb-2">{contaminant.contaminant_name}</CardTitle>
                      <CardDescription className="text-base">{contaminant.visual_description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(contaminant.severity_level)}>
                    {contaminant.severity_level} severity
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="identification" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="identification">Identification</TabsTrigger>
                    <TabsTrigger value="causes">Causes</TabsTrigger>
                    <TabsTrigger value="prevention">Prevention</TabsTrigger>
                    <TabsTrigger value="treatment">Treatment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="identification" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-accent" />
                          <h4 className="font-semibold text-foreground">Visual Indicators</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {contaminant.color_indicators?.map((color: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-accent" />
                          <h4 className="font-semibold text-foreground">Growth Pattern</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{contaminant.growth_pattern}</p>
                      </div>
                    </div>

                    {contaminant.smell_indicators && (
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-sm font-medium text-foreground mb-1">Smell</p>
                        <p className="text-sm text-muted-foreground">{contaminant.smell_indicators}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="causes" className="space-y-3">
                    <h4 className="font-semibold text-foreground">Common Causes</h4>
                    <ul className="space-y-2">
                      {contaminant.common_causes?.map((cause: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="prevention" className="space-y-3">
                    <h4 className="font-semibold text-foreground">Prevention Methods</h4>
                    <ul className="space-y-2">
                      {contaminant.prevention_methods?.map((method: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{method}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="treatment" className="space-y-3">
                    <h4 className="font-semibold text-foreground">Treatment Options</h4>
                    <ul className="space-y-2">
                      {contaminant.treatment_options?.map((treatment: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Tips */}
        <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
          <CardHeader>
            <CardTitle>Michael Crowe's Contamination Wisdom</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-foreground mb-2">Rule #1: Speed Matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Contamination spreads exponentially. What looks like a small spot today can overtake an entire block in
                48 hours. Isolate and assess immediately.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-foreground mb-2">Rule #2: Learn from Every Loss</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep a contamination log. Track when, where, and what type. Patterns emerge that reveal weak points in
                your process. Every contaminated block is a teacher.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-foreground mb-2">Rule #3: Environment Beats Genetics</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The best spawn in the world will lose to contamination in a dirty environment. Clean air, proper
                sterilization, and good technique are non-negotiable.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
