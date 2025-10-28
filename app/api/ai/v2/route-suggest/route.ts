/**
 * Smart Model Routing Suggestion API
 *
 * Returns optimal model recommendations based on query analysis
 */

import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getModelRecommendations, analyzeQueryComplexity, classifyTask } from "@/lib/ai/router"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, preferences = {}, topN = 3 } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Analyze query
    const complexity = analyzeQueryComplexity(prompt)
    const taskType = classifyTask(prompt)

    // Get recommendations
    const recommendations = await getModelRecommendations(prompt, preferences, topN)

    return Response.json({
      analysis: {
        complexity: complexity.complexity,
        complexityScore: complexity.score,
        indicators: complexity.indicators,
        taskType,
      },
      recommendations: recommendations.map((rec) => ({
        modelId: rec.modelId,
        modelName: rec.model.name,
        provider: rec.model.provider,
        score: rec.score,
        reasoning: rec.reasoning,
        pricing: {
          inputCostPer1M: rec.model.costPer1MInputTokens,
          outputCostPer1M: rec.model.costPer1MOutputTokens,
        },
        capabilities: rec.model.capabilities,
        contextWindow: rec.model.contextWindow,
      })),
    })
  } catch (error: any) {
    console.error("[AI v2] Route suggest error:", error)
    return Response.json(
      {
        error: "Failed to generate recommendations",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
