/**
 * CLAI Cost Tracking System
 *
 * Provides comprehensive cost analytics for lab administrators:
 * - Real-time spend monitoring
 * - Per-module cost breakdown
 * - Researcher usage tracking
 * - Budget alerts and forecasting
 * - Batch-level cost attribution
 */

import { kv, kvKey, KV_PREFIXES } from "@/lib/kv/client"
import {
  getUserUsage,
  getDailyStats,
  getAllModelStats,
  getHistoricalStats,
  type TokenUsageMetrics
} from "@/lib/ai/observability"
import { AVAILABLE_MODELS, calculateCost } from "@/lib/ai-models"

/**
 * CLAI Module Types
 */
export type CLAIModule =
  | 'crowe-vision'
  | 'growth-analytics'
  | 'environmental-monitoring'
  | 'yield-prediction'
  | 'contamination-detection'
  | 'species-library'
  | 'general-chat'
  | 'batch-analysis'

/**
 * Cost breakdown by module
 */
export type ModuleCostBreakdown = {
  module: CLAIModule
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

/**
 * Researcher usage summary
 */
export type ResearcherUsage = {
  userId: string
  userName: string
  email: string
  role: 'lab-tech' | 'researcher' | 'admin'
  totalCost: number
  totalRequests: number
  totalTokens: number
  costByModule: Record<CLAIModule, number>
  lastActive: Date
  monthlyTrend: 'increasing' | 'stable' | 'decreasing'
}

/**
 * Budget alert configuration
 */
export type BudgetAlert = {
  id: string
  name: string
  threshold: number
  period: 'daily' | 'weekly' | 'monthly'
  scope: 'global' | 'module' | 'user'
  scopeId?: string // module name or user ID
  notifyEmails: string[]
  enabled: boolean
  currentSpend: number
  percentUsed: number
}

/**
 * Cost forecast
 */
export type CostForecast = {
  period: 'week' | 'month' | 'quarter'
  currentSpend: number
  projectedSpend: number
  trend: 'up' | 'down' | 'stable'
  confidence: number
  breakdown: Array<{
    module: CLAIModule
    projected: number
  }>
}

/**
 * Dashboard summary
 */
export type DashboardSummary = {
  timestamp: Date
  currentPeriod: {
    totalCost: number
    totalRequests: number
    totalTokens: number
    activeUsers: number
    activeModules: number
  }
  comparison: {
    previousPeriod: {
      totalCost: number
      totalRequests: number
    }
    percentChange: {
      cost: number
      requests: number
    }
  }
  topModules: ModuleCostBreakdown[]
  topUsers: ResearcherUsage[]
  alerts: BudgetAlert[]
  forecast: CostForecast
}

/**
 * Get module from metadata or classify from content
 */
export function classifyModule(metadata?: Record<string, any>): CLAIModule {
  if (metadata?.module) {
    return metadata.module as CLAIModule
  }

  // Default classification logic
  return 'general-chat'
}

/**
 * Track cost by module
 */
export async function trackModuleCost(
  module: CLAIModule,
  cost: number,
  tokens: number,
  modelId: string,
  userId: string
): Promise<void> {
  const now = Date.now()
  const dayKey = new Date(now).toISOString().split('T')[0]

  try {
    // Daily module costs
    const moduleKey = kvKey(KV_PREFIXES.TOKEN_USAGE, 'modules', module, dayKey)
    const current = await kv.get<{
      totalCost: number
      totalRequests: number
      totalTokens: number
      byModel: Record<string, { cost: number; requests: number }>
    }>(moduleKey) || {
      totalCost: 0,
      totalRequests: 0,
      totalTokens: 0,
      byModel: {}
    }

    current.totalCost += cost
    current.totalRequests += 1
    current.totalTokens += tokens

    if (!current.byModel[modelId]) {
      current.byModel[modelId] = { cost: 0, requests: 0 }
    }
    current.byModel[modelId].cost += cost
    current.byModel[modelId].requests += 1

    await kv.set(moduleKey, current, { ex: 7776000 }) // 90 days

    // User-module costs
    const userModuleKey = kvKey(KV_PREFIXES.TOKEN_USAGE, userId, 'modules', module)
    const userModuleCost = await kv.get<number>(userModuleKey) || 0
    await kv.set(userModuleKey, userModuleCost + cost, { ex: 7776000 })

  } catch (error) {
    console.error('[CostTracking] Failed to track module cost:', error)
  }
}

/**
 * Get cost breakdown by module for date range
 */
export async function getModuleCostBreakdown(
  startDate: string,
  endDate: string
): Promise<ModuleCostBreakdown[]> {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days: string[] = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().split('T')[0])
    }

    const modules: CLAIModule[] = [
      'crowe-vision',
      'growth-analytics',
      'environmental-monitoring',
      'yield-prediction',
      'contamination-detection',
      'species-library',
      'general-chat',
      'batch-analysis'
    ]

    const breakdown: ModuleCostBreakdown[] = []
    let totalCost = 0

    for (const module of modules) {
      let moduleCost = 0
      let moduleRequests = 0
      let moduleTokens = 0
      const modelCosts: Record<string, { cost: number; requests: number }> = {}

      for (const day of days) {
        const key = kvKey(KV_PREFIXES.TOKEN_USAGE, 'modules', module, day)
        const data = await kv.get<{
          totalCost: number
          totalRequests: number
          totalTokens: number
          byModel: Record<string, { cost: number; requests: number }>
        }>(key)

        if (data) {
          moduleCost += data.totalCost
          moduleRequests += data.totalRequests
          moduleTokens += data.totalTokens

          Object.entries(data.byModel).forEach(([modelId, stats]) => {
            if (!modelCosts[modelId]) {
              modelCosts[modelId] = { cost: 0, requests: 0 }
            }
            modelCosts[modelId].cost += stats.cost
            modelCosts[modelId].requests += stats.requests
          })
        }
      }

      if (moduleCost > 0) {
        totalCost += moduleCost

        const topModels = Object.entries(modelCosts)
          .map(([modelId, stats]) => ({ modelId, ...stats }))
          .sort((a, b) => b.cost - a.cost)
          .slice(0, 5)

        breakdown.push({
          module,
          totalCost: moduleCost,
          totalRequests: moduleRequests,
          totalTokens: moduleTokens,
          avgCostPerRequest: moduleCost / moduleRequests,
          percentOfTotal: 0, // Will calculate after
          topModels
        })
      }
    }

    // Calculate percentages
    breakdown.forEach(item => {
      item.percentOfTotal = (item.totalCost / totalCost) * 100
    })

    return breakdown.sort((a, b) => b.totalCost - a.totalCost)

  } catch (error) {
    console.error('[CostTracking] Failed to get module breakdown:', error)
    return []
  }
}

