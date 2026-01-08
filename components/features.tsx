import { Microscope, Camera, Thermometer, Database, Cpu, FlaskConical, AlertTriangle, TrendingUp } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Vision Analysis",
      description: "AI contamination detection from photos",
    },
    {
      icon: <Microscope className="w-5 h-5" />,
      title: "Species Library",
      description: "Complete cultivation parameters",
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      title: "Environment Monitor",
      description: "Real-time temp, humidity, CO2",
    },
    { icon: <Database className="w-5 h-5" />, title: "SOPs & Guides", description: "Step-by-step procedures" },
    { icon: <Cpu className="w-5 h-5" />, title: "AI Assistant", description: "Expert cultivation guidance" },
    {
      icon: <FlaskConical className="w-5 h-5" />,
      title: "Substrate Calc",
      description: "Precise ratios for max yield",
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Contam Guide",
      description: "ID and remediation strategies",
    },
    { icon: <TrendingUp className="w-5 h-5" />, title: "Yield Optimizer", description: "AI-driven predictions" },
  ]

  return (
    <section id="features" className="px-4 py-16 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,transparent_50%)]" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Platform <span className="text-primary">Features</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">Everything you need from spore to harvest.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-5 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/15 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
