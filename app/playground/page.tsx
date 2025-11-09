"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Copy, Download, Settings, Zap, Code, Microscope } from "lucide-react"

const models = [
  {
    id: "crios-substrate-analyst",
    name: "CriOS Substrate Analyst",
    description: "Optimizes substrate formulations and contamination analysis",
    category: "Production",
    badge: "Popular"
  },
  {
    id: "crios-sop-agent",
    name: "CriOS SOP Agent",
    description: "Generates and validates standard operating procedures",
    category: "Documentation",
    badge: "New"
  },
  {
    id: "crios-yield-forecaster",
    name: "CriOS Yield Forecaster",
    description: "Predicts harvest yields based on environmental data",
    category: "Analytics",
    badge: null
  },
  {
    id: "crios-genetics-advisor",
    name: "CriOS Genetics Advisor",
    description: "Species selection and strain optimization",
    category: "Research",
    badge: null
  },
]

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([2000])

  const handleRun = async () => {
    setIsLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/playground/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          prompt,
          temperature: temperature[0],
          maxTokens: maxTokens[0],
        }),
      })

      const data = await res.json()
      setResponse(data.response || "No response generated")
    } catch (error) {
      setResponse("Error: Unable to generate response")
    } finally {
      setIsLoading(false)
    }
  }

  const currentModel = models.find(m => m.id === selectedModel)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">AI Model Playground</h1>
              <p className="text-muted-foreground">Test and experiment with Crowe Logic AI models</p>
            </div>
            <Button variant="outline" className="pharma-btn-outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar - Model Selection */}
          <div className="space-y-6">
            <Card className="lab-card">
              <CardHeader>
                <CardTitle className="text-base data-heading">Select Model</CardTitle>
                <CardDescription>Choose an AI model to test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      selectedModel === model.id
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-sm">{model.name}</div>
                      {model.badge && (
                        <Badge className="sci-badge text-[10px]">{model.badge}</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{model.description}</div>
                    <div className="mt-2">
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {model.category}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Parameters */}
            <Card className="lab-card">
              <CardHeader>
                <CardTitle className="text-base data-heading">Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-xs font-medium text-foreground uppercase tracking-wide mb-2 block">
                    Temperature: <span className="metric-display">{temperature[0]}</span>
                  </label>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground uppercase tracking-wide mb-2 block">
                    Max Tokens: <span className="metric-display">{maxTokens[0]}</span>
                  </label>
                  <Slider
                    value={maxTokens}
                    onValueChange={setMaxTokens}
                    min={100}
                    max={4000}
                    step={100}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Area - Prompt & Response */}
          <div className="space-y-6">
            {/* Current Model Info */}
            {currentModel && (
              <Card className="lab-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-foreground/5 flex items-center justify-center">
                      <Microscope className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{currentModel.name}</h3>
                      <p className="text-sm text-muted-foreground">{currentModel.description}</p>
                    </div>
                    <Badge className="sci-badge">{currentModel.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prompt Input */}
            <Card className="lab-card">
              <CardHeader>
                <CardTitle className="text-base data-heading">Prompt</CardTitle>
                <CardDescription>Enter your research question or task</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Analyze substrate contamination patterns in oyster mushroom cultivation using spent coffee grounds as a supplement..."
                  className="w-full h-48 px-4 py-3 border border-border rounded-md bg-background font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-muted-foreground metric-display">
                    {prompt.length} characters
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRun}
                      disabled={!prompt.trim() || isLoading}
                      className="pharma-btn"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isLoading ? "Running..." : "Run"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response */}
            {(response || isLoading) && (
              <Card className="lab-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base data-heading">Response</CardTitle>
                    {response && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="pharma-btn-outline">
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" className="pharma-btn-outline">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center gap-3 p-4">
                      <div className="animate-spin w-5 h-5 border-2 border-foreground border-t-transparent rounded-full" />
                      <span className="text-sm text-muted-foreground">Generating response...</span>
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
                      {response}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
