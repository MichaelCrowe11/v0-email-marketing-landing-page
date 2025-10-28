/**
 * Intelligent AI Model Router
 *
 * Automatically selects the best model based on:
 * - Query complexity
 * - Task type (reasoning, coding, general chat, etc.)
 * - User budget/tier
 * - Performance requirements
 * - Model health status
 */

import { AVAILABLE_MODELS, getModelById, type ModelOption } from "@/lib/ai-models"
import { getModelHealth } from "./fallback"

/**
 * Task classification
 */
export type TaskType =
  | "simple-chat"
  | "complex-reasoning"
  | "code-generation"
  | "code-review"
  | "scientific-research"
  | "creative-writing"
  | "data-analysis"
  | "summarization"
  | "translation"
  | "vision"
  | "general"

/**
 * Routing preferences
 */
export type RoutingPreferences = {
  maxCostPer1MTokens?: number // Budget constraint
  preferredProviders?: string[] // Preferred providers
  excludedProviders?: string[] // Excluded providers
  prioritizeSpeed?: boolean // Speed vs. quality tradeoff
  requireCapabilities?: string[] // Must-have capabilities
}

/**
 * Model recommendation with score
 */
export type ModelRecommendation = {
  modelId: string
  model: ModelOption
  score: number
  reasoning: string[]
}

/**
 * Analyze query complexity
 */
export function analyzeQueryComplexity(prompt: string): {
  complexity: "low" | "medium" | "high"
  score: number
  indicators: string[]
} {
  const indicators: string[] = []
  let score = 0

  const promptLower = prompt.toLowerCase()

  // Length-based complexity
  if (prompt.length > 1000) {
    score += 3
    indicators.push("Long query (>1000 chars)")
  } else if (prompt.length > 500) {
    score += 2
    indicators.push("Medium query (500-1000 chars)")
  } else {
    score += 1
    indicators.push("Short query (<500 chars)")
  }

  // Reasoning indicators
  const reasoningKeywords = [
    "analyze",
    "compare",
    "evaluate",
    "explain why",
    "reason",
    "deduce",
    "infer",
    "prove",
    "argue",
    "justify",
  ]
  const reasoningCount = reasoningKeywords.filter((kw) => promptLower.includes(kw)).length
  if (reasoningCount >= 2) {
    score += 3
    indicators.push("Multiple reasoning keywords")
  } else if (reasoningCount === 1) {
    score += 2
    indicators.push("Single reasoning keyword")
  }

  // Technical/code indicators
  const codeKeywords = ["code", "function", "class", "debug", "algorithm", "implement", "refactor", "optimize"]
  const codeCount = codeKeywords.filter((kw) => promptLower.includes(kw)).length
  if (codeCount >= 2) {
    score += 2
    indicators.push("Code-related query")
  }

  // Scientific/research indicators
  const scienceKeywords = ["research", "study", "hypothesis", "experiment", "data", "analysis", "theory"]
  const scienceCount = scienceKeywords.filter((kw) => promptLower.includes(kw)).length
  if (scienceCount >= 2) {
    score += 2
    indicators.push("Scientific/research query")
  }

  // Multi-step indicators
  const multiStepKeywords = ["first", "then", "next", "finally", "step", "process", "workflow"]
  const multiStepCount = multiStepKeywords.filter((kw) => promptLower.includes(kw)).length
  if (multiStepCount >= 2) {
    score += 2
    indicators.push("Multi-step process")
  }

  // Question complexity
  const questionWords = ["what", "why", "how", "when", "where", "who", "which"]
  const questionCount = questionWords.filter((kw) => promptLower.includes(kw)).length
  if (questionCount >= 3) {
    score += 2
    indicators.push("Multiple questions")
  }

  // Determine complexity level
  let complexity: "low" | "medium" | "high"
  if (score <= 3) {
    complexity = "low"
  } else if (score <= 7) {
    complexity = "medium"
  } else {
    complexity = "high"
  }

  return { complexity, score, indicators }
}

/**
 * Classify task type from prompt
 */
