"use client"

import { createClient } from '@/lib/supabase'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, TrendingUp, AlertTriangle, CheckCircle2, Eye, BookOpen, Play } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

const FALLBACK_SOPS = [
  {
    id: "fb-sop-1",
    title: "Sterile Technique for Inoculation",
    category: "Sterile Technique",
    difficulty_level: "Beginner",
    estimated_time: "30-45 minutes",
    content: "# Sterile Technique for Inoculation\n\n## Overview\nProper sterile technique is the foundation of successful mushroom cultivation. This SOP covers essential steps to maintain contamination-free inoculation.\n\n## Pre-Inoculation Preparation\n1. Clean work surface with 70% isopropyl alcohol\n2. Set up still air box (SAB) or flow hood\n3. Organize all materials within reach\n4. Wash hands, wear gloves, mask, and clean clothing\n\n## Inoculation Process\n1. Flame sterilize needle until red hot, cool 10 seconds\n2. Wipe injection port with alcohol swab\n3. Inject 1-2cc of culture per injection point (4-6 points per 5lb bag)\n4. Seal injection ports with micropore tape\n5. Label with species, date, and batch number",
    equipment_needed: ["Still air box or flow hood", "Isopropyl alcohol 70%", "Alcohol lamp", "Nitrile gloves", "Face mask", "Micropore tape"],
    safety_warnings: ["Work in well-ventilated area when using alcohol", "Keep flame away from flammable materials"],
    success_rate: 95.0,
    is_premium: false,
    view_count: 342,
  },
  {
    id: "fb-sop-2",
    title: "Substrate Preparation & Pasteurization",
    category: "Substrate Preparation",
    difficulty_level: "Intermediate",
    estimated_time: "2-3 hours",
    content: "# Substrate Preparation & Pasteurization\n\n## Overview\nProper substrate preparation is critical for healthy mycelial growth and high yields.\n\n## Standard Oyster Substrate\n- 5 lbs straw (chopped to 2-4 inches)\n- 1.25 lbs wheat bran (25% supplement)\n- 0.25 lbs gypsum (5%)\n- Water to field capacity (65-70% moisture)\n\n## Hot Water Bath Pasteurization\n1. Heat water to 160-180°F (71-82°C)\n2. Submerge substrate in mesh bag for 90 minutes\n3. Maintain temperature, stir occasionally\n4. Cool to below 80°F before inoculation\n\n## Moisture Testing\nSqueeze handful — should drip 1-3 drops. Adjust water as needed.",
    equipment_needed: ["Large pot or drum", "Thermometer", "pH meter", "Mesh bags", "Mixing container", "Gloves"],
    safety_warnings: ["Hot water can cause severe burns", "Hydrated lime is caustic — wear protective equipment"],
    success_rate: 90.0,
    is_premium: false,
    view_count: 287,
  },
  {
    id: "fb-sop-3",
    title: "Environmental Control for Fruiting",
    category: "Environmental Control",
    difficulty_level: "Intermediate",
    estimated_time: "15-20 minutes per day",
    content: "# Environmental Control for Fruiting\n\n## Key Parameters\n- **Temperature**: Fruiting 55-65°F, Colonization 70-75°F\n- **Humidity**: Pinning 90-95% RH, Fruiting 85-90% RH\n- **FAE**: 6-8 air exchanges per hour during fruiting\n- **Light**: 12 hours indirect light, 500-1000 lux\n- **CO2**: Keep below 1000 ppm during fruiting\n\n## Daily Monitoring Routine\n1. Morning: Record temp/humidity, mist if below 85%, check for contamination\n2. Afternoon: Adjust heater/cooler, check substrate moisture\n3. Evening: Final readings, ensure humidifier has water\n\n## Troubleshooting\n- Fuzzy feet = increase FAE\n- Dry mushrooms = increase humidity\n- Slow pinning = check temperature, increase FAE",
    equipment_needed: ["Thermometer/hygrometer", "Humidifier", "Fan for FAE", "Spray bottle", "Timer"],
    safety_warnings: ["Keep electrical equipment away from water", "Ensure proper ventilation"],
    success_rate: 88.0,
    is_premium: false,
    view_count: 256,
  },
  {
    id: "fb-sop-4",
    title: "Grain Spawn Preparation",
    category: "Spawn Production",
    difficulty_level: "Intermediate",
    estimated_time: "3-4 hours",
    content: "# Grain Spawn Preparation\n\n## Overview\nGrain spawn is the vehicle for transferring mycelium to bulk substrate. Rye, wheat, and millet are common choices.\n\n## Grain Preparation (Rye Berries)\n1. Rinse grain thoroughly, soak 12-24 hours\n2. Simmer 15-20 minutes until grain splits slightly\n3. Drain and dry on clean surface (no standing water)\n4. Add 1-2% gypsum by weight\n5. Fill jars/bags to 2/3 capacity\n\n## Sterilization\n- Pressure cook at 15 PSI for 90 minutes\n- Allow to cool naturally (do not rapid-cool)\n- Shake jars when cool to break up clumps\n\n## Inoculation\n- 1-2cc liquid culture per quart jar\n- Or 1 tablespoon grain-to-grain transfer\n- Incubate at 72-75°F in dark\n- Shake at 30% colonization",
    equipment_needed: ["Pressure cooker", "Mason jars or spawn bags", "Rye berries or wheat", "Gypsum", "Thermometer"],
    safety_warnings: ["Pressure cookers can cause burns", "Never force-open pressurized vessels"],
    success_rate: 92.0,
    is_premium: false,
    view_count: 198,
  },
]

