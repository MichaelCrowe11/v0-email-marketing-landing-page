import { createClient } from '@/lib/azure/client'
import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Michael Crowe's cultivation knowledge base
const knowledgeBase = {
  species: {
    oyster: {
      scientificName: "Pleurotus ostreatus",
      difficulty: "Beginner",
      temperature: "55-75°F",
      humidity: "85-95%",
      substrate: "Straw, hardwood sawdust, coffee grounds",
      tips: "Most forgiving species for beginners. Grows fast and produces heavy yields.",
    },
    shiitake: {
      scientificName: "Lentinula edodes",
      difficulty: "Intermediate",
      temperature: "55-75°F",
      humidity: "80-90%",
      substrate: "Hardwood logs or supplemented sawdust",
      tips: "Requires cold shocking for fruiting. Best on oak logs.",
    },
    "lions-mane": {
      scientificName: "Hericium erinaceus",
      difficulty: "Intermediate",
      temperature: "65-75°F",
      humidity: "85-95%",
      substrate: "Hardwood sawdust with supplements",
      tips: "Sensitive to CO2. Requires excellent fresh air exchange.",
    },
  },
  contamination: {
    trichoderma: {
      color: "Green",
      cause: "Inadequate sterilization, poor air quality",
      prevention: "Pressure cook at 15 PSI for 90+ minutes, HEPA filtration",
      treatment: "Isolate immediately. Cannot be saved once established.",
    },
    cobweb: {
      color: "Gray/white wispy",
      cause: "High humidity, poor air exchange",
      prevention: "Maintain proper FAE, keep humidity below 95%",
      treatment: "Spray with hydrogen peroxide, increase air flow",
    },
  },
  techniques: {
    sterilization: "Always use pressure cooker at 15 PSI for minimum 90 minutes. Never skip this step.",
    inoculation: "Work in front of HEPA filter or in still air box. Flame sterilize tools between uses.",
    fruiting: "Trigger with temperature drop, increased humidity, and fresh air exchange.",
  },
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const category = searchParams.get("category") || "all"

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const results: any = {}

    if (category === "all" || category === "species") {
      results.species = Object.entries(knowledgeBase.species)
        .filter(
          ([key, value]) =>
            key.includes(query) ||
            value.scientificName.toLowerCase().includes(query) ||
            value.difficulty.toLowerCase().includes(query),
        )
        .map(([key, value]) => ({ id: key, ...value }))
    }

    if (category === "all" || category === "contamination") {
      results.contamination = Object.entries(knowledgeBase.contamination)
        .filter(([key, value]) => key.includes(query) || value.color.toLowerCase().includes(query))
        .map(([key, value]) => ({ id: key, ...value }))
    }

    if (category === "all" || category === "techniques") {
      results.techniques = Object.entries(knowledgeBase.techniques)
        .filter(([key, value]) => key.includes(query) || value.toLowerCase().includes(query))
        .map(([key, value]) => ({ id: key, description: value }))
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Knowledge base error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
