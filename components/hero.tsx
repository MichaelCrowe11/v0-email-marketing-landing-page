import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TechShowcase } from "@/components/tech-showcase"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-32 overflow-hidden bg-gradient-to-b from-background via-background to-accent/5">
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-foreground">20+ Years of Mycology Expertise</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              <span className="block text-foreground">Your Mycology</span>
              <span className="block text-foreground">AI Partner</span>
            </h1>

            <p className="text-xl text-foreground/90 max-w-xl text-pretty">
              Advanced AI-powered mycology research platform combining decades of expertise with cutting-edge
              technology.
            </p>

            <ul className="space-y-3">
              {[
                "AI-powered species identification",
                "Comprehensive research database",
                "Real-time collaboration tools",
                "Expert community support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative">
            <TechShowcase />
          </div>
        </div>
      </div>
    </section>
  )
}
