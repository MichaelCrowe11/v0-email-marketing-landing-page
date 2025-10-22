import { Button } from "@/components/ui/button"

export default function ThanksPage() {
  return (
    <main className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">You're in — Crowe Logic AI</h1>
          <p className="mb-8 text-muted-foreground">
            Start here: open your model, complete the quick intake, then generate your first SOP or BE forecast.
          </p>
          <div className="mb-6 flex flex-wrap gap-3">
            <Button className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90" asChild>
              <a href="https://buy.stripe.com/eVq9AT4pz7ZN2tGcN4ao814" target="_blank" rel="noopener noreferrer">
                Open Core
              </a>
            </Button>
            <Button className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90" asChild>
              <a href="https://buy.stripe.com/eVq7sL9JT2Ft3xKaEWao815" target="_blank" rel="noopener noreferrer">
                Open Spawn Master
              </a>
            </Button>
            <Button className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90" asChild>
              <a href="https://buy.stripe.com/dRm14n09jbbZgkwdR8ao816" target="_blank" rel="noopener noreferrer">
                Open Substrate Tech
              </a>
            </Button>
            <Button className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90" asChild>
              <a href="https://buy.stripe.com/9B69AT09jfsf4BOfZgao817" target="_blank" rel="noopener noreferrer">
                Open Full Access
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Want continuous updates after year one?{" "}
            <Button
              variant="outline"
              className="ml-2 rounded-xl border-border bg-transparent font-bold text-foreground hover:bg-secondary"
              asChild
            >
              <a href="https://buy.stripe.com/5kQ4gzcW57ZN0ly4gyao818" target="_blank" rel="noopener noreferrer">
                Add Updates & Support ($49/yr)
              </a>
            </Button>
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">© 2025 Crowe Logic AI · Southwest Mushrooms</p>
      </div>
    </main>
  )
}
