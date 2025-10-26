import { generateObject } from "ai"
import { z } from "zod"

// Validate Anthropic API key
function validateEnv() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[v0] ANTHROPIC_API_KEY not set for Crowe Vision")
    return false
  }
  return true
}

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
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return Response.json({ error: "No image URL provided" }, { status: 400 })
    }

    // Check environment configuration
    if (!validateEnv()) {
      console.error("[v0] Crowe Vision: ANTHROPIC_API_KEY not configured")
      return Response.json(
        {
          error: "Vision API configuration error",
          details: "ANTHROPIC_API_KEY is not configured. Please set up your Anthropic API key for image analysis.",
          help: "Add ANTHROPIC_API_KEY to your .env.local file. Get your key from https://console.anthropic.com",
          analysis: {
            species: "Configuration Required",
            confidence: 0,
            growthStage: "N/A",
            contamination: {
              detected: false,
              type: "none",
              severity: "low",
            },
            healthScore: 0,
            observations: [
              "⚠️ Image analysis is not configured",
              "ANTHROPIC_API_KEY environment variable is missing",
              "Please configure your API key to enable computer vision features"
            ],
            recommendations: [
              "Add ANTHROPIC_API_KEY to your .env.local file",
              "Get an API key from https://console.anthropic.com",
              "See SETUP.md for detailed configuration instructions",
              "Restart the development server after adding the key"
            ],
          }
        },
        { status: 200 }
      )
    }

    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return Response.json({ error: "Failed to fetch image" }, { status: 400 })
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Data = Buffer.from(imageBuffer).toString("base64")
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg"

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
              image: `data:${contentType};base64,${base64Data}`,
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
