"use client"

import { createClient } from '@/lib/azure/client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Thermometer, Droplets, TrendingUp, DollarSign, Beaker, ChefHat } from "lucide-react"

export const dynamic = 'force-dynamic'

const FALLBACK_SPECIES = [
  {
    id: "1", common_name: "Blue Oyster", scientific_name: "Pleurotus ostreatus var. columbinus",
    difficulty_level: "beginner", optimal_temp_min: 55, optimal_temp_max: 75, optimal_humidity_min: 85, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "12-18", fruiting_days: "5-7" },
    market_value: "medium", yield_expectations: { biological_efficiency: "100-150% BE" },
    culinary_notes: "Mild, slightly anise flavor. Excellent sautéed, in soups, or as a meat substitute.",
    medicinal_properties: "Rich in antioxidants, supports immune function and cholesterol management.",
  },
  {
    id: "2", common_name: "Lion's Mane", scientific_name: "Hericium erinaceus",
    difficulty_level: "intermediate", optimal_temp_min: 60, optimal_temp_max: 75, optimal_humidity_min: 90, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "14-21", fruiting_days: "7-10" },
    market_value: "very high", yield_expectations: { biological_efficiency: "50-80% BE" },
    culinary_notes: "Lobster/crab-like flavor and texture. Premium gourmet mushroom.",
    medicinal_properties: "Nerve growth factor (NGF) stimulation, neuroprotective, cognitive support.",
  },
  {
    id: "3", common_name: "Pink Oyster", scientific_name: "Pleurotus djamor",
    difficulty_level: "beginner", optimal_temp_min: 65, optimal_temp_max: 85, optimal_humidity_min: 85, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "10-14", fruiting_days: "4-6" },
    market_value: "high", yield_expectations: { biological_efficiency: "100-150% BE" },
    culinary_notes: "Bacon-like flavor when cooked at high heat. Vibrant pink color fades when cooked.",
    medicinal_properties: "Contains lovastatin, supports cardiovascular health.",
  },
  {
    id: "4", common_name: "King Oyster", scientific_name: "Pleurotus eryngii",
    difficulty_level: "intermediate", optimal_temp_min: 55, optimal_temp_max: 65, optimal_humidity_min: 85, optimal_humidity_max: 90,
    growth_characteristics: { colonization_days: "18-25", fruiting_days: "7-14" },
    market_value: "very high", yield_expectations: { biological_efficiency: "60-100% BE" },
    culinary_notes: "Thick meaty stem, scallop-like texture. Best seared or grilled.",
    medicinal_properties: "Rich in ergothioneine antioxidant, supports immune health.",
  },
  {
    id: "5", common_name: "Shiitake", scientific_name: "Lentinula edodes",
    difficulty_level: "intermediate", optimal_temp_min: 60, optimal_temp_max: 75, optimal_humidity_min: 80, optimal_humidity_max: 90,
    growth_characteristics: { colonization_days: "30-60", fruiting_days: "7-10" },
    market_value: "high", yield_expectations: { biological_efficiency: "75-125% BE" },
    culinary_notes: "Rich umami flavor. Excellent dried, in stir-fries, soups, and sauces.",
    medicinal_properties: "Lentinan (beta-glucan), immune modulation, anti-tumor properties.",
  },
  {
    id: "6", common_name: "Reishi", scientific_name: "Ganoderma lucidum",
    difficulty_level: "advanced", optimal_temp_min: 70, optimal_temp_max: 80, optimal_humidity_min: 90, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "30-60", fruiting_days: "60-90" },
    market_value: "very high", yield_expectations: { biological_efficiency: "15-30% BE" },
    culinary_notes: "Not culinary - medicinal only. Used for teas, tinctures, and extracts.",
    medicinal_properties: "Triterpenes and polysaccharides. Adaptogenic, immune-modulating, anti-inflammatory.",
  },
  {
    id: "7", common_name: "Maitake", scientific_name: "Grifola frondosa",
    difficulty_level: "advanced", optimal_temp_min: 55, optimal_temp_max: 65, optimal_humidity_min: 85, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "30-60", fruiting_days: "14-21" },
    market_value: "very high", yield_expectations: { biological_efficiency: "30-60% BE" },
    culinary_notes: "Rich, earthy, woodsy flavor. Excellent roasted, grilled, or in risottos.",
    medicinal_properties: "D-fraction beta-glucans, blood sugar regulation, immune support.",
  },
  {
    id: "8", common_name: "Turkey Tail", scientific_name: "Trametes versicolor",
    difficulty_level: "beginner", optimal_temp_min: 65, optimal_temp_max: 75, optimal_humidity_min: 85, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "14-28", fruiting_days: "30-60" },
    market_value: "high", yield_expectations: { biological_efficiency: "20-40% BE" },
    culinary_notes: "Not culinary - medicinal only. Used for teas, tinctures, and extracts.",
    medicinal_properties: "PSK and PSP polysaccharides. Extensively researched for immune support and cancer adjunct therapy.",
  },
  {
    id: "9", common_name: "Golden Oyster", scientific_name: "Pleurotus citrinopileatus",
    difficulty_level: "beginner", optimal_temp_min: 65, optimal_temp_max: 85, optimal_humidity_min: 85, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "10-14", fruiting_days: "4-6" },
    market_value: "high", yield_expectations: { biological_efficiency: "80-120% BE" },
    culinary_notes: "Delicate, slightly nutty, cashew-like flavor. Beautiful golden clusters.",
    medicinal_properties: "Antioxidant properties, supports immune function.",
  },
  {
    id: "10", common_name: "Cordyceps", scientific_name: "Cordyceps militaris",
    difficulty_level: "expert", optimal_temp_min: 60, optimal_temp_max: 68, optimal_humidity_min: 90, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "14-21", fruiting_days: "45-60" },
    market_value: "very high", yield_expectations: { biological_efficiency: "10-25% BE" },
    culinary_notes: "Mild, slightly sweet. Used in teas, broths, and supplements.",
    medicinal_properties: "Cordycepin production, ATP enhancement, athletic performance, respiratory support.",
  },
  {
    id: "11", common_name: "Chestnut", scientific_name: "Pholiota adiposa",
    difficulty_level: "intermediate", optimal_temp_min: 55, optimal_temp_max: 65, optimal_humidity_min: 85, optimal_humidity_max: 90,
    growth_characteristics: { colonization_days: "14-21", fruiting_days: "7-10" },
    market_value: "high", yield_expectations: { biological_efficiency: "50-80% BE" },
    culinary_notes: "Nutty, rich flavor with crunchy cap. Popular in Asian cuisine.",
    medicinal_properties: "Contains ergosterol, precursor to Vitamin D2.",
  },
  {
    id: "12", common_name: "Pioppino", scientific_name: "Agrocybe aegerita",
    difficulty_level: "advanced", optimal_temp_min: 55, optimal_temp_max: 65, optimal_humidity_min: 85, optimal_humidity_max: 95,
    growth_characteristics: { colonization_days: "21-35", fruiting_days: "10-14" },
    market_value: "very high", yield_expectations: { biological_efficiency: "40-70% BE" },
    culinary_notes: "Crunchy texture, peppery nutty flavor. Holds up well in cooking. Chef favorite.",
    medicinal_properties: "Antioxidant and anti-inflammatory properties.",
  },
]

