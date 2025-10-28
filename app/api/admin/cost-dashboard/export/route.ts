/**
 * Cost Report Export API
 *
 * Export cost data as CSV or JSON for external analysis
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { exportCostReport } from "@/lib/admin/cost-tracking"

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

    // Get parameters
    const { searchParams } = new URL(request.url)
    const startDate =
      searchParams.get("startDate") ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const endDate = searchParams.get("endDate") || new Date().toISOString().split("T")[0]
    const format = (searchParams.get("format") as "csv" | "json") || "csv"

    const report = await exportCostReport(startDate, endDate, format)

    // Set appropriate content type
    const contentType = format === "csv" ? "text/csv" : "application/json"
    const filename = `clai-cost-report-${startDate}-to-${endDate}.${format}`

    return new Response(report, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error("[ExportReport] Error:", error)
    return Response.json(
      {
        error: "Failed to export report",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
