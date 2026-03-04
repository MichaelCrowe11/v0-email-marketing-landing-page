import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "species" | "doc" | "sop"
  url: string
  relevance: number
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[''`]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function scoreMatch(text: string, query: string): number {
  const lower = normalize(text)
  const q = normalize(query)
  if (!lower || !q) return 0
  // Exact match
  if (lower === q) return 100
  // Starts with query
  if (lower.startsWith(q)) return 95
  // Contains query as whole word
  const wordBoundary = new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
  if (wordBoundary.test(lower)) return 90
  // Contains query as substring
  if (lower.includes(q)) return 80
  // Check individual words from query
  const words = q.split(/\s+/).filter(Boolean)
  const matched = words.filter((w) => lower.includes(w)).length
  if (matched > 0) return Math.round(60 + (matched / words.length) * 25)
  return 0
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  const results: SearchResult[] = []

  try {
    const supabase = createClient()

    // Search species_library
    const { data: species } = await supabase
      .from("species_library")
      .select("id, common_name, scientific_name, description, difficulty_level, market_value")

    for (const sp of species || []) {
      const nameScore = scoreMatch(sp.common_name || "", query)
      const sciScore = scoreMatch(sp.scientific_name || "", query)
      const descScore = scoreMatch(sp.description || "", query)
      const best = Math.max(nameScore, sciScore, descScore)
      if (best > 0) {
        results.push({
          id: `species-${sp.id}`,
          title: `${sp.common_name}${sp.scientific_name ? ` (${sp.scientific_name})` : ""}`,
          description: sp.description?.slice(0, 150) || `${sp.difficulty_level || ""} difficulty, ${sp.market_value || ""} market value`,
          type: "species",
          url: "/species-library",
          relevance: best,
        })
      }
    }

    // Search contamination_library
    const { data: contaminants } = await supabase
      .from("contamination_library")
      .select("id, contaminant_name, visual_description, severity_level")

    for (const c of contaminants || []) {
      const nameScore = scoreMatch(c.contaminant_name || "", query)
      const descScore = scoreMatch(c.visual_description || "", query)
      const best = Math.max(nameScore, descScore)
      if (best > 0) {
        results.push({
          id: `contam-${c.id}`,
          title: c.contaminant_name,
          description: c.visual_description?.slice(0, 150) || `${c.severity_level} severity contaminant`,
          type: "doc",
          url: "/contamination-guide",
          relevance: best,
        })
      }
    }

    // Search sop_templates
    const { data: sops } = await supabase
      .from("sop_templates")
      .select("id, title, description, category, difficulty_level")

    for (const sop of sops || []) {
      const titleScore = scoreMatch(sop.title || "", query)
      const descScore = scoreMatch(sop.description || "", query)
      const catScore = scoreMatch(sop.category || "", query)
      const best = Math.max(titleScore, descScore, catScore)
      if (best > 0) {
        results.push({
          id: `sop-${sop.id}`,
          title: sop.title,
          description: sop.description?.slice(0, 150) || `${sop.category} — ${sop.difficulty_level}`,
          type: "sop",
          url: "/sops",
          relevance: best,
        })
      }
    }

    // Sort by relevance descending, limit to 20
    results.sort((a, b) => b.relevance - a.relevance)
    return NextResponse.json(results.slice(0, 20))
  } catch (error) {
    console.error("[Search API] Error:", error)
    return NextResponse.json([])
  }
}
