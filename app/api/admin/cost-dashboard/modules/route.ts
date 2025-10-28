/**
 * Module Cost Breakdown API
 *
 * Detailed cost analysis per CLAI module
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getModuleCostBreakdown } from "@/lib/admin/cost-tracking"

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

    // Check admin role
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get date range
    const { searchParams } = new URL(request.url)
    const startDate =
      searchParams.get("startDate") ||
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const endDate = searchParams.get("endDate") || new Date().toISOString().split("T")[0]

    const breakdown = await getModuleCostBreakdown(startDate, endDate)

    return Response.json({
      success: true,
      data: {
        startDate,
        endDate,
        modules: breakdown,
        total: breakdown.reduce((sum, m) => sum + m.totalCost, 0),
      },
    })
  } catch (error: any) {
    console.error("[ModuleCosts] Error:", error)
    return Response.json(
      {
        error: "Failed to fetch module costs",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
