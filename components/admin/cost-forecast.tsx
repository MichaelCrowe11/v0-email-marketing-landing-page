"use client"

/**
 * Cost Forecast Component
 *
 * Displays projected costs and spending trends
 */

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus, TrendingUp } from "lucide-react"

type ForecastData = {
  period: 'week' | 'month' | 'quarter'
  currentSpend: number
  projectedSpend: number
  trend: 'up' | 'down' | 'stable'
  confidence: number
  breakdown: Array<{
    module: string
    projected: number
  }>
}

export default function CostForecast() {
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month')

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/cost-dashboard?period=${period}`)
        const json = await res.json()
        setForecast(json.data.forecast)
      } catch (error) {
        console.error("Failed to fetch forecast:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  if (loading || !forecast) {
    return <div className="flex justify-center py-8">Loading forecast...</div>
  }

  const moduleNames: Record<string, string> = {
    "crowe-vision": "Crowe Vision",
    "growth-analytics": "Growth Analytics",
    "environmental-monitoring": "Environmental Monitoring",
    "yield-prediction": "Yield Prediction",
    "contamination-detection": "Contamination Detection",
    "species-library": "Species Library",
    "general-chat": "General Chat",
    "batch-analysis": "Batch Analysis"
  }

  const TrendIcon = forecast.trend === 'up' ? ArrowUp :
                    forecast.trend === 'down' ? ArrowDown : Minus

  const trendColor = forecast.trend === 'up' ? 'text-red-500' :
                     forecast.trend === 'down' ? 'text-green-500' : 'text-gray-500'

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriod('week')}
          className={`px-3 py-1 rounded-md text-sm ${period === 'week' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        >
          Next Week
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-3 py-1 rounded-md text-sm ${period === 'month' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        >
          Next Month
        </button>
        <button
          onClick={() => setPeriod('quarter')}
          className={`px-3 py-1 rounded-md text-sm ${period === 'quarter' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        >
          Next Quarter
        </button>
      </div>

      {/* Main Forecast Card */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Projected Spend</CardTitle>
            <CardDescription>Based on current usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                ${forecast.projectedSpend.toFixed(2)}
              </div>
              <div className={`flex items-center gap-2 ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {forecast.trend === 'up' ? 'Increasing' :
                   forecast.trend === 'down' ? 'Decreasing' : 'Stable'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Current spend: ${forecast.currentSpend.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Confidence: {(forecast.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Planning</CardTitle>
            <CardDescription>Recommended budget allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Conservative estimate</span>
                <span className="font-mono font-semibold">
                  ${(forecast.projectedSpend * 0.8).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Expected estimate</span>
                <span className="font-mono font-semibold">
                  ${forecast.projectedSpend.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Buffer (+20%)</span>
                <span className="font-mono font-semibold">
                  ${(forecast.projectedSpend * 1.2).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Projected Cost by Module</CardTitle>
          <CardDescription>Expected spending across CLAI modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.breakdown
              .sort((a, b) => b.projected - a.projected)
              .map((item) => {
                const percent = (item.projected / forecast.projectedSpend) * 100
                return (
                  <div key={item.module} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {moduleNames[item.module] || item.module}
                      </span>
                      <span className="text-muted-foreground">
                        ${item.projected.toFixed(2)} ({percent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Forecast Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {forecast.trend === 'up' && (
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>
                  Usage is trending upward. Consider optimizing high-cost modules or
                  adjusting rate limits to control costs.
                </span>
              </li>
            )}
            {forecast.trend === 'down' && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>
                  Usage is trending downward. This could indicate successful cost
                  optimization or reduced research activity.
                </span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>
                Top module: {moduleNames[forecast.breakdown[0]?.module] || 'N/A'} (
                ${forecast.breakdown[0]?.projected.toFixed(2) || '0.00'})
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>
                Forecast confidence is {(forecast.confidence * 100).toFixed(0)}%.
                {forecast.confidence < 0.7
                  ? " More data needed for accurate predictions."
                  : " High confidence based on historical patterns."}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
