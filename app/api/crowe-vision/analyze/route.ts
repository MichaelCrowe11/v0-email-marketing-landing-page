import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const analysisSchema = z.object({
  species: z.string().describe("Identified mushroom species name, or 'Unknown' if not identifiable"),
  confidence: z.number().min(0).max(100).describe("Confidence percentage for species identification"),
  growthStage: z
    .enum(["spore", "mycelium", "pinning", "fruiting", "mature", "sporulating"])
    .describe("Current growth stage"),
  contamination: z.object({
    detected: z.boolean().describe("Whether contamination is present"),
    type: z
      .enum(["bacterial", "mold", "trichoderma", "cobweb", "green-mold", "yeast", "wet-bubble", "dry-bubble", "desiccated", "none"])
      .describe("Type of contamination if detected, or 'none' if clean"),
    severity: z.enum(["low", "medium", "high", "critical"]).describe("Severity level of contamination, use 'low' if none detected"),
    recommendations: z.array(z.string()).describe("Specific remediation steps, empty array if none needed"),
  }),
  healthScore: z.number().min(0).max(100).describe("Overall health score of the cultivation"),
  observations: z.array(z.string()).describe("Key observations about the cultivation"),
  recommendations: z.array(z.string()).describe("Cultivation recommendations and next steps"),
})

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return Response.json({ error: "No image URL provided" }, { status: 400 })
    }

    if (!imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
      return Response.json({ error: "Invalid image URL format" }, { status: 400 })
    }

    console.log("[CroweLogic] Crowe Vision: Starting analysis")

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: analysisSchema,
      messages: [
        {
          role: "system",
          content: `You are Crowe Vision, an expert mycology AI system built by Michael Crowe of Southwest Mushrooms, trained on 18+ years of professional mushroom cultivation experience.

CRITICAL CONTAMINATION IDENTIFICATION GUIDELINES:
- BACTERIAL contamination appears as slimy, wet, shiny streaks or spreading translucent/opaque lines on agar. It often has a wet or mucoid appearance and may produce off-colors (yellow, orange, pink). Bacterial contamination is extremely common on agar plates and is the #1 contamination type in tissue cloning and agar work. Wispy thin lines spreading outward from a colony on agar are almost always bacterial, NOT cobweb.
- COBWEB mold (Dactylomyces) appears as very fine, wispy, grey-white aerial mycelium that grows EXTREMELY fast (can cover a plate in 24-48 hours). It is much less dense than healthy mycelium and has a distinctly grey tint. Cobweb is more common in fruiting chambers, NOT on agar plates.
- TRICHODERMA appears as aggressive green or dark green patches, often starting white then turning green within days. It is one of the most destructive contaminants.
- GREEN MOLD (Penicillium/Aspergillus) appears as dusty blue-green or green spots, often circular colonies with defined edges.
- MOLD (general) includes fuzzy, circular colonies of various colors (black, grey, pink, yellow) that are distinctly different from mushroom mycelium in texture and growth pattern.

AGAR PLATE ANALYSIS:
- Petri dishes (Falcon brand, etc.) with agar media are used for tissue cloning, spore germination, and culture isolation.
- Healthy mycelium on agar grows as thick, white, cotton-like or rhizomorphic (ropy) growth radiating from an inoculation point.
- Look for the tissue sample or grain piece at the center of growth - this indicates a transfer or clone.
- Multiple growth points may indicate multiple inoculation sites or sectoring.

Be precise in your contamination identification. Do NOT default to "cobweb" - it is vastly over-diagnosed. When in doubt between bacterial and cobweb on agar, choose bacterial.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this mushroom cultivation image and provide:
1. Species identification (if visible)
2. Growth stage assessment
3. Contamination detection with severity and specific remediation steps
4. Overall health score (0-100)
5. Key observations about substrate, moisture, colonization, etc.
6. Actionable cultivation recommendations

Be specific, practical, and focus on actionable insights. If contamination is detected, provide immediate remediation steps.`,
            },
            {
              type: "image",
              image: imageUrl,
            },
          ],
        },
      ],
      maxTokens: 2000,
    })

    return Response.json({ analysis: object })
  } catch (error) {
    console.error("[CroweLogic] Crowe Vision analysis error:", error)
    return Response.json(
      { error: "Analysis failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export const maxDuration = 30