export function classifyTask(prompt: string): TaskType {
  const promptLower = prompt.toLowerCase()

  // Code-related
  if (
    promptLower.includes("code") ||
    promptLower.includes("function") ||
    promptLower.includes("debug") ||
    promptLower.includes("implement")
  ) {
    if (promptLower.includes("review") || promptLower.includes("improve") || promptLower.includes("fix")) {
      return "code-review"
    }
    return "code-generation"
  }

  // Reasoning
  if (
    promptLower.includes("reason") ||
    promptLower.includes("analyze") ||
    promptLower.includes("prove") ||
    promptLower.includes("solve")
  ) {
    return "complex-reasoning"
  }

  // Scientific research
  if (
    promptLower.includes("research") ||
    promptLower.includes("study") ||
    promptLower.includes("scientific") ||
    promptLower.includes("experiment")
  ) {
    return "scientific-research"
  }

  // Data analysis
  if (
    promptLower.includes("data") ||
    promptLower.includes("statistics") ||
    promptLower.includes("chart") ||
    promptLower.includes("graph")
  ) {
    return "data-analysis"
  }

  // Summarization
  if (
    promptLower.includes("summarize") ||
    promptLower.includes("summary") ||
    promptLower.includes("tldr") ||
    promptLower.includes("brief")
  ) {
    return "summarization"
  }

  // Translation
  if (promptLower.includes("translate") || promptLower.includes("translation")) {
    return "translation"
  }

  // Creative writing
  if (
    promptLower.includes("write a story") ||
    promptLower.includes("poem") ||
    promptLower.includes("creative") ||
    promptLower.includes("fiction")
  ) {
    return "creative-writing"
  }

  // Vision (if mentions image/photo)
  if (promptLower.includes("image") || promptLower.includes("photo") || promptLower.includes("picture")) {
    return "vision"
  }

  // Simple chat
  if (
    promptLower.length < 100 &&
    (promptLower.includes("hello") ||
      promptLower.includes("hi") ||
      promptLower.includes("thanks") ||
      promptLower.includes("ok"))
  ) {
    return "simple-chat"
  }

  return "general"
}

/**
 * Get recommended models for task type
 */
export function getRecommendedModelsForTask(taskType: TaskType): string[] {
  const recommendations: Record<TaskType, string[]> = {
    "simple-chat": [
      "crowelogic/mini",
      "openai/gpt-4o-mini",
      "anthropic/claude-3-5-haiku-20241022",
      "google/gemini-1.5-flash",
    ],
    "complex-reasoning": [
      "openai/o1",
      "openai/o3-mini",
      "anthropic/claude-3-5-sonnet-20241022",
      "openai/gpt-4o",
      "google/gemini-1.5-pro-latest",
    ],
    "code-generation": [
      "openai/gpt-4o",
      "anthropic/claude-3-5-sonnet-20241022",
      "deepseek/deepseek-coder",
      "openai/gpt-4o-mini",
    ],
    "code-review": [
      "anthropic/claude-3-5-sonnet-20241022",
      "openai/gpt-4o",
      "openai/o1",
      "deepseek/deepseek-coder",
    ],
    "scientific-research": [
      "crowelogic/mini",
      "openai/o1",
      "anthropic/claude-3-5-sonnet-20241022",
      "google/gemini-1.5-pro-latest",
      "openai/gpt-4o",
    ],
    "creative-writing": [
      "anthropic/claude-3-5-sonnet-20241022",
      "openai/gpt-4o",
      "google/gemini-1.5-pro-latest",
      "anthropic/claude-3-opus-20240229",
    ],
    "data-analysis": [
      "openai/gpt-4o",
      "anthropic/claude-3-5-sonnet-20241022",
      "google/gemini-1.5-pro-latest",
    ],
    summarization: [
      "anthropic/claude-3-5-haiku-20241022",
      "openai/gpt-4o-mini",
      "google/gemini-1.5-flash",
      "crowelogic/mini",
    ],
    translation: ["openai/gpt-4o", "google/gemini-1.5-pro-latest", "openai/gpt-4o-mini"],
    vision: [
      "openai/gpt-4o",
      "google/gemini-2.0-flash-exp",
      "anthropic/claude-3-5-sonnet-20241022",
      "meta-llama/llama-3.2-90b-vision-instruct",
    ],
    general: ["openai/gpt-4o-mini", "anthropic/claude-3-5-haiku-20241022", "google/gemini-1.5-flash"],
  }

  return recommendations[taskType] || recommendations.general
}

/**
 * Score model for given requirements
 */
