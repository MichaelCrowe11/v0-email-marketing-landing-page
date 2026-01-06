import { createClient } from '@/lib/azure/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Thermometer, Calendar, Target, Award, AlertTriangle } from "lucide-react"

// Prevent static generation - requires runtime auth
export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Fetch project statistics
  const { data: projects } = await supabase.from("projects").select("*")

  const { data: harvests } = await supabase.from("harvests").select("*")

  const { data: observations } = await supabase.from("growth_observations").select("*")

  const totalProjects = projects?.length || 0
  const activeProjects = projects?.filter((p) => p.status === "active").length || 0
  const completedProjects = projects?.filter((p) => p.status === "completed").length || 0
  const totalYield = harvests?.reduce((sum, h) => sum + (h.weight_grams || 0), 0) || 0
  const avgYieldPerProject = totalProjects > 0 ? totalYield / totalProjects : 0

  // Calculate success rate
  const successfulProjects = projects?.filter((p) => p.status === "completed" && p.success_rating >= 4).length || 0
  const successRate = completedProjects > 0 ? (successfulProjects / completedProjects) * 100 : 0

  // Species performance
  const speciesStats = projects?.reduce(
    (acc, project) => {
      const species = project.species_name || "Unknown"
      if (!acc[species]) {
        acc[species] = { count: 0, totalYield: 0, avgRating: 0, totalRating: 0 }
      }
      acc[species].count++
      const projectHarvests = harvests?.filter((h) => h.project_id === project.id) || []
      const projectYield = projectHarvests.reduce((sum, h) => sum + (h.weight_grams || 0), 0)
      acc[species].totalYield += projectYield
      if (project.success_rating) {
        acc[species].totalRating += project.success_rating
        acc[species].avgRating = acc[species].totalRating / acc[species].count
      }
      return acc
    },
    {} as Record<string, { count: number; totalYield: number; avgRating: number; totalRating: number }>,
  )

  const topSpecies = Object.entries(speciesStats || {})
    .sort(([, a], [, b]) => b.totalYield - a.totalYield)
    .slice(0, 5)

  // Recent observations
  const recentObservations = observations?.slice(0, 10) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950/20 via-background to-emerald-950/20">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent mb-3">
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your cultivation performance and optimize your growing strategy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-950/40 to-blue-900/20 border-blue-800/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Active</Badge>
              </div>
              <p className="text-3xl font-bold text-blue-100 mb-1">{activeProjects}</p>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-800/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-emerald-400" />
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Complete</Badge>
              </div>
              <p className="text-3xl font-bold text-emerald-100 mb-1">{completedProjects}</p>
              <p className="text-sm text-muted-foreground">Completed Projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-800/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 text-amber-400" />
                <div className="flex items-center gap-1">
                  {successRate >= 75 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-100 mb-1">{successRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-800/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Total</Badge>
              </div>
              <p className="text-3xl font-bold text-purple-100 mb-1">{(totalYield / 1000).toFixed(2)} kg</p>
              <p className="text-sm text-muted-foreground">Total Yield</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Top Performing Species
              </CardTitle>
              <CardDescription>Based on total yield and success ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSpecies.map(([species, stats], index) => (
                  <div key={species} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-500 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{species}</p>
                        <p className="text-sm text-muted-foreground">{stats.count} projects</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">{(stats.totalYield / 1000).toFixed(2)} kg</p>
                      <div className="flex items-center gap-1 text-sm text-amber-400">
                        <Award className="w-3 h-3" />
                        <span>{stats.avgRating.toFixed(1)}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
                {topSpecies.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No species data available yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Performance Insights
              </CardTitle>
              <CardDescription>Key metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-800/30">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-300 mb-1">Average Yield</p>
                      <p className="text-sm text-muted-foreground">
                        {(avgYieldPerProject / 1000).toFixed(2)} kg per project -{" "}
                        {avgYieldPerProject > 500 ? "Excellent performance!" : "Room for improvement"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-950/30 border border-blue-800/30">
                  <div className="flex items-start gap-3">
                    <Thermometer className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-300 mb-1">Environmental Control</p>
                      <p className="text-sm text-muted-foreground">
                        Monitor temperature and humidity closely during fruiting stages for optimal yields
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800/30">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-300 mb-1">Growth Cycle</p>
                      <p className="text-sm text-muted-foreground">
                        Average project duration: {projects && projects.length > 0 ? "45-60 days" : "No data yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {successRate < 70 && (
                  <div className="p-4 rounded-lg bg-red-950/30 border border-red-800/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-300 mb-1">Improvement Needed</p>
                        <p className="text-sm text-muted-foreground">
                          Review contamination prevention and sterile technique SOPs
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Recent Growth Observations
            </CardTitle>
            <CardDescription>Latest updates from your cultivation projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentObservations.map((obs) => (
                <div
                  key={obs.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {obs.growth_stage}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(obs.observation_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{obs.notes}</p>
                    {obs.health_status && (
                      <Badge
                        className={`mt-2 text-xs ${
                          obs.health_status === "healthy"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : obs.health_status === "warning"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {obs.health_status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {recentObservations.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No observations recorded yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
