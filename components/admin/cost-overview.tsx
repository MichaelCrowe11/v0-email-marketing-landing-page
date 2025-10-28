"use client"

/**
 * Cost Overview Component
 *
 * High-level cost metrics for quick dashboard view
 */

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, DollarSign, Activity, Users, Zap } from "lucide-react"

type OverviewData = {
  currentPeriod: {
    totalCost: number
    totalRequests: number
    totalTokens: number
    activeUsers: number
  }
  comparison: {
    percentChange: {
      cost: number
      requests: number
    }
  }
}

export default function CostOverview() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<"day" | "week" | "month">("week")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/cost-dashboard?period=${period}`)
        const json = await res.json()
        setData(json.data)
      } catch (error) {
        console.error("Failed to fetch overview:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  if (loading || !data) {
    return <div className="grid gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-32 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  }

  const costChange = data.comparison.percentChange.cost
  const requestChange = data.comparison.percentChange.requests

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriod("day")}
          className={`px-3 py-1 rounded-md text-sm ${period === "day" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          Today
        </button>
        <button
          onClick={() => setPeriod("week")}
          className={`px-3 py-1 rounded-md text-sm ${period === "week" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          This Week
        </button>
        <button
          onClick={() => setPeriod("month")}
          className={`px-3 py-1 rounded-md text-sm ${period === "month" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          This Month
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total Cost */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.currentPeriod.totalCost.toFixed(2)}</div>
            <div className={`flex items-center text-xs ${costChange >= 0 ? "text-red-500" : "text-green-500"}`}>
              {costChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(costChange).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        {/* Total Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentPeriod.totalRequests.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${requestChange >= 0 ? "text-blue-500" : "text-orange-500"}`}>
              {requestChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(requestChange).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        {/* Total Tokens */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.currentPeriod.totalTokens / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-muted-foreground">
              ${((data.currentPeriod.totalCost / data.currentPeriod.totalTokens) * 1000000).toFixed(2)}/M tokens
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentPeriod.activeUsers}</div>
            <div className="text-xs text-muted-foreground">
              ${(data.currentPeriod.totalCost / data.currentPeriod.activeUsers).toFixed(2)}/user
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
