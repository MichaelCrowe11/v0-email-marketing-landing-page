import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { model, prompt, temperature, maxTokens } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Simulate AI model response
    // In production, this would call the actual AI model API
    const simulatedResponse = await simulateModelResponse(model, prompt, temperature, maxTokens)

    return NextResponse.json({
      response: simulatedResponse,
      model,
      tokensUsed: Math.floor(prompt.length / 4 + simulatedResponse.length / 4),
    })
  } catch (error) {
    console.error("[Playground] Error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}

async function simulateModelResponse(model: string, prompt: string, temperature: number, maxTokens: number): Promise<string> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500))

  const responses: Record<string, string> = {
    "crios-substrate-analyst": `# Substrate Analysis Report

## Composition Analysis
Based on your query about substrate formulations, here's my analysis:

**Optimal Substrate Ratio for Oyster Mushrooms:**
- Hardwood sawdust: 50%
- Spent coffee grounds: 30%
- Wheat bran: 15%
- Gypsum: 5%

## Contamination Risk Assessment
- **Low Risk**: This formulation shows minimal contamination susceptibility
- **pH Level**: Target 6.0-6.5 for optimal colonization
- **Moisture Content**: 60-65% is ideal

## Recommendations
1. Pasteurize at 160-180°F for 90 minutes
2. Cool to room temperature before inoculation
3. Monitor for green mold (Trichoderma) during first 48 hours

*Analysis confidence: 94.2%*`,

    "crios-sop-agent": `# Standard Operating Procedure

## SOP-2024-001: Substrate Preparation Protocol

### Purpose
This SOP defines the standardized process for preparing oyster mushroom substrate using spent coffee grounds.

### Scope
Applies to all substrate preparation activities in the cultivation facility.

### Materials Required
- Hardwood sawdust (sterilized)
- Spent coffee grounds (dried, < 48hrs old)
- Wheat bran (food grade)
- Gypsum (calcium sulfate)
- Mixing container (clean, sanitized)

### Procedure
1. **Weighing** (15 minutes)
   - Measure ingredients according to batch size
   - Record weights in batch log

2. **Mixing** (30 minutes)
   - Combine dry ingredients
   - Add water to achieve 60-65% moisture
   - Mix thoroughly for uniform distribution

3. **Pasteurization** (2 hours)
   - Heat to 160-180°F
   - Maintain for 90 minutes
   - Cool to <80°F before use

### Quality Controls
- pH check: 6.0-6.5
- Moisture test: 60-65%
- Visual inspection for uniformity

*Document ID: SOP-2024-001*
*Revision: 1.0*
*Approved: CriOS SOP Agent*`,

    "crios-yield-forecaster": `# Yield Forecast Analysis

## Historical Data Summary
Analyzing environmental conditions and past harvest data...

## Predicted Yield
**Estimated Harvest**: 4.2 - 4.8 kg per 10kg substrate block

### Confidence Intervals
- 95% CI: 4.0 - 5.0 kg
- 68% CI: 4.2 - 4.8 kg

## Contributing Factors
1. **Temperature**: 65-70°F (optimal range)
2. **Humidity**: 85-90% (excellent)
3. **CO2 Levels**: 800-1000 ppm (good)
4. **Light Cycle**: 12h/12h (standard)

## Recommendations
- Maintain current environmental controls
- Increase air exchange if CO2 >1000 ppm
- Expected first flush in 7-10 days

*Forecast accuracy: 89.6% based on 847 historical datasets*`,

    "crios-genetics-advisor": `# Genetic Analysis & Strain Recommendation

## Species Selection
Based on your cultivation parameters:

**Recommended Species**: Pleurotus ostreatus (Pearl Oyster)
**Strain**: PoHu-01 (High-yield hybrid)

## Genetic Characteristics
- Growth rate: Fast (7-10 day colonization)
- Contamination resistance: High
- Fruiting temperature: 60-75°F
- Yield potential: 25-30% biological efficiency

## Alternative Strains
1. **PoHu-02**: Cold-tolerant variant (50-65°F)
2. **PoHu-03**: Heat-resistant (70-85°F)

## Cultivation Notes
- Prefers hardwood substrates
- Responds well to supplementation
- Multiple flush capability (3-4 flushes typical)

*Genetic database: 2,400+ strain profiles analyzed*`
  }

  return responses[model] || `This is a simulated response for the ${model} model.

Your prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""}"

Temperature setting: ${temperature}
Max tokens: ${maxTokens}

In a production environment, this would call the actual AI model API and stream back real-time results.

This is demonstration data showing how the playground would work with live models.`
}
