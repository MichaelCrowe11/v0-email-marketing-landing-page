"use client"

import { useState } from "react"
import { Plus, X, Lightbulb, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HypothesisModel, Variable, Condition } from "@/lib/types/workbench"

interface HypothesisBuilderProps {
  sessionId: string
  datasets: string[]
  onSave: (hypothesis: Partial<HypothesisModel>) => void
  onCancel: () => void
}

export function HypothesisBuilder({ sessionId, datasets, onSave, onCancel }: HypothesisBuilderProps) {
  const [statement, setStatement] = useState("")
  const [variables, setVariables] = useState<Variable[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [expectedOutcome, setExpectedOutcome] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const addVariable = () => {
    setVariables([
      ...variables,
      { name: "", type: "numeric", description: "" }
    ])
  }

  const updateVariable = (index: number, updates: Partial<Variable>) => {
    setVariables(variables.map((v, i) => i === index ? { ...v, ...updates } : v))
  }

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index))
  }

  const addCondition = () => {
    setConditions([
      ...conditions,
      { variable: "", operator: "equals", value: "" }
    ])
  }

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    setConditions(conditions.map((c, i) => i === index ? { ...c, ...updates } : c))
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const hypothesis: Partial<HypothesisModel> = {
      statement,
      variables,
      conditions,
      expectedOutcome,
    }
    onSave(hypothesis)
  }

  const isValid = statement.trim() && expectedOutcome.trim()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Create Hypothesis</h3>
          <p className="text-sm text-muted-foreground">
            Define a testable hypothesis for AI-powered analysis
          </p>
        </div>
      </div>

      {/* Hypothesis Statement */}
      <div className="glass-card rounded-xl p-6 border border-border">
        <label className="block text-sm font-medium text-foreground mb-2">
          Hypothesis Statement *
        </label>
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="e.g., Higher substrate moisture content (>65%) leads to increased contamination rates in oyster mushroom cultivation"
          rows={3}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          State your hypothesis clearly and specifically
        </p>
      </div>

      {/* Variables */}
      <div className="glass-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-foreground">Variables</h4>
            <p className="text-xs text-muted-foreground">Define the variables in your hypothesis</p>
          </div>
          <Button variant="outline" size="sm" onClick={addVariable}>
            <Plus className="w-4 h-4 mr-2" />
            Add Variable
          </Button>
        </div>

        {variables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No variables defined yet
          </div>
        ) : (
          <div className="space-y-3">
            {variables.map((variable, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => updateVariable(index, { name: e.target.value })}
                    placeholder="Variable name"
                    className="px-3 py-2 bg-card border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <select
                    value={variable.type}
                    onChange={(e) => updateVariable(index, { type: e.target.value as any })}
                    className="px-3 py-2 bg-card border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="numeric">Numeric</option>
                    <option value="categorical">Categorical</option>
                    <option value="boolean">Boolean</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariable(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  type="text"
                  value={variable.description}
                  onChange={(e) => updateVariable(index, { description: e.target.value })}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2 bg-card border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Options */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/5 transition-colors"
        >
          <span className="text-sm font-medium text-foreground">Advanced Options</span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-6 border-t border-border space-y-4">
            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Conditions</h4>
                  <p className="text-xs text-muted-foreground">Define specific conditions to test</p>
                </div>
                <Button variant="outline" size="sm" onClick={addCondition}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              </div>

              {conditions.length > 0 && (
                <div className="space-y-2">
                  {conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={condition.variable}
                        onChange={(e) => updateCondition(index, { variable: e.target.value })}
                        placeholder="Variable"
                        className="flex-1 px-3 py-2 bg-card border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, { operator: e.target.value as any })}
                        className="px-3 py-2 bg-card border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        <option value="equals">equals</option>
                        <option value="greater">greater than</option>
                        <option value="less">less than</option>
                        <option value="contains">contains</option>
                        <option value="matches">matches</option>
                      </select>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 bg-card border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expected Outcome */}
      <div className="glass-card rounded-xl p-6 border border-border">
        <label className="block text-sm font-medium text-foreground mb-2">
          Expected Outcome *
        </label>
        <textarea
          value={expectedOutcome}
          onChange={(e) => setExpectedOutcome(e.target.value)}
          placeholder="e.g., We expect to see a positive correlation between moisture content and contamination rates, with contamination increasing by 15-20% for every 5% increase in moisture above 65%"
          rows={3}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Describe what you expect to find if the hypothesis is correct
        </p>
      </div>

      {/* AI Insight */}
      <div className="glass-card rounded-xl p-4 border border-purple-500/30 bg-purple-500/5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-400 mb-1">AI-Powered Testing</p>
            <p className="text-xs text-muted-foreground">
              The DeepParallel reasoning engine will spawn multiple AI agents to test your hypothesis
              across your datasets, analyze patterns, and provide evidence-based conclusions with
              confidence scores.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isValid}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Create & Test Hypothesis
        </Button>
      </div>
    </div>
  )
}
