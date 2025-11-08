import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  console.log("[v0] Auth callback hit - code exists:", !!code)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    console.log("[v0] Code exchange result - error:", error)

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        console.log("[v0] Redirecting to:", `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        console.log("[v0] Redirecting to:", `https://${forwardedHost}${next}`)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        console.log("[v0] Redirecting to:", `${origin}${next}`)
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  console.log("[v0] Auth callback failed - redirecting to error page")
  return NextResponse.redirect(`${origin}/auth/error`)
}
