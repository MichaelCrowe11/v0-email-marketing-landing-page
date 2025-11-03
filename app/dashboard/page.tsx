"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sprout,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Plus,
  Eye,
  Calendar,
  Crown,
  Zap,
  Camera,
  MessageSquare,
  Video,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [recentReadings, setRecentReadings] = useState<any[]>([])
  const [subscription, setSubscription] = useState<any>(null)
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalHarvests: 0,
    avgYield: 0,
    alertsCount: 0,
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        console.warn("[v0] Supabase not configured, using mock data")
        setStats({
          activeProjects: 0,
          totalHarvests: 0,
          avgYield: 0,
          alertsCount: 0,
        })
        setLoading(false)
        return
      }

      // Get user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: subscriptionData } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user.id)
        .single()

      setSubscription(subscriptionData)

      // Load active projects
      const { data: projectsData } = await supabase
        .from("cultivation_projects")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active", "fruiting", "colonizing"])
        .order("created_at", { ascending: false })
        .limit(6)

      // Load recent environmental readings
      const { data: readingsData } = await supabase
        .from("environmental_readings")
        .select("*, cultivation_projects(project_name, mushroom_species)")
        .order("recorded_at", { ascending: false })
        .limit(10)

      // Load harvest stats
      const { data: harvestsData } = await supabase
        .from("harvest_records")
        .select("wet_weight, dry_weight")
        .eq("user_id", user.id)

      // Calculate stats
      const activeCount = projectsData?.length || 0
      const totalHarvests = harvestsData?.length || 0
      const avgYield =
        harvestsData && harvestsData.length > 0
          ? harvestsData.reduce((sum, h) => sum + (h.wet_weight || 0), 0) / harvestsData.length
          : 0

      // Check for alerts (temperature or humidity out of range)
      const alertsCount =
        readingsData?.filter((r) => r.temperature < 55 || r.temperature > 80 || r.humidity < 75 || r.humidity > 98)
          .length || 0

      setProjects(projectsData || [])
      setRecentReadings(readingsData || [])
      setStats({
        activeProjects: activeCount,
        totalHarvests,
        avgYield: Math.round(avgYield * 100) / 100,
        alertsCount,
      })
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
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
    const tempOk = reading.temperature >= 55 && reading.temperature <= 80
    const humidityOk = reading.humidity >= 75 && reading.humidity <= 98
    return tempOk && humidityOk ? "optimal" : "warning"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your cultivation dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Cultivation Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your projects, track environmental conditions, and optimize yields
            </p>
          </div>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/projects/new">
              <Plus className="w-5 h-5" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
              <Sprout className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently growing</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-card to-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Harvests</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalHarvests}</div>
              <p className="text-xs text-muted-foreground mt-1">Successful completions</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Yield</CardTitle>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.avgYield} lbs</div>
              <p className="text-xs text-muted-foreground mt-1">Per harvest (wet weight)</p>
            </CardContent>
          </Card>

          <Card
            className={`border-${stats.alertsCount > 0 ? "red" : "green"}-500/20 bg-gradient-to-br from-card to-${stats.alertsCount > 0 ? "red" : "green"}-500/5`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Environment Alerts</CardTitle>
              {stats.alertsCount > 0 ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.alertsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.alertsCount > 0 ? "Requires attention" : "All systems optimal"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Cultivation Projects</CardTitle>
                <CardDescription>Monitor progress and manage your growing operations</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <Sprout className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No active projects</h3>
                    <p className="text-muted-foreground mb-6">Start your first cultivation project to begin tracking</p>
                    <Button asChild>
                      <Link href="/projects/new">Create Project</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                      const daysActive = project.inoculation_date
                        ? Math.floor(
                            (new Date().getTime() - new Date(project.inoculation_date).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )
                        : 0
                      const expectedDays =
                        project.expected_harvest_date && project.inoculation_date
                          ? Math.floor(
                              (new Date(project.expected_harvest_date).getTime() -
                                new Date(project.inoculation_date).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )
                          : 30
                      const progress = Math.min((daysActive / expectedDays) * 100, 100)

                      return (
                        <Card
                          key={project.id}
                          className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg truncate">{project.project_name}</CardTitle>
                                <CardDescription className="truncate">{project.mushroom_species}</CardDescription>
                              </div>
                              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground">{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Day {daysActive}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{expectedDays - daysActive}d left</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent" asChild>
                                <Link href={`/projects/${project.id}`}>
                                  <Eye className="w-4 h-4" />
                                  View
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent" asChild>
                                <Link href={`/projects/${project.id}/readings`}>
                                  <BarChart3 className="w-4 h-4" />
                                  Data
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environment Tab */}
          <TabsContent value="environment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Monitoring</CardTitle>
                <CardDescription>Real-time conditions across all cultivation projects</CardDescription>
              </CardHeader>
              <CardContent>
                {recentReadings.length === 0 ? (
                  <div className="text-center py-12">
                    <Thermometer className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No environmental data</h3>
                    <p className="text-muted-foreground">Start logging environmental readings for your projects</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentReadings.slice(0, 5).map((reading) => {
                      const status = getEnvironmentStatus(reading)
                      const projectInfo = reading.cultivation_projects

                      return (
                        <div
                          key={reading.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-accent/5 hover:bg-accent/10 transition-colors"
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${status === "optimal" ? "bg-green-500" : "bg-yellow-500"} animate-pulse`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {projectInfo?.project_name || "Unknown Project"}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {projectInfo?.mushroom_species || "Unknown Species"}
                            </p>
                          </div>
                          <div className="flex gap-6">
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
                            {new Date(reading.recorded_at).toLocaleTimeString()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Current Plan Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-primary" />
                      Current Plan
                    </CardTitle>
                    <Badge
                      variant={subscription?.subscription_plans?.tier === "enterprise" ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {subscription?.subscription_plans?.tier || "free"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {subscription?.status === "active" ? "Active subscription" : "Manage your subscription"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={subscription?.status === "active" ? "default" : "secondary"}>
                        {subscription?.status || "inactive"}
                      </Badge>
                    </div>
                    {subscription?.current_period_end && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Renews on</span>
                        <span className="font-medium">
                          {new Date(subscription.current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-2">
                    <p className="text-sm font-semibold text-foreground mb-3">Plan Features</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">
                          {subscription?.subscription_plans?.tier === "free" ? "5 messages/day" : "Unlimited AI chat"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {subscription?.subscription_plans?.tier === "free" ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-muted-foreground">
                          {subscription?.subscription_plans?.tier === "free" ? "Limited" : "Full"} Crowe Vision access
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {subscription?.subscription_plans?.tier === "enterprise" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-muted-foreground">
                          {subscription?.subscription_plans?.tier === "enterprise" ? "Unlimited" : "Limited"} video
                          generation
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">
                          {subscription?.subscription_plans?.tier === "free" ? "Basic" : "Advanced"} analytics
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    {subscription?.subscription_plans?.tier === "free" && (
                      <Button className="w-full gap-2" asChild>
                        <Link href="/pricing">
                          <Zap className="w-4 h-4" />
                          Upgrade to Pro
                        </Link>
                      </Button>
                    )}
                    {subscription?.subscription_plans?.tier === "pro" && (
                      <Button className="w-full gap-2" asChild>
                        <Link href="/pricing">
                          <Crown className="w-4 h-4" />
                          Upgrade to Enterprise
                        </Link>
                      </Button>
                    )}
                    {subscription?.stripe_customer_id && (
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <a
                          href={`https://billing.stripe.com/p/login/test_${subscription.stripe_customer_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Manage Billing
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Statistics Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Usage This Month
                  </CardTitle>
                  <CardDescription>Track your feature usage and limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Chat Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-accent" />
                        <span className="font-medium">AI Chat Messages</span>
                      </div>
                      <span className="text-muted-foreground">
                        {subscription?.subscription_plans?.tier === "free" ? "5/5 daily" : "Unlimited"}
                      </span>
                    </div>
                    {subscription?.subscription_plans?.tier === "free" && <Progress value={100} className="h-2" />}
                  </div>

                  {/* Crowe Vision Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Image Analysis</span>
                      </div>
                      <span className="text-muted-foreground">
                        {subscription?.subscription_plans?.tier === "free" ? "0/10 monthly" : "Unlimited"}
                      </span>
                    </div>
                    {subscription?.subscription_plans?.tier === "free" && <Progress value={0} className="h-2" />}
                  </div>

                  {/* Video Studio Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">Video Generation</span>
                      </div>
                      <span className="text-muted-foreground">
                        {subscription?.subscription_plans?.tier === "enterprise" ? "Unlimited" : "0/5 monthly"}
                      </span>
                    </div>
                    {subscription?.subscription_plans?.tier !== "enterprise" && <Progress value={0} className="h-2" />}
                  </div>

                  {/* AI Modules Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-medium">AI Module Access</span>
                      </div>
                      <span className="text-muted-foreground">
                        {subscription?.subscription_plans?.tier === "free" ? "Limited" : "Full Access"}
                      </span>
                    </div>
                  </div>

                  {subscription?.subscription_plans?.tier === "free" && (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-3">
                        Upgrade to unlock unlimited access to all features
                      </p>
                      <Button className="w-full" asChild>
                        <Link href="/pricing">View Plans</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Tips</CardTitle>
                  <CardDescription>Michael Crowe's cultivation wisdom</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-medium text-foreground mb-2">Optimal Colonization</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Maintain 70-75°F during colonization. Cooler temperatures slow growth but reduce contamination
                      risk. Warmer speeds colonization but increases contamination pressure.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-medium text-foreground mb-2">Fruiting Conditions</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Drop temperature 5-10°F to trigger pinning. Increase humidity to 85-95% and introduce fresh air
                      exchange. Light is the signal for direction, not energy.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-medium text-foreground mb-2">Contamination Prevention</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The best defense is proper sterilization and clean technique. If you see green mold, isolate
                      immediately. Prevention is 100x easier than treatment.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                  <CardDescription>Based on your current projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 bg-transparent" asChild>
                    <Link href="/species-library">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Sprout className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">Explore Species Library</p>
                        <p className="text-sm text-muted-foreground">Browse 50+ mushroom species with growing guides</p>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 bg-transparent" asChild>
                    <Link href="/sops">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">Review SOPs</p>
                        <p className="text-sm text-muted-foreground">
                          Standard operating procedures for professional cultivation
                        </p>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 bg-transparent" asChild>
                    <Link href="/contamination-guide">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">Contamination Guide</p>
                        <p className="text-sm text-muted-foreground">Identify and prevent common contaminants</p>
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
