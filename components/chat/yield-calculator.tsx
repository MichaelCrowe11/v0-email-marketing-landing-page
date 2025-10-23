"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function YieldCalculator() {
  const [substrateWeight, setSubstrateWeight] = useState("")
  const [strainType, setStrainType] = useState("oyster")
  const [result, setResult] = useState<string | null>(null)

  const calculateYield = () => {
    const weight = Number.parseFloat(substrateWeight)

    const yieldRates: Record<string, { min: number; max: number; avg: number }> = {
      oyster: { min: 0.75, max: 1.25, avg: 1.0 },
      shiitake: { min: 0.5, max: 0.8, avg: 0.65 },
      "lions-mane": { min: 0.6, max: 1.0, avg: 0.8 },
      reishi: { min: 0.3, max: 0.5, avg: 0.4 },
    }

    const rates = yieldRates[strainType]
    const minYield = (weight * rates.min).toFixed(2)
    const maxYield = (weight * rates.max).toFixed(2)
    const avgYield = (weight * rates.avg).toFixed(2)

    const analysis = `Yield Estimates for ${weight}lbs substrate:

Strain: ${strainType.charAt(0).toUpperCase() + strainType.slice(1)}

Expected Yields:
• Minimum: ${minYield} lbs (${(Number.parseFloat(minYield) * 453.592).toFixed(0)}g)
• Average: ${avgYield} lbs (${(Number.parseFloat(avgYield) * 453.592).toFixed(0)}g)
• Maximum: ${maxYield} lbs (${(Number.parseFloat(maxYield) * 453.592).toFixed(0)}g)

Biological Efficiency: ${(rates.avg * 100).toFixed(0)}%

Tips for maximizing yield:
• Maintain optimal temperature and humidity
• Ensure proper fresh air exchange
• Use high-quality spawn at 10-20% ratio
• Harvest at peak maturity`

    setResult(analysis)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Substrate Weight (lbs)</label>
          <input
            type="number"
            value={substrateWeight}
            onChange={(e) => setSubstrateWeight(e.target.value)}
            placeholder="e.g., 10"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Mushroom Strain</label>
          <select
            value={strainType}
            onChange={(e) => setStrainType(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="oyster">Oyster</option>
            <option value="shiitake">Shiitake</option>
            <option value="lions-mane">Lion's Mane</option>
            <option value="reishi">Reishi</option>
          </select>
        </div>
      </div>

      <Button onClick={calculateYield} className="w-full bg-gradient-to-r from-amber-500 to-amber-600">
        Calculate Yield
      </Button>

      {result && (
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">{result}</pre>
        </div>
      )}
    </div>
  )
}
