import { Microscope, Camera, Thermometer, Database, Cpu, FlaskConical, AlertTriangle, TrendingUp } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Computer Vision Analysis",
      description: "AI-powered contamination detection and growth stage identification from photos.",
    },
    {
      icon: <Microscope className="w-6 h-6" />,
      title: "Species Library",
      description: "Comprehensive database of mushroom species with cultivation parameters and characteristics.",
    },
    {
      icon: <Thermometer className="w-6 h-6" />,
      title: "Environmental Monitoring",
      description: "Real-time tracking of temperature, humidity, CO2, and FAE for optimal fruiting conditions.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Cultivation SOPs",
      description: "Step-by-step standard operating procedures for substrate prep, inoculation, and fruiting.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "AI Cultivation Assistant",
      description: "Chat with an AI trained on mycology best practices and troubleshooting techniques.",
    },
    {
      icon: <FlaskConical className="w-6 h-6" />,
      title: "Substrate Calculator",
      description: "Calculate precise substrate ratios and supplementation for maximum yield potential.",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Contamination Guide",
      description: "Visual identification guide for common contaminants with prevention and remediation strategies.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Yield Optimization",
      description: "AI-driven predictions and recommendations to maximize mushroom production and quality.",
    },
  ]

  return (
    <section id="features" className="px-4 py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,transparent_50%)]" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Platform <span className="text-primary">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to grow mushrooms successfully, from spore to harvest.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/15 transition-all duration-300 group-hover:animate-fruiting-pulse">
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
