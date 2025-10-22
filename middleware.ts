// The landing page doesn't require authentication, so we can safely disable this
// Uncomment when Supabase integration is fully configured

// import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // return await updateSession(request)

  // Temporarily return next response without Supabase auth check
  const { NextResponse } = await import("next/server")
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
