import { Shield, Check, Sparkles, Users, Award, Clock } from "lucide-react"

interface TrustIndicatorsProps {
  variant?: "default" | "compact"
  showEarlyAccess?: boolean
}

export function TrustIndicators({ variant = "default", showEarlyAccess = false }: TrustIndicatorsProps) {
  const indicators = [
    {
      icon: Shield,
      title: "Secure Payment",
      description: "256-bit SSL encryption via Stripe",
      color: "text-green-500"
    },
    {
      icon: Check,
      title: "30-Day Guarantee",
      description: "Full refund if not satisfied",
      color: "text-green-500"
    },
    {
      icon: Sparkles,
      title: "Instant Access",
      description: "Start using immediately after purchase",
      color: "text-purple-500"
    },
    {
      icon: Award,
      title: "20+ Years Expertise",
      description: "Built by Michael Crowe & Southwest Mushrooms",
      color: "text-purple-500"
    },
    {
      icon: Clock,
      title: "Lifetime Updates",
      description: "Continuous improvements included",
      color: "text-cyan-500"
    },
  ]

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {indicators.slice(0, 3).map((indicator) => {
          const Icon = indicator.icon
          return (
            <div key={indicator.title} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${indicator.color} flex-shrink-0`} />
              <span className="text-sm font-medium text-foreground">{indicator.title}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((indicator) => {
          const Icon = indicator.icon
          return (
            <div
              key={indicator.title}
              className="glass-card rounded-xl p-6 text-center hover:border-accent/50 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Icon className={`w-8 h-8 ${indicator.color} mx-auto mb-3`} />
              <h3 className="text-sm font-bold text-foreground mb-1">{indicator.title}</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">{indicator.description}</p>
            </div>
          )
        })}
      </div>

      {showEarlyAccess && (
        <div className="glass-card rounded-xl p-6 border border-purple-500/20">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Early Access Community</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join our founding members who are helping shape the future of AI-assisted cultivation. 
                Your feedback directly influences development priorities and new features. We're building 
                this platform together with the mycology community.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
