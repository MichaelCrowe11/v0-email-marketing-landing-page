// Azure auth - sign in
import { type NextRequest, NextResponse } from "next/server"
import { signInWithPassword } from "@/lib/azure/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await signInWithPassword(email, password)

    if (error || !data.user) {
      return NextResponse.json({ user: null, session: null, error: error?.message || "Sign in failed" })
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("crowe-session", data.session!.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json({ user: data.user, session: data.session, error: null })
  } catch (error) {
    return NextResponse.json({ user: null, session: null, error: (error as Error).message })
  }
}
