"use client"

/**
 * Module Breakdown Component
 *
 * Visualizes cost distribution across CLAI modules
 */

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

type ModuleCost = {
  module: string
  totalCost: number
  totalRequests: number
  totalTokens: number
  avgCostPerRequest: number
  percentOfTotal: number
  topModels: Array<{
    modelId: string
    cost: number
    requests: number
  }>
}

export default function ModuleBreakdown() {
  const [modules, setModules] = useState<ModuleCost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/cost-dashboard/modules")
        const json = await res.json()
        setModules(json.data.modules)
      } catch (error) {
        console.error("Failed to fetch module breakdown:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-8">Loading module data...</div>
  }

  // Module display names
  const moduleNames: Record<string, string> = {
    "crowe-vision": "Crowe Vision",
    "growth-analytics": "Growth Analytics",
    "environmental-monitoring": "Environmental Monitoring",
    "yield-prediction": "Yield Prediction",
    "contamination-detection": "Contamination Detection",
    "species-library": "Species Library",
    "general-chat": "General Chat",
    "batch-analysis": "Batch Analysis"
  }

  // Module colors for visualization
  const moduleColors: Record<string, string> = {
    "crowe-vision": "bg-purple-500",
    "growth-analytics": "bg-blue-500",
    "environmental-monitoring": "bg-green-500",
    "yield-prediction": "bg-yellow-500",
    "contamination-detection": "bg-red-500",
    "species-library": "bg-indigo-500",
    "general-chat": "bg-gray-500",
    "batch-analysis": "bg-pink-500"
  }

  return (
    <div className="space-y-6">
      {/* Visual Bar Chart */}
      <div className="space-y-3">
        {modules.map((module) => (
          <div key={module.module} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{moduleNames[module.module] || module.module}</span>
              <span className="text-muted-foreground">
                ${module.totalCost.toFixed(2)} ({module.percentOfTotal.toFixed(1)}%)
              </span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${moduleColors[module.module] || "bg-gray-500"} transition-all`}
                style={{ width: `${module.percentOfTotal}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Avg/Request</TableHead>
              <TableHead>Top Model</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => {
              const topModel = module.topModels[0]
              return (
                <TableRow key={module.module}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${moduleColors[module.module] || "bg-gray-500"}`} />
                      {moduleNames[module.module] || module.module}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${module.totalCost.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right">
                    {module.totalRequests.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {(module.totalTokens / 1000).toFixed(1)}K
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    ${module.avgCostPerRequest.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {topModel ? topModel.modelId.split("/")[1] : "N/A"}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
        <span className="font-semibold">Total Across All Modules</span>
        <span className="text-lg font-bold">
          ${modules.reduce((sum, m) => sum + m.totalCost, 0).toFixed(2)}
        </span>
      </div>
    </div>
  )
}
