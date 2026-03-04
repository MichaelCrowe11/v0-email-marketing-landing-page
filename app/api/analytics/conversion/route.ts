import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("[CONVERSION]", {
      timestamp: new Date().toISOString(),
      source: data.utm_source || "direct",
      medium: data.utm_medium || "none",
      campaign: data.utm_campaign || "none",
      referrer: data.referrer || "none",
      page: data.page || "/thanks",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Conversion Analytics Error]", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
