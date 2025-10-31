"use client"

import { useState } from "react"
import { 
  ArrowLeft, TrendingUp, FileText, Link as LinkIcon, 
  CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HypothesisTest } from "@/lib/types/workbench"
import { ReasoningTraceViewer } from "@/components/workbench/reasoning-trace-viewer"

interface HypothesisResultsProps {
  hypothesis: HypothesisTest
  onBack: () => void
}

export function HypothesisResults({ hypothesis, onBack }: HypothesisResultsProps) {
  const [expandedEvidence, setExpandedEvidence] = useState<string[]>([])

  if (!hypothesis.results) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No results available</p>
      </div>
    )
  }

  const { confidence, evidence, reasoning, citations } = hypothesis.results

  const getConfidenceLevel = () => {
    if (confidence >= 0.8) return { label: 'High', color: 'text-green-400', icon: CheckCircle }
    if (confidence >= 0.5) return { label: 'Medium', color: 'text-yellow-400', icon: AlertCircle }
    return { label: 'Low', color: 'text-red-400', icon: XCircle }
  }

  const confidenceLevel = getConfidenceLevel()
  const ConfidenceIcon = confidenceLevel.icon

  const toggleEvidence = (id: string) => {
    setExpandedEvidence(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hypotheses
        </Button>

        <div className="glass-card rounded-xl p-6 border border-border bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5">
          <h2 className="text-xl font-bold text-foreground mb-2">
            {hypothesis.hypothesis.statement}
          </h2>
          <p className="text-sm text-muted-foreground">
            {hypothesis.hypothesis.expectedOutcome}
          </p>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="glass-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Confidence Score</h3>
            <p className="text-sm text-muted-foreground">
              Based on {evidence.length} evidence items and {reasoning.steps.length} reasoning steps
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-foreground mb-1">
              {Math.round(confidence * 100)}%
            </div>
            <div className={`flex items-center gap-2 ${confidenceLevel.color}`}>
              <ConfidenceIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{confidenceLevel.label} Confidence</span>
            </div>
          </div>
        </div>

        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Evidence */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Evidence</h3>
              <p className="text-sm text-muted-foreground">
                {evidence.length} supporting evidence items found
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {evidence.map((item) => {
            const isExpanded = expandedEvidence.includes(item.id)
            
            return (
              <div key={item.id} className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'data' ? 'bg-green-500/10 text-green-400' :
                        item.type === 'literature' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Relevance: {Math.round(item.relevance * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      {isExpanded ? item.content : `${item.content.substring(0, 150)}...`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Source: {item.source}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEvidence(item.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="h-1 bg-muted rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${item.relevance * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reasoning Trace */}
      <ReasoningTraceViewer reasoning={reasoning} />

      {/* Citations */}
      {citations.length > 0 && (
        <div className="glass-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-gradient-to-r from-pink-500/5 to-purple-500/5">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-6 h-6 text-pink-400" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Citations</h3>
                <p className="text-sm text-muted-foreground">
                  {citations.length} references
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {citations.map((citation) => (
              <div key={citation.id} className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-foreground mb-1">{citation.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {citation.authors.join(', ')} ({citation.year})
                </p>
                {citation.journal && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {citation.journal}
                  </p>
                )}
                {citation.doi && (
                  <a
                    href={`https://doi.org/${citation.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline"
                  >
                    DOI: {citation.doi}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