async function scoreModel(
  model: ModelOption,
  complexity: "low" | "medium" | "high",
  taskType: TaskType,
  preferences: RoutingPreferences,
): Promise<{ score: number; reasoning: string[] }> {
  let score = 100
  const reasoning: string[] = []

  // Check budget constraints
  if (preferences.maxCostPer1MTokens && model.costPer1MInputTokens > preferences.maxCostPer1MTokens) {
    score -= 50
    reasoning.push(`Exceeds budget (${model.costPer1MInputTokens} > ${preferences.maxCostPer1MTokens})`)
  }

  // Provider preferences
  if (preferences.preferredProviders && preferences.preferredProviders.includes(model.provider)) {
    score += 20
    reasoning.push(`Preferred provider: ${model.provider}`)
  }

  if (preferences.excludedProviders && preferences.excludedProviders.includes(model.provider)) {
    score -= 100
    reasoning.push(`Excluded provider: ${model.provider}`)
  }

  // Required capabilities
  if (preferences.requireCapabilities) {
    const hasAll = preferences.requireCapabilities.every((cap) => model.capabilities.includes(cap))
    if (!hasAll) {
      score -= 100
      reasoning.push("Missing required capabilities")
    }
  }

  // Task-specific scoring
  const recommendedModels = getRecommendedModelsForTask(taskType)
  const taskRank = recommendedModels.indexOf(model.id)
  if (taskRank >= 0) {
    score += 30 - taskRank * 5 // Higher score for earlier recommendations
    reasoning.push(`Recommended for ${taskType} (rank ${taskRank + 1})`)
  }

  // Complexity matching
  if (complexity === "high" && model.badge === "smartest") {
    score += 20
    reasoning.push("High complexity + smartest model")
  } else if (complexity === "low" && model.badge === "fastest") {
    score += 20
    reasoning.push("Low complexity + fastest model")
  }

  // Speed priority
  if (preferences.prioritizeSpeed) {
    if (model.badge === "fastest") {
      score += 30
      reasoning.push("Prioritizing speed")
    }
    if (model.contextWindow < 50000) {
      score += 10
      reasoning.push("Smaller context = faster")
    }
  }

  // Cost efficiency for low complexity
  if (complexity === "low" && model.costPer1MInputTokens < 1.0) {
    score += 15
    reasoning.push("Cost-efficient for simple task")
  }

  // Check model health
  const health = await getModelHealth(model.id)
  if (health.status === "down") {
    score -= 200
    reasoning.push("Model is currently down")
  } else if (health.status === "degraded") {
    score -= 50
    reasoning.push("Model performance degraded")
  } else if (health.status === "healthy") {
    score += 10
    reasoning.push("Model is healthy")
  }

  return { score, reasoning }
}

/**
 * Route query to best model
 */
export async function routeToOptimalModel(
  prompt: string,
  preferences: RoutingPreferences = {},
): Promise<ModelRecommendation> {
  // Analyze query
  const complexity = analyzeQueryComplexity(prompt)
  const taskType = classifyTask(prompt)

  console.log(`[Router] Complexity: ${complexity.complexity}, Task: ${taskType}`)

  // Get candidate models
  const recommendedIds = getRecommendedModelsForTask(taskType)
  let candidates = recommendedIds
    .map((id) => getModelById(id))
    .filter((m): m is ModelOption => m !== undefined)

  // If no recommendations, use all models
  if (candidates.length === 0) {
    candidates = AVAILABLE_MODELS
  }

  // Score each candidate
  const scoredModels = await Promise.all(
    candidates.map(async (model) => {
      const { score, reasoning } = await scoreModel(model, complexity.complexity, taskType, preferences)
      return {
        modelId: model.id,
        model,
        score,
        reasoning,
      }
    }),
  )

  // Sort by score
  scoredModels.sort((a, b) => b.score - a.score)

  // Return top recommendation
  const best = scoredModels[0]

  console.log(`[Router] Selected: ${best.modelId} (score: ${best.score})`)
  console.log(`[Router] Reasoning:`, best.reasoning)

  return best
}

/**
 * Get multiple model recommendations with scores
 */
export async function getModelRecommendations(
  prompt: string,
  preferences: RoutingPreferences = {},
  topN = 3,
): Promise<ModelRecommendation[]> {
  const complexity = analyzeQueryComplexity(prompt)
  const taskType = classifyTask(prompt)

  const recommendedIds = getRecommendedModelsForTask(taskType)
  let candidates = recommendedIds
    .map((id) => getModelById(id))
    .filter((m): m is ModelOption => m !== undefined)

  if (candidates.length === 0) {
    candidates = AVAILABLE_MODELS
  }

  const scoredModels = await Promise.all(
    candidates.map(async (model) => {
      const { score, reasoning } = await scoreModel(model, complexity.complexity, taskType, preferences)
      return {
        modelId: model.id,
        model,
        score,
        reasoning,
      }
    }),
  )

  scoredModels.sort((a, b) => b.score - a.score)

  return scoredModels.slice(0, topN)
}

/**
 * Simple router for quick model selection
 */
export async function quickRoute(prompt: string): Promise<string> {
  const recommendation = await routeToOptimalModel(prompt)
  return recommendation.modelId
}
