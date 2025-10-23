"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function EnvironmentMonitor() {
  const [temperature, setTemperature] = useState("")
  const [humidity, setHumidity] = useState("")
  const [co2, setCo2] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const analyzeEnvironment = () => {
    const temp = Number.parseFloat(temperature)
    const hum = Number.parseFloat(humidity)
    const co2Level = Number.parseFloat(co2)

    let analysis = "Environment Analysis:\n\n"

    // Temperature analysis
    if (temp < 65) {
      analysis += "🌡️ Temperature: TOO LOW - Increase to 65-75°F for optimal growth\n"
    } else if (temp > 75) {
      analysis += "🌡️ Temperature: TOO HIGH - Reduce to 65-75°F to prevent contamination\n"
    } else {
      analysis += "🌡️ Temperature: OPTIMAL (65-75°F)\n"
    }

    // Humidity analysis
    if (hum < 80) {
      analysis += "💧 Humidity: TOO LOW - Increase to 80-95% for fruiting\n"
    } else if (hum > 95) {
      analysis += "💧 Humidity: TOO HIGH - Risk of bacterial contamination\n"
    } else {
      analysis += "💧 Humidity: OPTIMAL (80-95%)\n"
    }

    // CO2 analysis
    if (co2Level > 1000) {
      analysis += "🌬️ CO2: TOO HIGH - Increase fresh air exchange\n"
    } else if (co2Level < 400) {
      analysis += "🌬️ CO2: OPTIMAL - Good air exchange\n"
    } else {
      analysis += "🌬️ CO2: ACCEPTABLE - Monitor for pinning issues\n"
    }

    setResult(analysis)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Temperature (°F)</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="e.g., 70"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Humidity (%)</label>
          <input
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            placeholder="e.g., 85"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">CO2 (ppm)</label>
          <input
            type="number"
            value={co2}
            onChange={(e) => setCo2(e.target.value)}
            placeholder="e.g., 800"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      <Button onClick={analyzeEnvironment} className="w-full bg-gradient-to-r from-amber-500 to-amber-600">
        Analyze Environment
      </Button>

      {result && (
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">{result}</pre>
        </div>
      )}
    </div>
  )
}
