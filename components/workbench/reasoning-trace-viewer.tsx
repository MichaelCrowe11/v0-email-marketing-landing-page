"use client"

import { useState } from "react"
import { Brain, ChevronDown, ChevronUp, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReasoningTrace } from "@/lib/types/workbench"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"

interface ReasoningTraceViewerProps {
  reasoning: ReasoningTrace
}

export function ReasoningTraceViewer({ reasoning }: ReasoningTraceViewerProps) {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([0])

  const toggleStep = (index: number) => {
    setExpandedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      'retrieval': 'from-cyan-500 to-blue-500',
      'analysis': 'from-purple-500 to-pink-500',
      'synthesis': 'from-green-500 to-emerald-500',
    }
    return colors[agent] || 'from-gray-500 to-gray-600'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="glass-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Reasoning Trace</h3>
            <p className="text-sm text-muted-foreground">
              {reasoning.steps.length} reasoning steps • Overall confidence: {Math.round(reasoning.confidence * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-border">
        {reasoning.steps.map((step, index) => {
          const isExpanded = expandedSteps.includes(index)
          const agentColor = getAgentColor(step.agent)
          const confidenceColor = getConfidenceColor(step.confidence)

          return (
            <div key={index} className="p-6">
              {/* Step Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${agentColor} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${agentColor} text-white`}>
                      {step.agent}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {step.action}
                    </span>
                    <span className={`text-xs font-medium ${confidenceColor} ml-auto`}>
                      {Math.round(step.confidence * 100)}% confidence
                    </span>
                  </div>

                  <p className="text-sm text-foreground mb-2">
                    {step.reasoning}
                  </p>

                  <button
                    onClick={() => toggleStep(index)}
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Show details
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="ml-16 space-y-3">
                  {/* Input */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Input</p>
                    <pre className="text-xs text-foreground font-mono overflow-x-auto">
                      {typeof step.input === 'string' 
                        ? step.input 
                        : JSON.stringify(step.input, null, 2)}
                    </pre>
                  </div>

                  {/* Output */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Output</p>
                    <pre className="text-xs text-foreground font-mono overflow-x-auto">
                      {typeof step.output === 'string' 
                        ? step.output 
                        : JSON.stringify(step.output, null, 2)}
                    </pre>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground">
                    Completed at {new Date(step.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {/* Confidence Bar */}
              <div className="ml-16 mt-3">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${agentColor} transition-all duration-500`}
                    style={{ width: `${step.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="p-6 border-t border-border bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Reasoning Complete
            </p>
            <p className="text-xs text-muted-foreground">
              All {reasoning.steps.length} agents completed their analysis with {reasoning.evidence.length} evidence items
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
