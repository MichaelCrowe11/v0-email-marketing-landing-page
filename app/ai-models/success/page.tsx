"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Key, ArrowRight, Book } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (!sessionId) {
      router.push("/ai-models")
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-accent/30">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-20 h-20 text-accent" />
          </div>
          <CardTitle className="text-3xl text-foreground">Subscription Active!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-foreground/70 mb-4">
              Your AI model subscription is now active. Get started with your API access.
            </p>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground/80">
                Your API keys and documentation have been sent to your email.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/dashboard">
                <Key className="w-5 h-5 mr-2" />
                View API Keys
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href="/docs/api">
                <Book className="w-4 h-4 mr-2" />
                Read API Documentation
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href="/ai-models">
                Browse More Models
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t border-border/30">
            <h3 className="font-semibold text-foreground mb-3">Quick Start Guide:</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Retrieve your API key from the dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Review the API documentation and code examples</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Test your first API request using the provided SDKs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Monitor usage and analytics in your dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Need help? Email: michael@crowelogic.com</span>
              </li>
            </ul>
          </div>

          <div className="bg-card/50 border border-border/30 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Example API Request
            </h4>
            <pre className="text-xs bg-background/50 p-3 rounded overflow-x-auto">
              <code>{`curl https://api.crowelogic.com/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AIModelSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
