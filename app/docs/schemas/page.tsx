import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SchemasPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Output Schemas</h1>
        <p className="text-xl text-muted-foreground">Structured formats for reasoning, evidence, and protocols</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>VRS (Visible Reasoning Summary)</CardTitle>
          <CardDescription>Transparent chain-of-thought display for users</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            {`{
  "reasoning_steps": [
    {
      "step": 1,
      "type": "RESEARCH",
      "description": "Analyzing contamination patterns in oyster cultivation",
      "confidence": 0.95
    },
    {
      "step": 2,
      "type": "ANALYSIS",
      "description": "Green mold at day 5 indicates Trichoderma contamination",
      "confidence": 0.92
    },
    {
      "step": 3,
      "type": "SYNTHESIS",
      "description": "Likely causes: insufficient sterilization or airborne spores",
      "confidence": 0.88
    },
    {
      "step": 4,
      "type": "VERIFICATION",
      "description": "Cross-referenced with 200+ contamination cases",
      "confidence": 0.94
    }
  ],
  "overall_confidence": 0.92
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidence Ledger</CardTitle>
          <CardDescription>Traceable sources and citations for all recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            {`{
  "evidence": [
    {
      "source": "Commercial cultivation database",
      "type": "HISTORICAL_DATA",
      "relevance": 0.95,
      "date": "2024-01-15",
      "summary": "Trichoderma contamination patterns in 500+ grow operations"
    },
    {
      "source": "Stamets, P. (2000). Growing Gourmet Mushrooms",
      "type": "RESEARCH_PAPER",
      "relevance": 0.88,
      "page": "156-162",
      "summary": "Contamination prevention in oyster cultivation"
    },
    {
      "source": "Sensor data from similar operations",
      "type": "SENSOR_DATA",
      "relevance": 0.82,
      "summary": "Temperature and humidity correlations with contamination"
    }
  ],
  "staleness_check": {
    "oldest_source": "2000",
    "newest_source": "2024-01-15",
    "status": "CURRENT"
  }
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SOP Markdown</CardTitle>
          <CardDescription>Actionable standard operating procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            {`# Trichoderma Contamination Response Protocol

## Immediate Actions (0-2 hours)
1. **Isolate** contaminated bags immediately
2. **Document** contamination extent with photos
3. **Check** neighboring bags for early signs

## Investigation (2-24 hours)
1. Review sterilization logs for affected batch
2. Inspect grow room for airflow issues
3. Test HEPA filter integrity

## Prevention (Ongoing)
1. Increase autoclave time by 15 minutes
2. Implement daily air quality monitoring
3. Review inoculation technique with staff

## Success Metrics
- Zero contamination in next 3 batches
- Colonization time < 14 days
- Yield recovery to baseline within 2 cycles

**Confidence:** 92% | **Evidence Sources:** 3 | **Last Updated:** 2024-01-15`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
