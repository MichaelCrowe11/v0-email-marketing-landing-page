import Image from "next/image"

export function ProofSection() {
  const credentials = [
    {
      image: "https://i.ytimg.com/vi/rxlJJpu3O_g/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCxtvk3XljjaINfKu-I6IFvCks3jA",
      title: "20+ Years of Expertise",
      description:
        "Michael Crowe has spent over two decades mastering commercial mushroom cultivation at Southwest Mushrooms in Phoenix, Arizona. From substrate formulation to contamination triage, this AI is built on real production experience.",
      metric: "20+ Years",
      metricLabel: "Professional Experience"
    },
    {
      image: "https://i.ytimg.com/vi/8KUYup2W2f4/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCZ5HVURMBUHuqD7tMXh5p62ISkOg",
      title: "Comprehensive Knowledge Base",
      description:
        "Every YouTube video, consulting lesson, and production log was transcribed and integrated. The AI mirrors Michael's speech patterns, problem-solving approach, and decision-making process based on thousands of real cultivation scenarios.",
      metric: "1000+",
      metricLabel: "Hours of Content"
    },
    {
      image: "https://i.ytimg.com/vi/Ng_Wq9PnEVI/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBEov5nhRSmvkq3hRrNpPixm0AX5A",
      title: "Battle-Tested in Production",
      description:
        "Built from actual production operations at Southwest Mushrooms: real schedules, quality control gates, contamination logs, and corrective actions that have been proven on the cultivation floor.",
      metric: "Daily",
      metricLabel: "Production Data"
    },
  ]

  return (
    <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-transparent to-muted/10">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl animate-slide-up-fade">
          {/* Header with Michael Crowe credentials */}
          <div className="mb-12 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative">
              <Image
                src="/crowe-logic-logo.png"
                alt="Michael Crowe - Founder of Southwest Mushrooms"
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/30 shadow-xl animate-glow-pulse"
                priority
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
                Built on <span className="text-gradient-purple">Real Expertise</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Created by Michael Crowe, founder of Southwest Mushrooms
              </p>
              <p className="text-base text-muted-foreground/80">
                This AI doesn't just know mycology—it thinks like someone who's been in the trenches for 20+ years
              </p>
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            {credentials.map((credential, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={credential.image || "/placeholder.svg"}
                    alt={credential.title}
                    className="h-48 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass-card px-4 py-3 rounded-xl">
                      <div className="text-2xl font-bold text-primary">{credential.metric}</div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {credential.metricLabel}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-foreground">{credential.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{credential.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Honest messaging about early stage */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-primary/20">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Early Access - Building Together</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We're in the early stages of bringing this AI to cultivators worldwide. While we don't have customer testimonials yet, 
                  we're committed to transparency and building this platform with the mycology community. Your feedback will help shape 
                  the future of AI-assisted cultivation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
