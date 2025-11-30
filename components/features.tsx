import { Dna, Microscope, Code2, Database, Cpu, FlaskConical, Network, ShieldCheck } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Dna className="w-6 h-6" />,
      title: "Genomic Analysis",
      description: "Advanced sequence alignment and variant calling pipelines powered by AI.",
    },
    {
      icon: <Microscope className="w-6 h-6" />,
      title: "Protein Folding",
      description: "Predict 3D protein structures with AlphaFold integration and visualization.",
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Integrated IDE",
      description: "Full-featured Monaco editor with Python support for bioinformatics workflows.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Biological Datasets",
      description: "Access curated genomic, proteomic, and metabolic datasets instantly.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "AI Models",
      description: "Leverage state-of-the-art LLMs fine-tuned for biological data analysis.",
    },
    {
      icon: <FlaskConical className="w-6 h-6" />,
      title: "Lab Simulation",
      description: "Simulate wet-lab experiments in silico to optimize protocols.",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Data Pipelines",
      description: "Build and deploy scalable data processing pipelines with ease.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security ensuring your proprietary data remains safe.",
    },
  ]

  return (
    <section id="features" className="px-4 py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Platform <span className="text-primary">Capabilities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive suite of tools designed for the modern computational biologist.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
