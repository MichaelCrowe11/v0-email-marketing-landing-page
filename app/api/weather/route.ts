import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    // Generate realistic demo data based on location if provided
    const demoConditions = ["Sunny", "Cloudy", "Partly Cloudy", "Clear", "Rainy"]
    const demoLocations = ["Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler"]

    return NextResponse.json({
      temp: Math.floor(Math.random() * 30) + 60, // 60-90°F
      condition: demoConditions[Math.floor(Math.random() * demoConditions.length)],
      location: lat && lon ? demoLocations[Math.floor(Math.random() * demoLocations.length)] : "Enable location",
      needsLocation: !lat || !lon,
    })
  } catch (error) {
    console.error("[v0] Weather API error:", error)
    return NextResponse.json({
      temp: 72,
      condition: "Sunny",
      location: "Demo Mode",
      needsLocation: false,
    })
  }
}
