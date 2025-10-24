export async function GET() {
  try {
    // In production, this would call a real weather API
    // For now, returning mock data
    const mockWeather = {
      temp: Math.floor(Math.random() * 30) + 60, // 60-90°F
      condition: ["Sunny", "Cloudy", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 4)],
      location: "Your Location",
    }

    return Response.json(mockWeather)
  } catch (error) {
    console.error("[v0] Weather API error:", error)
    return Response.json({ error: "Failed to fetch weather" }, { status: 500 })
  }
}
