export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    // If no coordinates provided, return a prompt for location
    if (!lat || !lon) {
      return Response.json({
        temp: null,
        condition: "Unknown",
        location: "Enable location",
        needsLocation: true,
      })
    }

    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey || apiKey === "demo" || apiKey.length < 20) {
      return Response.json({
        temp: Math.floor(Math.random() * 30) + 60,
        condition: ["Sunny", "Cloudy", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 4)],
        location: "Demo Mode",
        needsLocation: false,
      })
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    const response = await fetch(weatherUrl, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    })

    if (!response.ok) {
      console.error("[v0] Weather API error:", response.status, await response.text())
      return Response.json({
        temp: Math.floor(Math.random() * 30) + 60,
        condition: ["Sunny", "Cloudy", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 4)],
        location: "Demo Mode",
        needsLocation: false,
      })
    }

    const data = await response.json()

    return Response.json({
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      location: data.name,
      needsLocation: false,
    })
  } catch (error) {
    console.error("[v0] Weather API error:", error)
    return Response.json({
      temp: Math.floor(Math.random() * 30) + 60,
      condition: ["Sunny", "Cloudy", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 4)],
      location: "Demo Mode",
      needsLocation: false,
    })
  }
}
