/**
 * Researcher Usage API
 *
 * Detailed usage and cost per researcher
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getResearcherUsage } from "@/lib/admin/cost-tracking"

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

    const researchers = await getResearcherUsage(startDate, endDate)

    return Response.json({
      success: true,
      data: {
        startDate,
        endDate,
        researchers,
        total: researchers.reduce((sum, r) => sum + r.totalCost, 0),
        totalActiveUsers: researchers.length,
      },
    })
  } catch (error: any) {
    console.error("[ResearcherUsage] Error:", error)
    return Response.json(
      {
        error: "Failed to fetch researcher usage",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
