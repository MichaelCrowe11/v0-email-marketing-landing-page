import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.error("[Performance Issues]", {
      url: data.url,
      issues: data.issues,
      timestamp: data.timestamp,
    })

    // In production, store these in a database or send to monitoring service

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Performance Issues API Error]", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
