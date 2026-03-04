import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, BookOpen, Mail, ArrowRight } from "lucide-react"
import { ConversionTracker } from "@/components/conversion-tracker"

export default function ThanksPage() {
  return (
    <main className="min-h-screen px-4 py-20">
      <Suspense fallback={null}>
        <ConversionTracker />
      </Suspense>
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Confirmation Card */}
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-2 text-4xl font-bold text-foreground">You're In!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for purchasing The Mushroom Grower. Your order confirmation and download links have been sent to your email.
          </p>
        </div>

        {/* What You Got */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            What's Included
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-semibold text-foreground">The Mushroom Grower Vol 1 & Vol 2</p>
                <p className="text-sm text-muted-foreground">Complete cultivation system from beginner to commercial scale, built on 18+ years of hands-on experience</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-semibold text-foreground">SOP Playbook (632 Pages)</p>
                <p className="text-sm text-muted-foreground">Your free bonus, step-by-step standard operating procedures for every stage of cultivation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-semibold text-foreground">Crowe Logic AI Platform Access</p>
                <p className="text-sm text-muted-foreground">AI-powered contamination detection, species identification, and growing intelligence tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Next Steps</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
              <p className="text-muted-foreground">Check your email for the order confirmation and download links</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span>
              <p className="text-muted-foreground">Download your copies of The Mushroom Grower Vol 1 & Vol 2</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span>
              <p className="text-muted-foreground">Start with Vol 1, Chapter 1 and follow the cultivation system in order</p>
            </li>
          </ol>
        </div>

        {/* CTA + Support */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button className="flex-1 rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90" size="lg" asChild>
            <a href="/">
              <ArrowRight className="mr-2 h-4 w-4" />
              Explore Crowe Logic AI
            </a>
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl border-border font-bold" size="lg" asChild>
            <a href="mailto:michael@southwestmushrooms.com">
              <Mail className="mr-2 h-4 w-4" />
              Need Help? Email Support
            </a>
          </Button>
        </div>

        {/* Share the Knowledge */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="mb-3 text-sm font-semibold text-foreground">Know someone who should be growing mushrooms?</p>
          <Button variant="outline" className="rounded-xl border-border font-bold" asChild>
            <a href="https://buy.southwestmushrooms.com/b/00w6oHgjW63O6MO0haejK02" target="_blank" rel="noopener noreferrer">
              Share The Mushroom Grower
            </a>
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">&copy; 2026 Crowe Logic AI &middot; Southwest Mushrooms</p>
      </div>
    </main>
  )
}
