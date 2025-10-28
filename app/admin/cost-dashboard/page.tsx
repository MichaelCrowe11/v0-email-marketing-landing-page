/**
 * CLAI Cost Tracking Dashboard
 *
 * Admin dashboard for monitoring AI costs across modules and researchers
 */

import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CostOverview from "@/components/admin/cost-overview"
import ModuleBreakdown from "@/components/admin/module-breakdown"
import ResearcherUsage from "@/components/admin/researcher-usage"
import CostForecast from "@/components/admin/cost-forecast"
import ExportReports from "@/components/admin/export-reports"

export const metadata = {
  title: "Cost Dashboard | CLAI Admin",
  description: "Monitor AI costs and usage across CLAI modules",
}

export default async function CostDashboardPage() {
  // Check authentication and admin role
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">CLAI Cost Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor AI costs, track usage, and forecast spending across all modules
        </p>
      </div>

      {/* Overview Cards */}
      <Suspense fallback={<div>Loading overview...</div>}>
        <CostOverview />
      </Suspense>

      {/* Tabs */}
      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="researchers">Researchers</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost by Module</CardTitle>
              <CardDescription>
                Breakdown of costs across CLAI analytical modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading module data...</div>}>
                <ModuleBreakdown />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="researchers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Researcher Usage</CardTitle>
              <CardDescription>
                Individual researcher AI usage and costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading researcher data...</div>}>
                <ResearcherUsage />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Forecast</CardTitle>
              <CardDescription>
                Projected spending and budget planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading forecast...</div>}>
                <CostForecast />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>
                Download cost data for external analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportReports />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
