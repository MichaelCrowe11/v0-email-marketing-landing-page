"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SubstrateResult {
  cocoirCoir: number
  vermiculite: number
  gypsum: number
  water: number
}

export function SubstrateCalculator() {
  const [containerSize, setContainerSize] = useState("")
  const [substrateType, setSubstrateType] = useState("cvg")
  const [result, setResult] = useState<SubstrateResult | null>(null)

  const calculateSubstrate = () => {
    const size = Number.parseFloat(containerSize)
    if (isNaN(size) || size <= 0) return

    let ratios = { coco: 0, verm: 0, gypsum: 0, water: 0 }

    switch (substrateType) {
      case "cvg":
        ratios = { coco: 0.5, verm: 0.5, gypsum: 0.05, water: 1.5 }
        break
      case "coco-only":
        ratios = { coco: 1, verm: 0, gypsum: 0.05, water: 1.5 }
        break
      case "manure":
        ratios = { coco: 0.4, verm: 0.4, gypsum: 0.05, water: 1.8 }
        break
    }

    setResult({
      cocoirCoir: size * ratios.coco,
      vermiculite: size * ratios.verm,
      gypsum: size * ratios.gypsum,
      water: size * ratios.water,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="container-size" className="text-xs font-medium text-foreground/80">
          Container Size (quarts)
        </Label>
        <Input
          id="container-size"
          type="number"
          placeholder="e.g., 6"
          value={containerSize}
          onChange={(e) => setContainerSize(e.target.value)}
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="substrate-type" className="text-xs font-medium text-foreground/80">
          Substrate Type
        </Label>
        <Select value={substrateType} onValueChange={setSubstrateType}>
          <SelectTrigger id="substrate-type" className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cvg">CVG (Coco, Verm, Gypsum)</SelectItem>
            <SelectItem value="coco-only">Coco Coir Only</SelectItem>
            <SelectItem value="manure">Manure Mix</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={calculateSubstrate} className="w-full h-9 text-sm" disabled={!containerSize}>
        Calculate Ratios
      </Button>

      {result && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50">
          <h4 className="text-xs font-semibold text-foreground/80 mb-3">Substrate Recipe</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-foreground/70">Coco Coir:</span>
              <span className="font-medium text-foreground">{result.cocoirCoir.toFixed(1)} qt</span>
            </div>
            {result.vermiculite > 0 && (
              <div className="flex justify-between">
                <span className="text-foreground/70">Vermiculite:</span>
                <span className="font-medium text-foreground">{result.vermiculite.toFixed(1)} qt</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-foreground/70">Gypsum:</span>
              <span className="font-medium text-foreground">{result.gypsum.toFixed(2)} qt</span>
            </div>
            <div className="flex justify-between border-t border-border/30 pt-2 mt-2">
              <span className="text-foreground/70">Water:</span>
              <span className="font-medium text-foreground">{result.water.toFixed(1)} qt</span>
            </div>
          </div>
          <p className="text-xs text-foreground/60 mt-3 leading-relaxed">
            Mix dry ingredients first, then add water gradually until field capacity is reached.
          </p>
        </div>
      )}
    </div>
  )
}
