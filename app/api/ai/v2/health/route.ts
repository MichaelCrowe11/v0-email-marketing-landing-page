/**
 * AI System Health Check API
 *
 * Returns status of all models and system metrics
 */

import { NextRequest } from "next/server"
import { getAllModelHealth } from "@/lib/ai/fallback"
import { getDailyStats, getAllModelStats } from "@/lib/ai/observability"
import { getCacheStats } from "@/lib/kv/cache"
import { getDedupStats } from "@/lib/kv/deduplication"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // Get all health data in parallel
    const [modelHealth, dailyStats, modelStats, cacheStats, dedupStats] = await Promise.all([
      getAllModelHealth(),
      getDailyStats(),
      getAllModelStats(),
      getCacheStats(),
      getDedupStats(),
    ])

    // Count models by status
    const healthSummary = modelHealth.reduce(
      (acc, health) => {
        acc[health.status]++
        return acc
      },
      { healthy: 0, degraded: 0, down: 0 },
    )

    return Response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      models: {
        summary: healthSummary,
        details: modelHealth.map((h) => ({
          modelId: h.modelId,
          status: h.status,
          errorCount: h.errorCount,
          lastChecked: new Date(h.lastChecked).toISOString(),
          lastError: h.lastError,
        })),
      },
      performance: {
        today: dailyStats
          ? {
              totalRequests: dailyStats.totalRequests,
              totalTokens: dailyStats.totalTokens,
              totalCost: dailyStats.totalCost,
              avgLatency: Math.round(dailyStats.avgLatency),
              cacheHitRate: Math.round(dailyStats.cacheHitRate * 100) / 100,
            }
          : null,
        byModel: Object.entries(modelStats).map(([modelId, stats]) => ({
          modelId,
          requests: stats.totalRequests,
          avgLatency: Math.round(stats.avgLatency),
          p95Latency: Math.round(stats.p95Latency),
          p99Latency: Math.round(stats.p99Latency),
          totalCost: stats.totalCost,
        })),
      },
      cache: {
        totalKeys: cacheStats.totalKeys,
        semanticKeys: cacheStats.semanticKeys,
        responseCached: cacheStats.estimatedSize,
      },
      deduplication: {
        pending: dedupStats.pendingRequests,
        completed: dedupStats.completedRequests,
        total: dedupStats.totalRequests,
      },
    })
  } catch (error: any) {
    console.error("[AI v2] Health check error:", error)
    return Response.json(
      {
        status: "error",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
