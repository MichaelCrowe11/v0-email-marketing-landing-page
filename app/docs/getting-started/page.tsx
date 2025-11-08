import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Terminal, CheckCircle2, Package, Code, Sparkles } from "lucide-react"

export default function GettingStartedPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">Getting Started</Badge>
        <h1 className="text-4xl font-bold text-foreground mb-4">Quick Start Guide</h1>
        <p className="text-lg text-muted-foreground">
          Get up and running with Crowe Logic in under 5 minutes. This guide covers installation, authentication, and
          your first deployment.
        </p>
      </div>

      {/* Prerequisites */}
      <div className="enterprise-card p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-5 h-5 text-secondary" />
          <h2 className="text-2xl font-bold text-foreground">Prerequisites</h2>
        </div>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1">•</span>
            <span>Node.js 18+ or Python 3.9+</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1">•</span>
            <span>A Crowe Logic account (sign up for free)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary mt-1">•</span>
            <span>Basic understanding of biological systems (optional)</span>
          </li>
        </ul>
      </div>

      {/* Step 1 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold">1</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Install the CLI</h2>
        </div>
        <div className="enterprise-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">npm</span>
          </div>
          <pre className="p-4 bg-muted/50 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm font-mono text-foreground">npm install -g @crowe-logic/cli</code>
          </pre>
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">pip</span>
          </div>
          <pre className="p-4 bg-muted/50 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono text-foreground">pip install crowe-logic</code>
          </pre>
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold">2</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Authenticate</h2>
        </div>
        <div className="enterprise-card p-6">
          <pre className="p-4 bg-muted/50 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm font-mono text-foreground">crowe-logic login</code>
          </pre>
          <p className="text-sm text-muted-foreground">
            This will open your browser to authenticate. After successful login, you're ready to deploy.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold">3</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Deploy Your First Model</h2>
        </div>
        <div className="enterprise-card p-6">
          <p className="text-muted-foreground mb-4">
            Let's deploy a contamination classifier to analyze cultivation images:
          </p>
          <pre className="p-4 bg-muted/50 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm font-mono text-foreground">
              {`# Python example
from crowe_logic import ContaminationClassifier

# Initialize the model
model = ContaminationClassifier(api_key="your_api_key")

# Classify an image
result = model.classify_image("sample.jpg")

print(f"Contaminated: {result.contaminated}")
print(f"Type: {result.type}")
print(f"Confidence: {result.confidence}%")`}
            </code>
          </pre>
          <p className="text-sm text-muted-foreground">That's it! Your model is now analyzing images in real-time.</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="enterprise-card p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-2xl font-bold text-foreground mb-6">Next Steps</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/docs/ai-models"
            className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
          >
            <Sparkles className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Explore AI Models</h3>
            <p className="text-sm text-muted-foreground">Browse 150+ production-ready models</p>
          </Link>
          <Link
            href="/docs/synapse-lang"
            className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
          >
            <Code className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Learn Synapse-lang</h3>
            <p className="text-sm text-muted-foreground">Scientific programming language</p>
          </Link>
          <Link
            href="/docs/tutorials"
            className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
          >
            <Package className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">View Tutorials</h3>
            <p className="text-sm text-muted-foreground">Step-by-step video guides</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