/**
 * Get researcher usage summary
 */
export async function getResearcherUsage(
  startDate: string,
  endDate: string
): Promise<ResearcherUsage[]> {
  try {
    // Get all user IDs who have usage in this period
    const pattern = kvKey(KV_PREFIXES.TOKEN_USAGE, '*', 'totals')
    const keys = await kv.keys(pattern)

    const researchers: ResearcherUsage[] = []

    for (const key of keys) {
      const userId = key.split(':')[1]
      const usage = await getUserUsage(userId)

      if (!usage) continue

      // Get user details from Supabase (you'll need to implement this)
      // For now, using placeholder
      const userDetails = {
        name: `User ${userId.substring(0, 8)}`,
        email: `user@lab.com`,
        role: 'researcher' as const
      }

      // Get cost by module
      const costByModule: Record<CLAIModule, number> = {} as any
      const modules: CLAIModule[] = [
        'crowe-vision',
        'growth-analytics',
        'environmental-monitoring',
        'yield-prediction',
        'contamination-detection',
        'species-library',
        'general-chat',
        'batch-analysis'
      ]

      for (const module of modules) {
        const moduleKey = kvKey(KV_PREFIXES.TOKEN_USAGE, userId, 'modules', module)
        const cost = await kv.get<number>(moduleKey) || 0
        if (cost > 0) {
          costByModule[module] = cost
        }
      }

      researchers.push({
        userId,
        userName: userDetails.name,
        email: userDetails.email,
        role: userDetails.role,
        totalCost: usage.totalCost,
        totalRequests: usage.totalRequests,
        totalTokens: usage.totalTokens,
        costByModule,
        lastActive: new Date(usage.lastUsed),
        monthlyTrend: 'stable' // TODO: Calculate from historical data
      })
    }

    return researchers.sort((a, b) => b.totalCost - a.totalCost)

  } catch (error) {
    console.error('[CostTracking] Failed to get researcher usage:', error)
    return []
  }
}

/**
 * Calculate cost forecast
 */
