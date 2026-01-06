import { NextResponse } from "next/server"

// Fallback contamination data for when database is not available
const FALLBACK_CONTAMINANTS = [
  {
    id: "1",
    contaminant_name: "Trichoderma (Green Mold)",
    visual_description:
      "Aggressive green mold that starts white then turns bright green. One of the most common and aggressive contaminants in mushroom cultivation.",
    severity_level: "critical",
    color_indicators: ["White (early)", "Bright Green", "Dark Green (mature)"],
    growth_pattern:
      "Starts as white fuzzy patches, rapidly turns green within 24-48 hours. Spreads aggressively across substrate surface.",
    smell_indicators: "Sweet, earthy, coconut-like smell when mature",
    common_causes: [
      "Incomplete sterilization of substrate",
      "Contaminated spawn or culture",
      "Poor air filtration in fruiting room",
      "Working in unclean conditions",
      "Cross-contamination from infected blocks",
    ],
    prevention_methods: [
      "Ensure complete sterilization (15 PSI for 2.5 hours minimum)",
      "Use HEPA filtration in all work areas",
      "Maintain strict sterile technique",
      "Quarantine new spawn before use",
      "Regular cleaning and sanitization protocols",
    ],
    treatment_options: [
      "Immediate isolation - remove from grow area",
      "Do NOT open contaminated bags indoors",
      "Dispose of in sealed bags away from grow facility",
      "Deep clean affected area with 10% bleach solution",
      "Review and improve sterilization protocols",
    ],
  },
  {
    id: "2",
    contaminant_name: "Cobweb Mold (Dactylium)",
    visual_description: "Wispy, gray, cotton-like growth that spreads rapidly across the surface.",
    severity_level: "high",
    color_indicators: ["Gray", "White-gray", "Wispy appearance"],
    growth_pattern: "Extremely fast spreading, wispy cobweb-like strands. Can cover entire surface in 24 hours.",
    smell_indicators: "Musty, basement-like odor",
    common_causes: [
      "High humidity with poor air circulation",
      "Stagnant air in fruiting chamber",
      "Contaminated casing layer",
    ],
    prevention_methods: ["Maintain proper FAE", "Keep humidity below 95%", "Use clean casing materials"],
    treatment_options: [
      "Increase fresh air exchange",
      "Reduce humidity to 80-85%",
      "Spot treat with 3% hydrogen peroxide",
    ],
  },
  {
    id: "3",
    contaminant_name: "Black Mold (Aspergillus niger)",
    visual_description: "Dark black powdery mold. Extremely dangerous - produces mycotoxins.",
    severity_level: "critical",
    color_indicators: ["Black", "Dark brown-black", "Powdery texture"],
    growth_pattern: "Starts as small dark spots, develops powdery black spore masses.",
    smell_indicators: "Strong musty, chemical odor",
    common_causes: ["Contaminated substrate", "High temperature", "Poor sterilization"],
    prevention_methods: ["Strict sterilization", "HEPA filtration", "Temperature control"],
    treatment_options: ["WEAR RESPIRATORY PROTECTION", "Seal and remove immediately", "Do not attempt to save"],
  },
]

export async function GET() {
  try {
    // Check if Azure SQL is configured
    const connectionString = process.env.AZURE_SQL_CONNECTION_STRING

    if (!connectionString) {
      // Return fallback data if no database configured
      return NextResponse.json(FALLBACK_CONTAMINANTS)
    }

    // TODO: Implement Azure SQL query when database is configured
    // For now, return fallback data
    return NextResponse.json(FALLBACK_CONTAMINANTS)
  } catch (error) {
    console.error("[API] Error fetching contamination guide:", error)
    return NextResponse.json(FALLBACK_CONTAMINANTS)
  }
}
