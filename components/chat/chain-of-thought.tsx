"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

export interface ReasoningStep {
  type: "research" | "analysis" | "synthesis" | "verification"
  content: string
}

interface ChainOfThoughtProps {
  steps: ReasoningStep[]
}

const stepIcons = {
  research: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  analysis: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  synthesis: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  verification: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
}

const stepLabels = {
  research: "Research",
  analysis: "Analysis",
  synthesis: "Synthesis",
  verification: "Verification",
}

export function ChainOfThought({ steps }: ChainOfThoughtProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (steps.length === 0) return null

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        <span>Reasoning process ({steps.length} steps)</span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 pl-5 border-l-2 border-border">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3 text-xs">
              <div className="flex-shrink-0 mt-0.5 text-amber-600">{stepIcons[step.type]}</div>
              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">{stepLabels[step.type]}</div>
                <div className="text-muted-foreground leading-relaxed">{step.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