export async function calculateForecast(
  period: 'week' | 'month' | 'quarter'
): Promise<CostForecast> {
  try {
    const now = new Date()
    const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 90
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    const endDate = now.toISOString().split('T')[0]

    const historical = await getHistoricalStats(startDate, endDate)
    const dailyCosts = Object.values(historical).map(day => day.totalCost)

    const currentSpend = dailyCosts.reduce((sum, cost) => sum + cost, 0)
    const avgDailyCost = currentSpend / dailyCosts.length

    // Simple linear projection
    const daysToProject = period === 'week' ? 7 : period === 'month' ? 30 : 90
    const projectedSpend = avgDailyCost * daysToProject

    // Trend analysis
    const recentHalf = dailyCosts.slice(Math.floor(dailyCosts.length / 2))
    const recentAvg = recentHalf.reduce((sum, cost) => sum + cost, 0) / recentHalf.length
    const trend = recentAvg > avgDailyCost * 1.1 ? 'up' :
                  recentAvg < avgDailyCost * 0.9 ? 'down' : 'stable'

    // Module breakdown
    const moduleBreakdown = await getModuleCostBreakdown(startDate, endDate)
    const breakdown = moduleBreakdown.map(m => ({
      module: m.module,
      projected: (m.totalCost / dailyCosts.length) * daysToProject
    }))

    return {
      period,
      currentSpend,
      projectedSpend,
      trend,
      confidence: 0.75, // Could be improved with better algorithms
      breakdown
    }

  } catch (error) {
    console.error('[CostTracking] Failed to calculate forecast:', error)
    return {
      period,
      currentSpend: 0,
      projectedSpend: 0,
      trend: 'stable',
      confidence: 0,
      breakdown: []
    }
  }
}

/**
 * Get dashboard summary
 */
export async function getDashboardSummary(
  period: 'day' | 'week' | 'month' = 'week'
): Promise<DashboardSummary> {
  try {
    const now = new Date()
    const daysBack = period === 'day' ? 1 : period === 'week' ? 7 : 30
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    const endDate = now.toISOString().split('T')[0]

    // Current period stats
    const historical = await getHistoricalStats(startDate, endDate)
    const currentStats = Object.values(historical).reduce((acc, day) => ({
      totalCost: acc.totalCost + day.totalCost,
      totalRequests: acc.totalRequests + day.totalRequests,
      totalTokens: acc.totalTokens + day.totalTokens
    }), { totalCost: 0, totalRequests: 0, totalTokens: 0 })

    // Previous period for comparison
    const prevStartDate = new Date(now.getTime() - daysBack * 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    const prevEndDate = startDate
    const prevHistorical = await getHistoricalStats(prevStartDate, prevEndDate)
    const prevStats = Object.values(prevHistorical).reduce((acc, day) => ({
      totalCost: acc.totalCost + day.totalCost,
      totalRequests: acc.totalRequests + day.totalRequests
    }), { totalCost: 0, totalRequests: 0 })

    // Module breakdown
    const topModules = await getModuleCostBreakdown(startDate, endDate)

    // Researcher usage
    const topUsers = await getResearcherUsage(startDate, endDate)

    // Forecast
    const forecast = await calculateForecast(period === 'day' ? 'week' : period === 'week' ? 'month' : 'quarter')

    // Budget alerts (placeholder - implement based on your alert system)
    const alerts: BudgetAlert[] = []

    return {
      timestamp: now,
      currentPeriod: {
        totalCost: currentStats.totalCost,
        totalRequests: currentStats.totalRequests,
        totalTokens: currentStats.totalTokens,
        activeUsers: topUsers.length,
        activeModules: topModules.length
      },
      comparison: {
        previousPeriod: prevStats,
        percentChange: {
          cost: prevStats.totalCost > 0
            ? ((currentStats.totalCost - prevStats.totalCost) / prevStats.totalCost) * 100
            : 0,
          requests: prevStats.totalRequests > 0
            ? ((currentStats.totalRequests - prevStats.totalRequests) / prevStats.totalRequests) * 100
            : 0
        }
      },
      topModules: topModules.slice(0, 5),
      topUsers: topUsers.slice(0, 10),
      alerts,
      forecast
    }

  } catch (error) {
    console.error('[CostTracking] Failed to get dashboard summary:', error)
    throw error
  }
}

/**
 * Export cost report as CSV
 */
export async function exportCostReport(
  startDate: string,
  endDate: string,
  format: 'csv' | 'json' = 'csv'
): Promise<string> {
  const moduleBreakdown = await getModuleCostBreakdown(startDate, endDate)
  const researchers = await getResearcherUsage(startDate, endDate)

  if (format === 'json') {
    return JSON.stringify({ moduleBreakdown, researchers }, null, 2)
  }

  // CSV format
  let csv = 'Report Type,Module/User,Total Cost,Total Requests,Total Tokens,Avg Cost/Request\n'

  moduleBreakdown.forEach(m => {
    csv += `Module,${m.module},${m.totalCost.toFixed(4)},${m.totalRequests},${m.totalTokens},${m.avgCostPerRequest.toFixed(4)}\n`
  })

  researchers.forEach(r => {
    csv += `Researcher,${r.userName},${r.totalCost.toFixed(4)},${r.totalRequests},${r.totalTokens},${(r.totalCost / r.totalRequests).toFixed(4)}\n`
  })

  return csv
}
