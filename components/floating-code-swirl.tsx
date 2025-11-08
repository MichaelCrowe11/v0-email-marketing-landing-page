"use client"

import { useState } from "react"

interface SystemMetric {
  label: string
  value: string
  unit: string
}

export function FloatingCodeSwirl() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: "Species Database", value: "10,847", unit: "entries" },
    { label: "Analysis Accuracy", value: "98.47", unit: "%" },
    { label: "Processing Speed", value: "< 2", unit: "seconds" },
    { label: "Active Research", value: "1,247", unit: "projects" },
  ])

  return (
    <div className="w-full py-16 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Research Platform Statistics</h2>
          <p className="text-muted-foreground">Real-time data from our cultivation analysis system</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{metric.unit}</div>
              <div className="text-xs font-medium text-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