export default function SOPsPage() {
  const [sops, setSops] = useState<any[]>([])
  const [filteredSops, setFilteredSops] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadSOPs()
  }, [])

  useEffect(() => {
    filterSOPs()
  }, [searchQuery, selectedCategory, selectedDifficulty, sops])

  async function loadSOPs() {
    try {
      const { data, error } = await supabase
        .from("sop_templates")
        .select("*")
        .order("category", { ascending: true })
        .order("title", { ascending: true })

      if (error) throw error
      if (data && data.length > 0) {
        setSops(data)
        setFilteredSops(data)
      } else {
        setSops(FALLBACK_SOPS)
        setFilteredSops(FALLBACK_SOPS)
      }
    } catch (error) {
      console.error("[CroweLogic] Error loading SOPs, using fallback:", error)
      setSops(FALLBACK_SOPS)
      setFilteredSops(FALLBACK_SOPS)
    } finally {
      setLoading(false)
    }
  }

  function filterSOPs() {
    let filtered = sops

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((s) => s.difficulty_level?.toLowerCase() === selectedDifficulty.toLowerCase())
    }

    setFilteredSops(filtered)
  }

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "intermediate":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "advanced":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "expert":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-accent/10 text-accent border-accent/20"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "fundamentals":
        return BookOpen
      case "substrate":
        return TrendingUp
      case "environment":
        return AlertTriangle
      default:
        return CheckCircle2
    }
  }

  const categories = Array.from(new Set(sops.map((s) => s.category)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading SOPs library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-foreground">Professional Cultivation Protocols</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Standard Operating Procedures</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Battle-tested SOPs from Southwest Mushrooms. Proven protocols for sterile technique, substrate prep,
            environmental control, and quality assurance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total SOPs</p>
                  <p className="text-3xl font-bold text-foreground">{sops.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-card to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Beginner Friendly</p>
                  <p className="text-3xl font-bold text-foreground">
                    {sops.filter((s) => s.difficulty_level?.toLowerCase() === "beginner").length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-3xl font-bold text-foreground">{categories.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Premium Content</p>
                  <p className="text-3xl font-bold text-foreground">{sops.filter((s) => s.is_premium).length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search SOPs by title, category, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.slice(0, 3).map((cat) => (
                    <TabsTrigger key={cat} value={cat}>
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty} className="flex-1">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Levels</TabsTrigger>
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* SOPs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSops.map((sop) => {
            const CategoryIcon = getCategoryIcon(sop.category)
            return (
              <Card
                key={sop.id}
                className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="mb-2">
                          {sop.category}
                        </Badge>
                      </div>
                    </div>
                    {sop.is_premium && (
                      <Badge className="bg-gradient-to-r from-accent to-purple-500 text-white border-0">Premium</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{sop.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getDifficultyColor(sop.difficulty_level)} variant="outline">
                      {sop.difficulty_level}
                    </Badge>
                    {sop.estimated_time && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {sop.estimated_time}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {sop.content.split("\n\n")[1] || sop.content.substring(0, 150)}...
                  </p>

                  {/* Success Metrics */}
                  {sop.success_metrics && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Success Metrics</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(sop.success_metrics)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <span key={key} className="text-xs text-muted-foreground">
                              {key}: {String(value)}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* View Stats */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {sop.view_count || 0} views
                    </div>
                    {sop.video_url && (
                      <Badge variant="outline" className="gap-1">
                        <Play className="w-3 h-3" />
                        Video
                      </Badge>
                    )}
                  </div>

                  <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
                    <Link href={`/sops/${sop.id}`}>
                      <BookOpen className="w-4 h-4" />
                      View Full SOP
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSops.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No SOPs found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}

        {/* Bottom CTA */}
        <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Need Custom SOPs?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Work with Michael Crowe to develop tailored standard operating procedures for your specific facility,
              species, and production goals.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <a href="mailto:michael@crowelogic.com">Contact for Custom SOPs</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
