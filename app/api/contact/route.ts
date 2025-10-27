import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Get current user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Store contact form submission in database
    const { error } = await supabase.from("contact_submissions").insert({
      user_id: user?.id || null,
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      location: body.location,
      facility_type: body.facilityType,
      room_count: Number.parseInt(body.roomCount) || null,
      timeline: body.timeline,
      budget: body.budget || null,
      message: body.message,
      submission_type: "enterprise_quote",
      status: "new",
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Error saving contact submission:", error)
      return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
    }

    // TODO: Send email notification to Michael@CroweLogic.com
    // This can be implemented with Resend, SendGrid, or similar service

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Contact API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
