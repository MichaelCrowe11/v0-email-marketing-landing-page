"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Camera, Loader2, CheckCircle2, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserSubscription } from "@/lib/subscription"
import { FeatureGate } from "@/components/feature-gate"

interface AnalysisResult {
  species?: string
  confidence: number
  growthStage?: string
  contamination: {
    detected: boolean
    type?: string
    severity?: "low" | "medium" | "high" | "critical"
    recommendations?: string[]
  }
  healthScore: number
  observations: string[]
  recommendations: string[]
}

export default async function CroweVisionPage() {
  const subscription = await getUserSubscription()
  const hasAccess = subscription.features.crowe_vision

  return (
    <FeatureGate hasAccess={hasAccess} feature="Crowe Vision" requiredTier="pro">
      <CroweVisionContent />
    </FeatureGate>
  )
}

function CroweVisionContent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        setBlobUrl(data.url)
      }
    } catch (error) {
      console.error("[v0] Upload failed:", error)
    } finally {
      setUploading(false)
    }

    setResult(null)
  }

  const analyzeImage = async () => {
    if (!blobUrl) return

    setAnalyzing(true)
    try {
      const response = await fetch("/api/crowe-vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: blobUrl }),
      })

      const data = await response.json()
      setResult(data.analysis)
    } catch (error) {
      console.error("[v0] Analysis failed:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-destructive/80 text-destructive-foreground"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Camera className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-black">Crowe Vision</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered computer vision for mushroom cultivation. Upload images for instant contamination detection,
            species identification, and growth stage analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Upload a photo of your mushroom cultivation for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedImage ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={analyzeImage}
                      disabled={analyzing || uploading || !blobUrl}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null)
                        setBlobUrl(null)
                        setResult(null)
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>AI-powered insights from Crowe Vision</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Info className="w-12 h-12 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Upload and analyze an image to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Species & Confidence */}
                  {result.species && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Species Identification</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-base">
                          {result.species}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{result.confidence}% confidence</span>
                      </div>
                    </div>
                  )}

                  {/* Growth Stage */}
                  {result.growthStage && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Growth Stage</h3>
                      <Badge variant="outline">{result.growthStage}</Badge>
                    </div>
                  )}

                  {/* Health Score */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Health Score</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${result.healthScore}%` }} />
                      </div>
                      <span className="text-sm font-medium">{result.healthScore}%</span>
                    </div>
                  </div>

                  {/* Contamination Alert */}
                  {result.contamination.detected && (
                    <Alert className="border-destructive/50 bg-destructive/10">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Contamination Detected:</span>
                            <Badge className={getSeverityColor(result.contamination.severity)}>
                              {result.contamination.type}
                            </Badge>
                          </div>
                          {result.contamination.recommendations && (
                            <ul className="text-sm space-y-1 mt-2">
                              {result.contamination.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-destructive">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {!result.contamination.detected && (
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        <span className="font-semibold text-green-600">No contamination detected</span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Observations */}
                  {result.observations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Observations</h3>
                      <ul className="text-sm space-y-1">
                        {result.observations.map((obs, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {obs}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Recommendations</h3>
                      <ul className="text-sm space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Contamination Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Identifies bacterial, mold, and fungal contamination with severity assessment and remediation guidance.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Species Identification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Recognizes 100+ mushroom species with confidence scoring and growth stage classification.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Growth Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tracks development stages, health metrics, and provides cultivation recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
