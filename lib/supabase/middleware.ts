import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase credentials are not available, skip auth check
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase credentials not found in middleware, skipping auth check")
    return supabaseResponse
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  try {
    const authToken = request.cookies.get("sb-access-token")?.value
    if (authToken) {
      const refreshToken = request.cookies.get("sb-refresh-token")?.value
      await supabase.auth.setSession({
        access_token: authToken,
        refresh_token: refreshToken || "",
      })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const protectedPaths = [
      "/dashboard",
      "/profile",
      "/projects",
      "/documents/new",
      "/forum/new",
      "/analytics",
      "/crowe-vision",
      "/video-studio",
      "/sops", // Now protected
      "/docs", // Now protected
    ]

    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (!user && isProtectedPath) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error("[v0] Error in middleware auth check:", error)
    // Continue without blocking the request
  }

  return supabaseResponse
}
