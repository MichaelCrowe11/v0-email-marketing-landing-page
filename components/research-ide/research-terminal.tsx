"use client"
"use client"

import React from "react"
import { ResearchActivityCard } from "@/components/ResearchActivityCard"

/**
 * Replaces decorative faux-terminal with a functional, professional
 * research activity area composed of ResearchActivityCard components.
 */
export function ResearchTerminal() {
  return (
    <div className="space-y-6">
      <ResearchActivityCard
        title="Genome Analysis Pipeline"
        status="active"
        progress={73}
        eta="14m"
        items={[
          "Identified 42 bioactive compounds",
          "Mapped 3,247 genetic markers",
          "Generated preliminary efficacy report",
        ]}
        cta={{ label: "View Full Results", href: "/analytics/genome" }}
      />

      <ResearchActivityCard
        title="Neural Processing Queue"
        status="paused"
        progress={45}
        eta={"--"}
        items={[
          "Contamination Detection Model Training",
          "Substrate Optimization Analysis",
          "Species Classification Update",
        ]}
        cta={{ label: "View Queue", href: "/analytics/queue" }}
      />
    </div>
  )
}
