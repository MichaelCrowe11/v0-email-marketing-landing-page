"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const strainData = {
  "Golden Teacher": {
    difficulty: "Beginner",
    colonization: "10-14 days",
    fruiting: "7-10 days",
    temperature: "75-81°F",
    notes: "Reliable, forgiving strain. Excellent for beginners. Moderate potency.",
  },
  "B+": {
    difficulty: "Beginner",
    colonization: "8-12 days",
    fruiting: "7-10 days",
    temperature: "75-80°F",
    notes: "Fast colonizer, contamination resistant. Large flushes. Very popular.",
  },
  "Penis Envy": {
    difficulty: "Advanced",
    colonization: "14-21 days",
    fruiting: "10-14 days",
    temperature: "74-78°F",
    notes: "Slow grower, requires patience. High potency. Dense fruits.",
  },
  "Albino A+": {
    difficulty: "Intermediate",
    colonization: "10-14 days",
    fruiting: "8-12 days",
    temperature: "75-80°F",
    notes: "Leucistic variant. Beautiful white fruits. Moderate difficulty.",
  },
  Mazatapec: {
    difficulty: "Beginner",
    colonization: "12-16 days",
    fruiting: "8-12 days",
    temperature: "70-75°F",
    notes: "Traditional Mexican strain. Spiritual effects. Easy to grow.",
  },
}

export function StrainDatabase() {
  const [search, setSearch] = useState("")
  const [selectedStrain, setSelectedStrain] = useState<string | null>(null)

  const filteredStrains = Object.keys(strainData).filter((strain) =>
    strain.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="strain-search" className="text-xs font-medium text-foreground/80">
          Search Strain
        </Label>
        <Input
          id="strain-search"
          type="text"
          placeholder="e.g., Golden Teacher"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-2">
        {filteredStrains.map((strain) => (
          <button
            key={strain}
            onClick={() => setSelectedStrain(strain)}
            className="w-full text-left p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="text-sm font-medium text-foreground">{strain}</div>
            <div className="text-xs text-foreground/60 mt-1">
              {strainData[strain as keyof typeof strainData].difficulty} •{" "}
              {strainData[strain as keyof typeof strainData].colonization} colonization
            </div>
          </button>
        ))}
      </div>

      {selectedStrain && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-3">{selectedStrain}</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-foreground/70">Difficulty:</span>
              <span className="font-medium text-foreground">
                {strainData[selectedStrain as keyof typeof strainData].difficulty}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Colonization:</span>
              <span className="font-medium text-foreground">
                {strainData[selectedStrain as keyof typeof strainData].colonization}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Fruiting:</span>
              <span className="font-medium text-foreground">
                {strainData[selectedStrain as keyof typeof strainData].fruiting}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Temperature:</span>
              <span className="font-medium text-foreground">
                {strainData[selectedStrain as keyof typeof strainData].temperature}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-border/30">
              <p className="text-foreground/70 leading-relaxed">
                {strainData[selectedStrain as keyof typeof strainData].notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