export default function SpeciesLibraryPage() {
  const [species, setSpecies] = useState<any[]>([])
  const [filteredSpecies, setFilteredSpecies] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadSpecies()
  }, [])

  useEffect(() => {
    filterSpecies()
  }, [searchQuery, selectedDifficulty, species])

  async function loadSpecies() {
    try {
      const { data, error } = await supabase
        .from("species_library")
        .select("*")
        .order("common_name", { ascending: true })

      if (error) throw error
      if (data && data.length > 0) {
        setSpecies(data)
        setFilteredSpecies(data)
      } else {
        setSpecies(FALLBACK_SPECIES)
        setFilteredSpecies(FALLBACK_SPECIES)
      }
    } catch (error) {
      console.error("[CroweLogic] Error loading species, using fallback:", error)
      setSpecies(FALLBACK_SPECIES)
      setFilteredSpecies(FALLBACK_SPECIES)
    } finally {
      setLoading(false)
    }
  }

  function filterSpecies() {
    let filtered = species

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.common_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((s) => s.difficulty_level === selectedDifficulty)
    }

    setFilteredSpecies(filtered)
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
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

  const getMarketValueColor = (value: string) => {
    switch (value) {
      case "very high":
        return "text-green-600 dark:text-green-400"
      case "high":
        return "text-blue-600 dark:text-blue-400"
      case "medium":
        return "text-accent"
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading species library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Mushroom Species Library</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive cultivation data for 50+ species, curated from Michael Crowe's 18+ years of expertise
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by common or scientific name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty} className="w-full md:w-auto">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="expert">Expert</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Species Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpecies.map((sp) => (
            <Card
              key={sp.id}
              className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl">{sp.common_name}</CardTitle>
                    <CardDescription className="italic">{sp.scientific_name}</CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(sp.difficulty_level)}>{sp.difficulty_level}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Environmental Requirements */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Optimal Conditions</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span className="text-foreground">
                        {sp.optimal_temp_min}-{sp.optimal_temp_max}°F
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-foreground">
                        {sp.optimal_humidity_min}-{sp.optimal_humidity_max}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Growth Characteristics */}
                {sp.growth_characteristics && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Growth Timeline</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <p className="text-muted-foreground">Colonization</p>
                        <p className="font-medium text-foreground">
                          {sp.growth_characteristics.colonization_days} days
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-accent/10">
                        <p className="text-muted-foreground">Fruiting</p>
                        <p className="font-medium text-foreground">{sp.growth_characteristics.fruiting_days} days</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Market Value & Yield */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className={`w-4 h-4 ${getMarketValueColor(sp.market_value)}`} />
                    <span className={`text-sm font-medium ${getMarketValueColor(sp.market_value)}`}>
                      {sp.market_value} value
                    </span>
                  </div>
                  {sp.yield_expectations && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <span className="text-sm text-muted-foreground">
                        {sp.yield_expectations.biological_efficiency}
                      </span>
                    </div>
                  )}
                </div>

                {/* Use Type */}
                <div className="flex gap-2">
                  {sp.culinary_notes &&
                    sp.culinary_notes !== "Not culinary - medicinal only. Used for teas, tinctures, and extracts." && (
                      <Badge variant="outline" className="gap-1">
                        <ChefHat className="w-3 h-3" />
                        Culinary
                      </Badge>
                    )}
                  {sp.medicinal_properties && (
                    <Badge variant="outline" className="gap-1">
                      <Beaker className="w-3 h-3" />
                      Medicinal
                    </Badge>
                  )}
                </div>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href={`/species-library/${sp.id}`}>View Full Details</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpecies.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No species found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
