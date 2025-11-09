"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  Star,
  Shield,
  CheckCircle2,
  Code,
  FileText,
  Play,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const modelDetails: Record<string, any> = {
  "crios-nova": {
    name: "CriOS Nova",
    tagline: "Enterprise Drug Discovery Agent",
    description:
      "Advanced AI agent specialized in psychedelic compound analysis, synthesis pathway optimization, and regulatory compliance. Trained on proprietary datasets spanning 18 years of pharmaceutical research.",
    category: "Drug Discovery",
    version: "2.1.0",
    downloads: 2847,
    rating: 4.9,
    validated: true,
    status: "Production",
    price: "Enterprise",
    license: "Commercial",
    features: [
      "Psilocybin synthesis pathway optimization",
      "Compound structure prediction and analysis",
      "Regulatory compliance checking (FDA/EMA)",
      "Yield forecasting and optimization",
      "Real-time contamination detection",
      "Batch consistency monitoring",
      "GMP compliance reporting",
      "Integration with LIMS systems",
    ],
    specs: {
      accuracy: "94%",
      speed: "120ms avg response",
      context: "150K tokens",
      training: "18 years production data",
      architecture: "Transformer + CNN hybrid",
      parameters: "7.2B parameters",
    },
    deployment: {
      api: "REST API & Python SDK",
      hosting: "Cloud or on-premise",
      scale: "Auto-scaling to 10K req/s",
      sla: "99.9% uptime guarantee",
    },
    useCases: [
      {
        title: "Pharmaceutical Manufacturing",
        description: "Optimize synthesis pathways and predict yields for psychedelic compounds in GMP facilities",
      },
      {
        title: "Research & Development",
        description: "Accelerate drug discovery by analyzing compound structures and predicting biological activity",
      },
      {
        title: "Quality Control",
        description: "Real-time contamination detection and batch consistency monitoring for regulatory compliance",
      },
    ],
    codeExample: `from crowe_logic import CriOSNova

# Initialize the model
model = CriOSNova(api_key="your_api_key")

# Analyze compound structure
result = model.analyze_compound(
    compound="psilocybin",
    parameters={
        "temperature": 298,
        "pressure": 1.0,
        "substrate": "grain_based"
    }
)

# Get synthesis pathway
pathway = model.optimize_synthesis(
    target_compound="psilocybin",
    constraints={"yield": 0.85, "purity": 0.99}
)

print(f"Predicted yield: {result.yield}%")
print(f"Optimal pathway: {pathway.steps}")`,
  },
  "contamination-classifier": {
    name: "Contamination Classifier",
    tagline: "Real-time Quality Control Vision Model",
    description:
      "Computer vision model for detecting and classifying contamination in biological cultivation environments. Trained on 18 years of production data with 96% accuracy.",
    category: "Agriculture",
    version: "3.0.1",
    downloads: 3201,
    rating: 4.8,
    validated: true,
    status: "Production",
    price: "$299/month",
    license: "Commercial",
    features: [
      "Real-time contamination detection",
      "Multi-class classification (bacteria, mold, pests)",
      "Severity assessment and recommendations",
      "Batch tracking and alerts",
      "Integration with Crowe-Sense hardware",
      "Historical trend analysis",
      "Automated reporting",
      "Mobile app support",
    ],
    specs: {
      accuracy: "96%",
      speed: "85ms per image",
      context: "200K token context",
      training: "847 cultivation datasets",
      architecture: "Vision Transformer",
      parameters: "3.8B parameters",
    },
    deployment: {
      api: "REST API & Edge deployment",
      hosting: "Cloud, edge, or hybrid",
      scale: "Real-time video processing",
      sla: "99.9% uptime guarantee",
    },
    useCases: [
      {
        title: "Commercial Cultivation",
        description: "Monitor thousands of growing containers simultaneously with automated contamination detection",
      },
      {
        title: "Research Facilities",
        description: "Track contamination patterns across experiments and identify root causes",
      },
      {
        title: "Quality Assurance",
        description: "Ensure product quality and reduce waste with early contamination detection",
      },
    ],
    codeExample: `from crowe_logic import ContaminationClassifier

# Initialize the model
model = ContaminationClassifier(api_key="your_api_key")

# Classify an image
result = model.classify_image(
    image_path="cultivation_sample.jpg",
    threshold=0.85
)

print(f"Contamination: {result.contaminated}")
print(f"Type: {result.contamination_type}")
print(f"Severity: {result.severity}")
print(f"Confidence: {result.confidence}%")
print(f"Action: {result.recommendation}")`,
  },
}

export default function ModelDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const model = modelDetails[id]

  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Model Not Found</h1>
          <p className="text-muted-foreground mb-4">The model you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/marketplace">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </Button>

        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">{model.name}</h1>
                  {model.validated && <Shield className="w-6 h-6 text-secondary" />}
                </div>
                <p className="text-xl text-muted-foreground mb-4">{model.tagline}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                    v{model.version}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="font-semibold">{model.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="w-4 h-4" />
                    {model.downloads.toLocaleString()} downloads
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">{model.category}</Badge>
                </div>
              </div>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">{model.description}</p>
          </div>

          {/* Sidebar CTA */}
          <div className="enterprise-card p-6">
            <div className="text-3xl font-bold text-foreground mb-2">{model.price}</div>
            <p className="text-sm text-muted-foreground mb-6">{model.license} License</p>
            <div className="space-y-3 mb-6">
              <Button size="lg" className="w-full btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Deploy Model
              </Button>
              <Button size="lg" variant="outline" className="w-full bg-transparent">
                <Play className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </div>
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">{model.status}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">SLA</span>
                <span className="font-semibold text-foreground">{model.deployment.sla}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Support</span>
                <span className="font-semibold text-foreground">24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="code">Code Examples</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Features */}
            <div className="enterprise-card p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {model.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div className="enterprise-card p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Use Cases</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {model.useCases.map((useCase: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-lg bg-muted/30 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Performance Specs */}
              <div className="enterprise-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Performance</h2>
                <div className="space-y-4">
                  {Object.entries(model.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="font-semibold text-foreground">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment */}
              <div className="enterprise-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Deployment</h2>
                <div className="space-y-4">
                  {Object.entries(model.deployment).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="font-semibold text-foreground">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code">
            <div className="enterprise-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Quick Start</h2>
                <Button variant="outline" size="sm">
                  <Code className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              <pre className="p-6 bg-muted/50 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono text-foreground">{model.codeExample}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="docs">
            <div className="enterprise-card p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Documentation</h2>
              <div className="space-y-4">
                <Link
                  href="/docs"
                  className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-foreground">Getting Started Guide</h3>
                        <p className="text-sm text-muted-foreground">Installation and basic usage</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Link>
                <Link
                  href="/docs"
                  className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-foreground">API Reference</h3>
                        <p className="text-sm text-muted-foreground">Complete API documentation</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
