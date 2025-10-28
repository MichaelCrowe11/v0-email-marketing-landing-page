/**
 * User AI Usage Statistics API
 *
 * Returns usage metrics for the authenticated user
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserUsage } from "@/lib/ai/observability"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const usage = await getUserUsage(user.id)

    if (!usage) {
      return Response.json({
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        lastUsed: null,
        recentEvents: [],
      })
    }

    return Response.json({
      totalRequests: usage.totalRequests,
      totalTokens: usage.totalTokens,
      totalCost: usage.totalCost,
      lastUsed: new Date(usage.lastUsed).toISOString(),
      recentEvents: usage.recentEvents.map((event) => ({
        modelId: event.modelId,
        inputTokens: event.inputTokens,
        outputTokens: event.outputTokens,
        cost: event.cost,
        cached: event.cached,
        latencyMs: event.latencyMs,
        timestamp: new Date(event.timestamp).toISOString(),
      })),
    })
  } catch (error: any) {
    console.error("[AI v2] Usage stats error:", error)
    return Response.json(
      {
        error: "Failed to fetch usage statistics",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
