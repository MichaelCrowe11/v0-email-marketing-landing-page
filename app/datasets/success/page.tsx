"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (!sessionId) {
      router.push("/datasets")
    }
    // In production, you'd verify the session and get download token
    setLoading(false)
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-accent/30">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-20 h-20 text-accent" />
          </div>
          <CardTitle className="text-3xl text-foreground">Purchase Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-foreground/70 mb-4">
              Thank you for your purchase! Your dataset is ready to download.
            </p>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground/80">
                Download instructions and access credentials have been sent to your email.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/dashboard">
                <Download className="w-5 h-5 mr-2" />
                Go to Dashboard to Download
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href="/datasets">
                Browse More Datasets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t border-border/30">
            <h3 className="font-semibold text-foreground mb-3">Next Steps:</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Check your email for download credentials and documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Visit your dashboard to access download links and API keys</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Review the included documentation and sample notebooks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                <span>Contact support if you need assistance: michael@crowelogic.com</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DatasetSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
