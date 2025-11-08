import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Crowe Logic v5.0</h1>
        <p className="text-xl text-muted-foreground">
          Expert mycology reasoning engine with 20+ years of commercial cultivation experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Five-Layer Architecture</CardTitle>
          <CardDescription>Structured reasoning system for mycology research and cultivation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Layer 1: Input Processing</h3>
              <p className="text-sm text-muted-foreground">
                Parse user queries, extract CroweLayer™ tags, identify context and urgency
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">Layer 2: Knowledge Retrieval</h3>
              <p className="text-sm text-muted-foreground">
                Access cultivation protocols, research papers, sensor data, and historical evidence
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold">Layer 3: Agent Reasoning</h3>
              <p className="text-sm text-muted-foreground">
                SOP-Agent, Sensor-Agent, Business-Agent, and Delta-Agent collaborate on solutions
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold">Layer 4: Quality Control</h3>
              <p className="text-sm text-muted-foreground">
                Confidence scoring, staleness detection, reasoning privacy checks, feedback integration
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold">Layer 5: Output Generation</h3>
              <p className="text-sm text-muted-foreground">
                VRS (Visible Reasoning Summary), Evidence Ledger, SOP Markdown with actionable steps
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CroweLayer™ Taxonomy</CardTitle>
          <CardDescription>Structured tagging system for precise context understanding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-mono bg-muted px-2 py-1 rounded">PHASE:</span>
              <span className="text-muted-foreground">SPAWN, COLONIZATION, FRUITING, HARVEST</span>
            </div>
            <div className="flex gap-2">
              <span className="font-mono bg-muted px-2 py-1 rounded">SPECIES:</span>
              <span className="text-muted-foreground">OYSTER, SHIITAKE, LIONS_MANE, REISHI</span>
            </div>
            <div className="flex gap-2">
              <span className="font-mono bg-muted px-2 py-1 rounded">EQUIPMENT:</span>
              <span className="text-muted-foreground">AUTOCLAVE, FLOW_HOOD, INCUBATOR</span>
            </div>
            <div className="flex gap-2">
              <span className="font-mono bg-muted px-2 py-1 rounded">PROBLEM:</span>
              <span className="text-muted-foreground">CONTAMINATION, LOW_YIELD, SLOW_GROWTH</span>
            </div>
            <div className="flex gap-2">
              <span className="font-mono bg-muted px-2 py-1 rounded">URGENCY:</span>
              <span className="text-muted-foreground">CRITICAL, HIGH, MEDIUM, LOW</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example Query</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
            <p className="text-muted-foreground">User Query:</p>
            <p>"My oyster mushroom bags are showing green mold after 5 days"</p>
            <p className="text-muted-foreground mt-4">Parsed Tags:</p>
            <p className="text-green-600">
              [SPECIES:OYSTER] [PHASE:COLONIZATION] [PROBLEM:CONTAMINATION] [URGENCY:HIGH]
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
