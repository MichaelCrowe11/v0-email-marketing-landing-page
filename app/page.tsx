import { CroweWordmark } from "@/components/crowe-wordmark"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Database, Code2, Microscope, Video } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-8">
          <CroweWordmark variant="full" className="scale-150" />
        </div>

        <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight text-white lg:text-6xl">
          CriOS Discovery Engine
        </h1>

        <p className="mb-8 max-w-2xl font-mono text-lg text-white/70">
          Pharmaceutical-grade agricultural research platform powered by autonomous AI for mushroom cultivation and
          discovery.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/chat">
              Talk to Crowe Logic
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/crowe-code">Launch Crowe Code</Link>
          </Button>
        </div>
      </section>

      {/* Research Metrics */}
      <section className="border-t border-white/10 bg-black/40 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-black/60 border-white/10">
              <CardHeader>
                <CardTitle className="font-mono text-2xl tabular-nums">30GB+</CardTitle>
                <CardDescription>Cultivation Dataset</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black/60 border-white/10">
              <CardHeader>
                <CardTitle className="font-mono text-2xl tabular-nums">1,247</CardTitle>
                <CardDescription>Species Analyzed</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black/60 border-white/10">
              <CardHeader>
                <CardTitle className="font-mono text-2xl tabular-nums">98.7%</CardTitle>
                <CardDescription>Analysis Accuracy</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black/60 border-white/10">
              <CardHeader>
                <CardTitle className="font-mono text-2xl tabular-nums">24/7</CardTitle>
                <CardDescription>Autonomous Operation</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-mono text-3xl font-bold text-white">Research Tools</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/chat" className="group">
              <Card className="h-full transition-all hover:border-[#C4A05C] bg-black/60 border-white/10">
                <CardHeader>
                  <Database className="mb-4 size-10 text-[#C4A05C]" />
                  <CardTitle className="font-mono">Crowe Logic</CardTitle>
                  <CardDescription>
                    Conversational AI assistant trained on 30GB mushroom cultivation data
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/crowe-code" className="group">
              <Card className="h-full transition-all hover:border-[#C4A05C] bg-black/60 border-white/10">
                <CardHeader>
                  <Code2 className="mb-4 size-10 text-[#C4A05C]" />
                  <CardTitle className="font-mono">Crowe Code</CardTitle>
                  <CardDescription>
                    Autonomous software developer with VS Code IDE and GitHub integration
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/workbench" className="group">
              <Card className="h-full transition-all hover:border-[#C4A05C] bg-black/60 border-white/10">
                <CardHeader>
                  <Microscope className="mb-4 size-10 text-[#C4A05C]" />
                  <CardTitle className="font-mono">Research IDE</CardTitle>
                  <CardDescription>Python execution environment with data analysis and batch logging</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/crowe-vision" className="group">
              <Card className="h-full transition-all hover:border-[#C4A05C] bg-black/60 border-white/10">
                <CardHeader>
                  <Video className="mb-4 size-10 text-[#C4A05C]" />
                  <CardTitle className="font-mono">Crowe Vision</CardTitle>
                  <CardDescription>
                    Advanced image analysis for mushroom identification and quality assessment
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
