import Image from "next/image"

export function AIShowcase() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">See the AI in action</h2>
            <p className="text-lg text-muted-foreground">
              The same ChatGPT interface you know, trained with Michael's 20 years of mycology expertise
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            <Image src="/chatgpt-interface-screenshot.jpeg" alt="Crowe Logic AI ChatGPT Interface" width={1200} height={800} className="w-full" />
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
