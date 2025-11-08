import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Microscope, Code, Leaf } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Built by a Scientist. For Scientists.</h1>
          <p className="text-xl text-muted-foreground">
            18+ years of domain expertise, distilled into code. Not generic AI. Biological intelligence.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src="/crowe-logic-logo.png"
            alt="Michael Crowe"
            fill
            className="rounded-full object-cover ring-4 ring-primary/20 shadow-xl"
          />
        </div>

        {/* Story */}
        <Card className="border-border/50">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">The Journey</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Michael Crowe started growing mushrooms at 15 in Phoenix, Arizona. By 26, he founded{" "}
                <a
                  href="https://southwestmushrooms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  Southwest Mushrooms
                </a>
                , building it into a $470K/year operation spanning 7 continents.
              </p>
              <p>
                When he couldn't find software that understood biological systems the way he did, he taught himself to
                code. That journey—from mycologist to programmer to AI architect—is embedded in every line of Crowe
                Logic.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Milestones */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <Leaf className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">Age 15</h3>
              <p className="text-sm text-muted-foreground">Started growing mushrooms in Phoenix, Arizona</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <Microscope className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">Age 26</h3>
              <p className="text-sm text-muted-foreground">Founded Southwest Mushrooms - $470K/year, 7 continents</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
              <Code className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">Today</h3>
              <p className="text-sm text-muted-foreground">Building AI tools that understand biological systems</p>
            </CardContent>
          </Card>
        </div>

        {/* What Makes Crowe Logic Different */}
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">What Makes Crowe Logic Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Domain Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  18 years of hands-on biological research and commercial production
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Production Validated</h3>
                <p className="text-sm text-muted-foreground">
                  Every model trained on real-world data from operational facilities
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Built for Scientists</h3>
                <p className="text-sm text-muted-foreground">
                  Tools designed by researchers who understand uncertainty and complexity
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Open Ecosystem</h3>
                <p className="text-sm text-muted-foreground">
                  Models, datasets, and hardware available to the research community
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button size="lg" asChild>
            <Link href="/marketplace">Browse AI Models</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="mailto:michael@crowelogic.com">
              <ExternalLink className="w-4 h-4 mr-2" />
              Contact Michael
            </a>
          </Button>
        </div>
      </div>
    </main>
  )
}
