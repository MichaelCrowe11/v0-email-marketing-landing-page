import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/resend"
import { getWelcomeEmailHTML } from "@/lib/email-templates"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    await sendEmail({
      to: email,
      subject: "Welcome to Crowe Logic!",
      html: getWelcomeEmailHTML({ name }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Welcome email error:", error)
    return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 })
  }
}
