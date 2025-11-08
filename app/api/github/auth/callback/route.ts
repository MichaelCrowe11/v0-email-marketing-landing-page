import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.redirect(new URL("/crowe-code?error=no_code", request.url))
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/github/auth/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error("[v0] GitHub OAuth error:", tokenData.error_description)
      return NextResponse.redirect(new URL("/crowe-code?error=oauth_failed", request.url))
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in?redirect=/crowe-code", request.url))
    }

    const { error: dbError } = await supabase.from("github_tokens").upsert(
      {
        user_id: user.id,
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      },
      { onConflict: "user_id" },
    )

    if (dbError) {
      console.error("[v0] Failed to store GitHub token:", dbError)
      return NextResponse.redirect(new URL("/crowe-code?error=db_failed", request.url))
    }

    return NextResponse.redirect(new URL("/crowe-code?github=connected", request.url))
  } catch (error) {
    console.error("[v0] GitHub OAuth callback error:", error)
    return NextResponse.redirect(new URL("/crowe-code?error=server_error", request.url))
  }
}
