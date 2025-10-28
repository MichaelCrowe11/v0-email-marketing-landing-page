/**
 * Budget Alerts Management API
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getAllBudgetAlerts,
  createBudgetAlert,
  updateBudgetAlert,
  deleteBudgetAlert,
  getAlertSummary,
  checkBudgetAlerts
} from "@/lib/admin/budget-alerts"

export const runtime = "edge"

// GET - List all alerts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "summary") {
      const summary = await getAlertSummary()
      return Response.json({ success: true, data: summary })
    }

    if (action === "check") {
      const triggered = await checkBudgetAlerts()
      return Response.json({ success: true, data: { triggered } })
    }

    const alerts = await getAllBudgetAlerts()
    return Response.json({ success: true, data: { alerts } })

  } catch (error: any) {
    console.error("[BudgetAlerts] GET error:", error)
    return Response.json(
      { error: "Failed to fetch alerts", message: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new alert
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const config = await request.json()
    const alert = await createBudgetAlert(config)

    return Response.json({ success: true, data: { alert } })

  } catch (error: any) {
    console.error("[BudgetAlerts] POST error:", error)
    return Response.json(
      { error: "Failed to create alert", message: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update alert
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id, ...updates } = await request.json()
    const alert = await updateBudgetAlert(id, updates)

    if (!alert) {
      return Response.json({ error: "Alert not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: { alert } })

  } catch (error: any) {
    console.error("[BudgetAlerts] PUT error:", error)
    return Response.json(
      { error: "Failed to update alert", message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove alert
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return Response.json({ error: "Alert ID required" }, { status: 400 })
    }

    const success = await deleteBudgetAlert(id)

    if (!success) {
      return Response.json({ error: "Failed to delete alert" }, { status: 500 })
    }

    return Response.json({ success: true })

  } catch (error: any) {
    console.error("[BudgetAlerts] DELETE error:", error)
    return Response.json(
      { error: "Failed to delete alert", message: error.message },
      { status: 500 }
    )
  }
}
