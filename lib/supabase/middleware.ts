import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Supabase credentials missing in middleware")
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] Middleware check - path:", request.nextUrl.pathname, "user:", !!user)

  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/projects",
    "/documents/new",
    "/forum/new",
    "/analytics",
    "/crowe-vision",
    "/video-studio",
    "/sops",
    "/crowe-code",
  ]

  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  const isAuthPath = request.nextUrl.pathname.startsWith("/auth")

  if (!user && isProtectedPath) {
    console.log("[v0] Redirecting to login - no user for protected path")
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthPath && !request.nextUrl.pathname.includes("/auth/callback")) {
    console.log("[v0] Redirecting to dashboard - user already logged in")
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
