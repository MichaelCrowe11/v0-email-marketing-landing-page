"use client"

/**
 * Researcher Usage Component
 *
 * Shows individual researcher AI usage and costs
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
import { Badge } from "@/components/ui/badge"

type ResearcherData = {
  userId: string
  userName: string
  email: string
  role: string
  totalCost: number
  totalRequests: number
  totalTokens: number
  costByModule: Record<string, number>
  lastActive: string
}

export default function ResearcherUsage() {
  const [researchers, setResearchers] = useState<ResearcherData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/cost-dashboard/researchers")
        const json = await res.json()
        setResearchers(json.data.researchers)
      } catch (error) {
        console.error("Failed to fetch researcher usage:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-8">Loading researcher data...</div>
  }

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    researcher: "bg-blue-100 text-blue-800",
    "lab-tech": "bg-green-100 text-green-800"
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Researcher</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Cost/Request</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {researchers.map((researcher) => (
              <TableRow key={researcher.userId}>
                <TableCell>
                  <div>
                    <div className="font-medium">{researcher.userName}</div>
                    <div className="text-xs text-muted-foreground">{researcher.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={roleColors[researcher.role] || "bg-gray-100 text-gray-800"}>
                    {researcher.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${researcher.totalCost.toFixed(4)}
                </TableCell>
                <TableCell className="text-right">
                  {researcher.totalRequests.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {(researcher.totalTokens / 1000).toFixed(1)}K
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  ${(researcher.totalCost / researcher.totalRequests).toFixed(4)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(researcher.lastActive).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Total Researchers</div>
          <div className="text-2xl font-bold">{researchers.length}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Avg Cost/Researcher</div>
          <div className="text-2xl font-bold">
            ${(researchers.reduce((sum, r) => sum + r.totalCost, 0) / researchers.length).toFixed(2)}
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Total Spend</div>
          <div className="text-2xl font-bold">
            ${researchers.reduce((sum, r) => sum + r.totalCost, 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
