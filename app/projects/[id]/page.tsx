"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Thermometer, Droplets, Wind, TrendingUp, Calendar, Clock, Eye, Plus } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<any>(null)
  const [readings, setReadings] = useState<any[]>([])
  const [observations, setObservations] = useState<any[]>([])
  const [harvests, setHarvests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadProjectData()
  }, [projectId])

  async function loadProjectData() {
    try {
      // Load project details
      const { data: projectData } = await supabase.from("cultivation_projects").select("*").eq("id", projectId).single()

      // Load environmental readings
      const { data: readingsData } = await supabase
        .from("environmental_readings")
        .select("*")
        .eq("project_id", projectId)
        .order("recorded_at", { ascending: false })
        .limit(20)

      // Load observations
      const { data: observationsData } = await supabase
        .from("growth_observations")
        .select("*")
        .eq("project_id", projectId)
        .order("observation_date", { ascending: false })

      // Load harvests
      const { data: harvestsData } = await supabase
        .from("harvest_records")
        .select("*")
        .eq("project_id", projectId)
        .order("harvest_date", { ascending: false })

      setProject(projectData)
      setReadings(readingsData || [])
      setObservations(observationsData || [])
      setHarvests(harvestsData || [])
    } catch (error) {
      console.error("[v0] Error loading project data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "fruiting":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "colonizing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "harvested":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "contaminated":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-accent/10 text-accent border-accent/20"
    }
  }

  const getEnvironmentStatus = (reading: any) => {
    if (!reading) return "unknown"
    const tempOk = reading.temperature >= 55 && reading.temperature <= 80
    const humidityOk = reading.humidity >= 75 && reading.humidity <= 98
    return tempOk && humidityOk ? "optimal" : "warning"
  }

  const latestReading = readings[0]
  const avgTemp = readings.length > 0 ? readings.reduce((sum, r) => sum + (r.temperature || 0), 0) / readings.length : 0
  const avgHumidity =
    readings.length > 0 ? readings.reduce((sum, r) => sum + (r.humidity || 0), 0) / readings.length : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Project not found</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysActive = project.inoculation_date
    ? Math.floor((new Date().getTime() - new Date(project.inoculation_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const expectedDays =
    project.expected_harvest_date && project.inoculation_date
      ? Math.floor(
          (new Date(project.expected_harvest_date).getTime() - new Date(project.inoculation_date).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 30
  const progress = Math.min((daysActive / expectedDays) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-foreground">{project.project_name}</h1>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </div>
            <p className="text-lg text-muted-foreground">{project.mushroom_species}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Started: {new Date(project.inoculation_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Day {daysActive} of {expectedDays}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Log Reading
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Timeline and completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium text-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-1">Substrate Type</p>
                <p className="font-medium text-foreground">{project.substrate_type || "Not specified"}</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-1">Container Type</p>
                <p className="font-medium text-foreground">{project.container_type || "Not specified"}</p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-medium text-foreground">{project.location || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="environment" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="observations">Observations</TabsTrigger>
            <TabsTrigger value="harvests">Harvests</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Environment Tab */}
          <TabsContent value="environment" className="space-y-6">
            {/* Current Conditions */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-red-500/20 bg-gradient-to-br from-card to-red-500/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
                  <Thermometer className="w-5 h-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {latestReading?.temperature?.toFixed(1) || "--"}°F
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Avg: {avgTemp.toFixed(1)}°F</p>
                  {latestReading && (
                    <Badge
                      className={`mt-2 ${
                        latestReading.temperature >= 55 && latestReading.temperature <= 80
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {latestReading.temperature >= 55 && latestReading.temperature <= 80 ? "Optimal" : "Check Range"}
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Humidity</CardTitle>
                  <Droplets className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {latestReading?.humidity?.toFixed(0) || "--"}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Avg: {avgHumidity.toFixed(0)}%</p>
                  {latestReading && (
                    <Badge
                      className={`mt-2 ${
                        latestReading.humidity >= 75 && latestReading.humidity <= 98
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {latestReading.humidity >= 75 && latestReading.humidity <= 98 ? "Optimal" : "Adjust"}
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">CO2 Level</CardTitle>
                  <Wind className="w-5 h-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{latestReading?.co2_level || "--"} ppm</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {latestReading ? new Date(latestReading.recorded_at).toLocaleTimeString() : "No data"}
                  </p>
                  {latestReading?.co2_level && (
                    <Badge
                      className={`mt-2 ${
                        latestReading.co2_level <= 1200
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {latestReading.co2_level <= 1200 ? "Good FAE" : "Increase FAE"}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Readings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Environmental Readings</CardTitle>
                <CardDescription>Last 10 recorded measurements</CardDescription>
              </CardHeader>
              <CardContent>
                {readings.length === 0 ? (
                  <div className="text-center py-12">
                    <Thermometer className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No environmental data</h3>
                    <p className="text-muted-foreground mb-6">Start logging environmental readings for this project</p>
                    <Button>Log First Reading</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {readings.slice(0, 10).map((reading) => {
                      const status = getEnvironmentStatus(reading)
                      return (
                        <div
                          key={reading.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-accent/5 hover:bg-accent/10 transition-colors"
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${status === "optimal" ? "bg-green-500" : "bg-yellow-500"} animate-pulse`}
                          />
                          <div className="flex-1 grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <Thermometer className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium text-foreground">
                                {reading.temperature?.toFixed(1)}°F
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-foreground">
                                {reading.humidity?.toFixed(0)}%
                              </span>
                            </div>
                            {reading.co2_level && (
                              <div className="flex items-center gap-2">
                                <Wind className="w-4 h-4 text-accent" />
                                <span className="text-sm font-medium text-foreground">{reading.co2_level} ppm</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(reading.recorded_at).toLocaleString()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Observations Tab */}
          <TabsContent value="observations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Growth Observations</CardTitle>
                    <CardDescription>Track visual changes and development stages</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Observation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {observations.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No observations yet</h3>
                    <p className="text-muted-foreground mb-6">Document growth stages and visual changes</p>
                    <Button>Add First Observation</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {observations.map((obs) => (
                      <Card key={obs.id} className="border-border/50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{obs.growth_stage}</CardTitle>
                              <CardDescription>{new Date(obs.observation_date).toLocaleDateString()}</CardDescription>
                            </div>
                            {obs.photo_url && (
                              <Badge variant="outline" className="gap-1">
                                <Eye className="w-3 h-3" />
                                Photo
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{obs.observation_notes}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Harvests Tab */}
          <TabsContent value="harvests" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Harvest Records</CardTitle>
                    <CardDescription>Track yields and quality metrics</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Record Harvest
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {harvests.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No harvests recorded</h3>
                    <p className="text-muted-foreground mb-6">Log your first harvest to track yields</p>
                    <Button>Record First Harvest</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {harvests.map((harvest) => (
                      <Card key={harvest.id} className="border-border/50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">Flush #{harvest.flush_number}</CardTitle>
                              <CardDescription>{new Date(harvest.harvest_date).toLocaleDateString()}</CardDescription>
                            </div>
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              {harvest.wet_weight} lbs
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Wet Weight</p>
                              <p className="font-medium text-foreground">{harvest.wet_weight} lbs</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Dry Weight</p>
                              <p className="font-medium text-foreground">{harvest.dry_weight || "--"} lbs</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Quality</p>
                              <p className="font-medium text-foreground">{harvest.quality_rating || "--"}/10</p>
                            </div>
                          </div>
                          {harvest.notes && <p className="text-sm text-muted-foreground mt-4">{harvest.notes}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Notes</CardTitle>
                <CardDescription>General observations and reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {project.notes || "No notes added yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
