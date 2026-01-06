"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, XCircle, Shield, Eye, Droplets, Info } from "lucide-react"

export const dynamic = "force-dynamic"

const FALLBACK_CONTAMINANTS = [
  {
    id: "1",
    contaminant_name: "Trichoderma (Green Mold)",
    visual_description:
      "Aggressive green mold that starts white then turns bright green. One of the most common and aggressive contaminants in mushroom cultivation.",
    severity_level: "critical",
    color_indicators: ["White (early)", "Bright Green", "Dark Green (mature)"],
    growth_pattern:
      "Starts as white fuzzy patches, rapidly turns green within 24-48 hours. Spreads aggressively across substrate surface.",
    smell_indicators: "Sweet, earthy, coconut-like smell when mature",
    common_causes: [
      "Incomplete sterilization of substrate",
      "Contaminated spawn or culture",
      "Poor air filtration in fruiting room",
      "Working in unclean conditions",
      "Cross-contamination from infected blocks",
    ],
    prevention_methods: [
      "Ensure complete sterilization (15 PSI for 2.5 hours minimum)",
      "Use HEPA filtration in all work areas",
      "Maintain strict sterile technique",
      "Quarantine new spawn before use",
      "Regular cleaning and sanitization protocols",
    ],
    treatment_options: [
      "Immediate isolation - remove from grow area",
      "Do NOT open contaminated bags indoors",
      "Dispose of in sealed bags away from grow facility",
      "Deep clean affected area with 10% bleach solution",
      "Review and improve sterilization protocols",
    ],
  },
  {
    id: "2",
    contaminant_name: "Cobweb Mold (Dactylium)",
    visual_description:
      "Wispy, gray, cotton-like growth that spreads rapidly across the surface. Often confused with healthy mycelium but is much more delicate and gray.",
    severity_level: "high",
    color_indicators: ["Gray", "White-gray", "Wispy appearance"],
    growth_pattern:
      "Extremely fast spreading, wispy cobweb-like strands. Can cover entire surface in 24 hours. Much less dense than healthy mycelium.",
    smell_indicators: "Musty, basement-like odor",
    common_causes: [
      "High humidity with poor air circulation",
      "Stagnant air in fruiting chamber",
      "Contaminated casing layer",
      "Overwatering or waterlogged substrate",
      "Introduction from outdoor air",
    ],
    prevention_methods: [
      "Maintain proper FAE (fresh air exchange)",
      "Keep humidity below 95% during fruiting",
      "Use clean, pasteurized casing materials",
      "Ensure good air circulation",
      "Monitor and control environmental conditions",
    ],
    treatment_options: [
      "Increase fresh air exchange immediately",
      "Reduce humidity to 80-85%",
      "Spot treat with 3% hydrogen peroxide spray",
      "Remove heavily affected areas if localized",
      "If widespread, dispose and restart",
    ],
  },
  {
    id: "3",
    contaminant_name: "Black Mold (Aspergillus niger)",
    visual_description:
      "Dark black or very dark green powdery mold. Extremely dangerous - produces mycotoxins. Never handle without respiratory protection.",
    severity_level: "critical",
    color_indicators: ["Black", "Dark brown-black", "Powdery texture"],
    growth_pattern: "Starts as small dark spots, develops powdery black spore masses. Spreads through air easily.",
    smell_indicators: "Strong musty, chemical odor",
    common_causes: [
      "Contaminated substrate or grain",
      "High temperature environments",
      "Poor sterilization",
      "Contaminated air supply",
      "Decaying organic matter nearby",
    ],
    prevention_methods: [
      "Strict sterilization protocols",
      "HEPA filtration essential",
      "Maintain clean facility",
      "Control temperature (avoid high heat)",
      "Regular air quality testing",
    ],
    treatment_options: [
      "WEAR RESPIRATORY PROTECTION (N95 minimum)",
      "Immediately seal and remove contaminated material",
      "Do not attempt to save - dispose safely",
      "Deep sanitize entire grow area",
      "Consider professional remediation if widespread",
    ],
  },
  {
    id: "4",
    contaminant_name: "Bacterial Blotch",
    visual_description:
      "Slimy, wet-looking brown or yellow spots on mushroom caps. Caused by Pseudomonas bacteria rather than mold.",
    severity_level: "moderate",
    color_indicators: ["Brown spots", "Yellow discoloration", "Slimy wet appearance"],
    growth_pattern: "Appears on mature mushroom caps as wet, slimy patches. Does not spread through substrate.",
    smell_indicators: "Foul, rotting smell",
    common_causes: [
      "Water sitting on mushroom caps",
      "High humidity without air movement",
      "Dirty harvesting practices",
      "Contaminated misting water",
      "Poor hygiene in fruiting room",
    ],
    prevention_methods: [
      "Never mist directly on mushroom caps",
      "Maintain good air circulation",
      "Use clean, filtered water for misting",
      "Harvest before mushrooms become too wet",
      "Keep fruiting room clean",
    ],
    treatment_options: [
      "Remove affected mushrooms immediately",
      "Improve air circulation",
      "Reduce direct misting",
      "Harvest unaffected mushrooms promptly",
      "Clean and sanitize fruiting area",
    ],
  },
  {
    id: "5",
    contaminant_name: "Penicillium (Blue-Green Mold)",
    visual_description:
      "Blue-green powdery mold, similar to what grows on bread. Common in grain spawn and can indicate moisture issues.",
    severity_level: "high",
    color_indicators: ["Blue", "Blue-green", "Powdery surface"],
    growth_pattern:
      "Circular colonies with powdery blue-green spores. Often starts at moisture points or areas of poor colonization.",
    smell_indicators: "Sharp, cheese-like or musty odor",
    common_causes: [
      "Excess moisture in grain spawn",
      "Incomplete sterilization",
      "Wet spots in substrate",
      "Contaminated grain",
      "Poor storage conditions",
    ],
    prevention_methods: [
      "Proper grain hydration (not too wet)",
      "Complete sterilization cycles",
      "Good spawn storage conditions",
      "Use fresh, quality grain",
      "Maintain dry grain surface",
    ],
    treatment_options: [
      "Isolate affected spawn immediately",
      "Do not use contaminated spawn",
      "Review grain preparation moisture levels",
      "Dispose of contaminated material",
      "Clean spawn preparation area",
    ],
  },
  {
    id: "6",
    contaminant_name: "Wet Spot (Bacillus)",
    visual_description:
      "Slimy, wet, gray or translucent patches in grain spawn. Bacterial contamination that makes grain appear gelatinous.",
    severity_level: "moderate",
    color_indicators: ["Gray", "Translucent", "Wet/slimy appearance"],
    growth_pattern: "Appears as wet, slimy areas in grain. Grain becomes soft and mushy. Often smells sour.",
    smell_indicators: "Sour, fermented, rotten smell",
    common_causes: [
      "Grain too wet before sterilization",
      "Insufficient sterilization time",
      "Grain not properly dried after hydration",
      "Contaminated during inoculation",
      "Bacteria survived sterilization",
    ],
    prevention_methods: [
      "Proper grain hydration - surface dry",
      "Extended sterilization for wet grain",
      "Ensure grain is not clumping",
      "Use pressure cooker at proper PSI",
      "Allow grain to dry before bagging",
    ],
    treatment_options: [
      "Discard affected spawn entirely",
      "Do not attempt to salvage",
      "Review grain preparation process",
      "Extend sterilization time",
      "Ensure proper grain drying",
    ],
  },
  {
    id: "7",
    contaminant_name: "Lipstick Mold (Sporendonema)",
    visual_description:
      "Bright pink to red-orange powdery mold. Distinctive color makes it easy to identify. Relatively slow growing.",
    severity_level: "moderate",
    color_indicators: ["Pink", "Red-orange", "Coral colored"],
    growth_pattern: "Slow growing pink to red colonies. Powdery texture when mature. Less aggressive than green molds.",
    smell_indicators: "Mild, slightly sweet odor",
    common_causes: [
      "Contaminated substrate",
      "Poor sterilization",
      "Introduction from environment",
      "Contaminated cultures",
      "Old or degraded spawn",
    ],
    prevention_methods: [
      "Proper sterilization protocols",
      "Clean work environment",
      "Fresh spawn and cultures",
      "Good air filtration",
      "Regular facility cleaning",
    ],
    treatment_options: [
      "Isolate contaminated material",
      "Can sometimes be removed if caught early",
      "Monitor surrounding blocks closely",
      "Improve sterilization if recurring",
      "Dispose if spread is significant",
    ],
  },
  {
    id: "8",
    contaminant_name: "Yellow Metabolites (Mycelium Stress)",
    visual_description:
      "Yellow or amber liquid droplets on mycelium surface. Often mistaken for contamination but is actually a stress response from healthy mycelium.",
    severity_level: "low",
    color_indicators: ["Yellow", "Amber", "Golden droplets"],
    growth_pattern: "Liquid droplets appearing on mycelium surface. Mycelium underneath remains white and healthy.",
    smell_indicators: "No off-smell - normal mycelium odor",
    common_causes: [
      "Mycelium fighting off bacteria",
      "Environmental stress",
      "Temperature fluctuations",
      "Normal metabolic byproduct",
      "Healthy immune response",
    ],
    prevention_methods: [
      "Maintain stable temperatures",
      "Ensure proper sterilization",
      "Reduce environmental stress",
      "Usually not preventable - natural response",
      "Monitor but don't panic",
    ],
    treatment_options: [
      "Usually no treatment needed",
      "Monitor for actual contamination",
      "Improve environmental stability",
      "If excessive, improve sterilization",
      "Often resolves on its own",
    ],
  },
]

export default function ContaminationGuidePage() {
  const [contaminants, setContaminants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    loadContaminants()
  }, [])

  async function loadContaminants() {
    try {
      const response = await fetch("/api/contamination-guide")
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          setContaminants(data)
        } else {
          setContaminants(FALLBACK_CONTAMINANTS)
          setUsingFallback(true)
        }
      } else {
        setContaminants(FALLBACK_CONTAMINANTS)
        setUsingFallback(true)
      }
    } catch (error) {
      console.error("[v0] Error loading contamination guide, using fallback:", error)
      setContaminants(FALLBACK_CONTAMINANTS)
      setUsingFallback(true)
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

        {/* Fallback Notice */}
        {usingFallback && (
          <Alert className="border-blue-500/20 bg-blue-500/5">
            <Info className="h-5 w-5 text-blue-500" />
            <AlertTitle className="text-blue-600 dark:text-blue-400">Showing Reference Data</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Displaying comprehensive contamination guide with the most common contaminants encountered in mushroom
              cultivation.
            </AlertDescription>
          </Alert>
        )}

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
