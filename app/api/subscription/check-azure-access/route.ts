import { canAccessAzureAI } from "@/lib/subscription"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const hasAccess = await canAccessAzureAI()
    return NextResponse.json({ hasAccess })
  } catch (error) {
    console.error("Error checking Azure access:", error)
    return NextResponse.json({ hasAccess: false })
  }
}
