import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Specialized Agents</h1>
        <p className="text-xl text-muted-foreground">
          Four expert agents working in concert for comprehensive solutions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SOP-Agent</CardTitle>
          <CardDescription>Standard Operating Procedure specialist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Generates step-by-step protocols for cultivation tasks, contamination response, and equipment operation.
          </p>
          <div className="bg-muted p-3 rounded text-sm space-y-1">
            <p className="font-semibold">Responsibilities:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Create detailed, actionable procedures</li>
              <li>Include safety warnings and critical control points</li>
              <li>Specify timing, temperatures, and measurements</li>
              <li>Provide troubleshooting steps</li>
            </ul>
          </div>
          <div className="bg-muted p-3 rounded text-sm">
            <p className="font-semibold mb-1">Example Output:</p>
            <p className="text-muted-foreground">
              "Autoclave substrate at 15 PSI for 90 minutes. Allow 2-hour cooldown to 75°F before inoculation. If
              pressure drops below 14 PSI, restart timer."
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sensor-Agent</CardTitle>
          <CardDescription>Environmental data analysis specialist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Interprets temperature, humidity, CO2, and other sensor data to identify optimal conditions and problems.
          </p>
          <div className="bg-muted p-3 rounded text-sm space-y-1">
            <p className="font-semibold">Responsibilities:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Analyze real-time sensor readings</li>
              <li>Detect anomalies and trends</li>
              <li>Recommend environmental adjustments</li>
              <li>Predict optimal harvest windows</li>
            </ul>
          </div>
          <div className="bg-muted p-3 rounded text-sm">
            <p className="font-semibold mb-1">Example Output:</p>
            <p className="text-muted-foreground">
              "Humidity dropped to 82% at 3 AM (target: 90-95%). Increase misting frequency to 4x daily. CO2 levels
              optimal at 800 ppm."
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business-Agent</CardTitle>
          <CardDescription>Commercial optimization specialist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Focuses on yield optimization, cost reduction, scaling strategies, and operational efficiency.
          </p>
          <div className="bg-muted p-3 rounded text-sm space-y-1">
            <p className="font-semibold">Responsibilities:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Calculate ROI and cost per pound</li>
              <li>Identify bottlenecks in production</li>
              <li>Recommend equipment upgrades</li>
              <li>Optimize labor allocation</li>
            </ul>
          </div>
          <div className="bg-muted p-3 rounded text-sm">
            <p className="font-semibold mb-1">Example Output:</p>
            <p className="text-muted-foreground">
              "Current BE: 85%. Switching to supplemented sawdust could increase to 110% BE, reducing cost per pound
              from $4.20 to $3.10."
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delta-Agent</CardTitle>
          <CardDescription>Continuous improvement specialist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Compares current practices against best practices, identifies gaps, and suggests protocol improvements.
          </p>
          <div className="bg-muted p-3 rounded text-sm space-y-1">
            <p className="font-semibold">Responsibilities:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Benchmark against industry standards</li>
              <li>Identify outdated techniques</li>
              <li>Suggest incremental improvements</li>
              <li>Track improvement metrics</li>
            </ul>
          </div>
          <div className="bg-muted p-3 rounded text-sm">
            <p className="font-semibold mb-1">Example Output:</p>
            <p className="text-muted-foreground">
              "Your sterilization protocol is 2 years old. New research shows 15% faster colonization with modified
              pressure curve. Recommend A/B test."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
