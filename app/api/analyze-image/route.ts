import { NextResponse } from "next/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const image = formData.get("image") as File
    const prompt = formData.get("prompt") as string

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")
    const mimeType = image.type

    // Use Azure OpenAI or OpenAI for vision analysis
    const useAzure = process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY
    
    const apiUrl = useAzure
      ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`
      : "https://api.openai.com/v1/chat/completions"
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    
    if (useAzure) {
      headers["api-key"] = process.env.AZURE_OPENAI_API_KEY!
    } else {
      headers["Authorization"] = `Bearer ${process.env.OPENAI_API_KEY}`
    }

    const systemPrompt = `You are Crowe Logic AI, an expert mycology vision analysis system with 20+ years of commercial cultivation experience from Southwest Mushrooms.

When analyzing contamination images:
1. Identify the contaminant type (bacterial, mold, yeast, etc.)
2. Assess severity and spread pattern
3. Mark viable transfer zones if any exist
4. Provide specific remediation steps
5. Include prevention strategies

Format your response with:
- 👁️ Visual Analysis
- 🎯 Diagnosis
- ✅ Action Plan
- 🛡️ Prevention

Be specific, actionable, and reference real production experience.`

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: useAzure ? undefined : "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt || "Analyze this image for contamination and provide detailed guidance.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[Vision API Error]:", errorData)
      throw new Error(errorData.error?.message || "Vision API request failed")
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content || "Unable to analyze image"

    return NextResponse.json({
      success: true,
      analysis,
      imageSize: image.size,
      imageType: image.type,
    })
  } catch (error) {
    console.error("[Image Analysis Error]:", error)
    return NextResponse.json(
      { 
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
