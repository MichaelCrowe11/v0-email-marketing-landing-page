import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, Lock } from "lucide-react"

export default function QualityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Quality Controls</h1>
        <p className="text-xl text-muted-foreground">Ensuring accuracy, relevance, and privacy in AI reasoning</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle>Confidence Scoring</CardTitle>
          </div>
          <CardDescription>Transparent reliability metrics for every recommendation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 rounded">
              <span className="text-sm font-medium">High Confidence (90-100%)</span>
              <span className="text-xs text-muted-foreground">Well-established protocols</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
              <span className="text-sm font-medium">Medium Confidence (70-89%)</span>
              <span className="text-xs text-muted-foreground">Multiple valid approaches</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded">
              <span className="text-sm font-medium">Low Confidence (&lt;70%)</span>
              <span className="text-xs text-muted-foreground">Experimental or uncertain</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Confidence scores are calculated based on evidence quality, source recency, and consensus across multiple
            data sources.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <CardTitle>Staleness Detection</CardTitle>
          </div>
          <CardDescription>Automatic flagging of outdated information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted p-3 rounded text-sm space-y-2">
            <p className="font-semibold">Staleness Thresholds:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Critical:</strong> Safety protocols, contamination data (&lt;1 year)
              </li>
              <li>
                <strong>Important:</strong> Cultivation techniques, equipment specs (&lt;3 years)
              </li>
              <li>
                <strong>General:</strong> Species characteristics, basic biology (&lt;5 years)
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm">
              <strong>Warning:</strong> This recommendation uses data from 2019. Newer research may be available.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-500" />
            <CardTitle>Reasoning Privacy</CardTitle>
          </div>
          <CardDescription>Protecting proprietary cultivation methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Chain-of-thought reasoning can be hidden for sensitive commercial operations while still providing
            actionable recommendations.
          </p>
          <div className="bg-muted p-3 rounded text-sm space-y-2">
            <p className="font-semibold">Privacy Levels:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Public:</strong> Full reasoning visible to all users
              </li>
              <li>
                <strong>Private:</strong> Reasoning hidden, only final recommendations shown
              </li>
              <li>
                <strong>Proprietary:</strong> Custom protocols not shared with knowledge base
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Loops</CardTitle>
          <CardDescription>Continuous learning from user outcomes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">Users can rate recommendations and report outcomes, improving future responses.</p>
          <div className="bg-muted p-3 rounded text-sm">
            <p className="font-semibold mb-2">Feedback Metrics:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>✓ Was this recommendation helpful?</p>
              <p>✓ Did you achieve the expected results?</p>
              <p>✓ What was your actual yield/outcome?</p>
              <p>✓ Any unexpected issues?</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Feedback is aggregated and used to update confidence scores and refine protocols.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
