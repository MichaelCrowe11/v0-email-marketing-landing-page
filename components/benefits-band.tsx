export function BenefitsBand() {
  const benefits = [
    "Clean SOPs",
    "Faster Decisions",
    "Higher BE",
    "Lower Contamination",
    "Scale with Confidence",
    "Clean SOPs",
    "Faster Decisions",
    "Higher BE",
  ]

  return (
    <div className="relative my-8 overflow-hidden border-y border-border py-4 text-white bg-foreground">
      <div className="flex animate-scroll gap-8 whitespace-nowrap">
        {benefits.map((benefit, index) => (
          <span key={index} className="text-sm font-medium text-accent">
            {benefit}
          </span>
        ))}
      </div>
    </div>
  )
}
