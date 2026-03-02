export function AIShowcase() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">See the AI in action</h2>
            <p className="text-lg text-muted-foreground">
              The same ChatGPT interface you know, trained with Michael's 18+ years of mycology expertise
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            <div className="relative w-full aspect-video bg-gradient-to-br from-card to-background flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <img src="/crowe-logic-logo.png" alt="Crowe Logic AI" className="w-24 h-24 mx-auto rounded-full ring-4 ring-primary/30" />
                <h3 className="text-2xl font-bold text-foreground">Crowe Logic AI</h3>
                <p className="text-muted-foreground max-w-md mx-auto">AI-powered mycology intelligence — ask anything about mushroom cultivation, contamination, substrates, and more.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground">Substrate formulation</p>
              <p className="mt-1 text-xs text-muted-foreground">Get optimal mix ratios for any species</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground">Extraction protocols</p>
              <p className="mt-1 text-xs text-muted-foreground">Step-by-step SOPs for dual-phase</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground">Yield diagnostics</p>
              <p className="mt-1 text-xs text-muted-foreground">Troubleshoot contamination issues</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground">Production planning</p>
              <p className="mt-1 text-xs text-muted-foreground">Build weekly sprint schedules</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
