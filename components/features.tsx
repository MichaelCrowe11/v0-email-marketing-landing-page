export function Features() {
  const features = [
    {
      image: "https://img.youtube.com/vi/o-9_9lMnTjM/maxresdefault.jpg",
      title: "SOP Generator",
      description: "Room-ready procedures tailored to your facility and strain set.",
    },
    {
      image: "https://img.youtube.com/vi/e1DyNs9XQVQ/maxresdefault.jpg",
      title: "BE & Cost Math",
      description: "Hydration, supplementation, BE targets, and cost per block.",
    },
    {
      image: "https://img.youtube.com/vi/-z0s3GwJxpM/maxresdefault.jpg",
      title: "Spawn Master",
      description: "Grain prep, sterilization cycles, inoculation rates, QC checklists.",
    },
    {
      image: "https://img.youtube.com/vi/bgqt0q1I7J8/maxresdefault.jpg",
      title: "Contam Triage",
      description: "Rapid ID, containment, root-cause analysis, and CAPA playbooks.",
    },
  ]

  return (
    <section id="features" className="px-4 py-24 md:py-32 bg-accent/5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            What's Inside{" "}
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Crowe Logic AI
            </span>
          </h2>
          <p className="text-lg text-foreground max-w-2xl mx-auto">
            Comprehensive tools for every stage of mushroom cultivation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
