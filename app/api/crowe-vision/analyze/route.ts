import { generateObject } from "ai"
import { z } from "zod"

const analysisSchema = z.object({
  species: z.string().optional().describe("Identified mushroom species name"),
  confidence: z.number().min(0).max(100).describe("Confidence percentage for species identification"),
  growthStage: z
    .enum(["spore", "mycelium", "pinning", "fruiting", "mature", "sporulating"])
    .optional()
    .describe("Current growth stage"),
  contamination: z.object({
    detected: z.boolean().describe("Whether contamination is present"),
    type: z
      .enum(["bacterial", "mold", "trichoderma", "cobweb", "green-mold", "none"])
      .optional()
      .describe("Type of contamination if detected"),
    severity: z.enum(["low", "medium", "high", "critical"]).optional().describe("Severity level of contamination"),
    recommendations: z.array(z.string()).optional().describe("Specific remediation steps"),
  }),
  healthScore: z.number().min(0).max(100).describe("Overall health score of the cultivation"),
  observations: z.array(z.string()).describe("Key observations about the cultivation"),
  recommendations: z.array(z.string()).describe("Cultivation recommendations and next steps"),
})

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    // Extract base64 data and media type
    const matches = image.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      return Response.json({ error: "Invalid image format" }, { status: 400 })
    }

    const mediaType = matches[1]
    const base64Data = matches[2]

    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4.5",
      schema: analysisSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are Crowe Vision, an expert mycology AI system trained on 20+ years of professional mushroom cultivation experience. 

Analyze this mushroom cultivation image and provide:
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
              image: base64Data,
              mimeType: mediaType,
            },
          ],
        },
      ],
      maxOutputTokens: 2000,
    })

    return Response.json({ analysis: object })
  } catch (error) {
    console.error("[v0] Crowe Vision analysis error:", error)
    return Response.json({ error: "Analysis failed" }, { status: 500 })
  }
}

export const maxDuration = 30
