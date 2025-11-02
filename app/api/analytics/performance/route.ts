import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Log performance metrics
    console.log("[Performance Metrics]", {
      url: data.url,
      lcp: data.metrics.lcp ? `${Math.round(data.metrics.lcp)}ms` : "N/A",
      fid: data.metrics.fid ? `${Math.round(data.metrics.fid)}ms` : "N/A",
      cls: data.metrics.cls ? data.metrics.cls.toFixed(3) : "N/A",
      fcp: data.metrics.fcp ? `${Math.round(data.metrics.fcp)}ms` : "N/A",
      ttfb: data.metrics.ttfb ? `${Math.round(data.metrics.ttfb)}ms` : "N/A",
      connection: data.connection?.effectiveType || "unknown",
    })

    // In production, you would store these metrics in a database
    // or send them to an analytics service like Vercel Analytics

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Performance Analytics Error]", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
