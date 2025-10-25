export function ProofSection() {
  const proofs = [
    {
      image: "https://img.youtube.com/vi/-z0s3GwJxpM/maxresdefault.jpg",
      title: "Year of dataset curation",
      description:
        "Daily collection of strain performance, spawn cycles, substrate hydration, room telemetry, contamination logs, sales notes, and SOP revisions integrated into a unified core.",
    },
    {
      image: "https://img.youtube.com/vi/o-9_9lMnTjM/maxresdefault.jpg",
      title: "Transcribed knowledge",
      description:
        "Every YouTube video and consulting lesson was transcribed, labeled, and scaffolded into decision trees to mirror Michael's speech patterns and problem-solving.",
    },
    {
      image: "https://img.youtube.com/vi/bgqt0q1I7J8/maxresdefault.jpg",
      title: "Battle-tested",
      description:
        "Built from production operations at Southwest Mushrooms in Phoenix: real schedules, QC gates, and CAPA that stand up on the floor.",
    },
  ]

  return (
    <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-transparent to-muted/10">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-glass-ultra animate-slide-up-fade">
          <div className="mb-12 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative">
              <img
                src="/crowe-logic-logo.png"
                alt="Michael Crowe"
                className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/30 shadow-glass-strong animate-glow-pulse"
              />
              <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-success rounded-full border-4 border-card shadow-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
                The data vault that powers the <span className="text-gradient-purple">behavior core</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Built by Michael Crowe and the Southwest Mushrooms team over 20 years
              </p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {proofs.map((proof, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={proof.image || "/placeholder.svg"}
                    alt={proof.title}
                    className="h-64 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute top-4 right-4 glass-card px-4 py-2 rounded-xl">
                    <span className="text-xs font-bold text-primary">✓ Verified</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-foreground">{proof.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{proof.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
