/**
 * CLAI Cost Dashboard API
 *
 * Main endpoint for admin cost tracking dashboard
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getDashboardSummary } from "@/lib/admin/cost-tracking"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate admin
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Check admin role (you'll need to implement this check)
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return Response.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // 3. Get query parameters
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get("period") as "day" | "week" | "month") || "week"

    // 4. Get dashboard summary
    const summary = await getDashboardSummary(period)

    return Response.json({
      success: true,
      data: summary,
    })
  } catch (error: any) {
    console.error("[CostDashboard] Error:", error)
    return Response.json(
      {
        error: "Failed to fetch dashboard data",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
