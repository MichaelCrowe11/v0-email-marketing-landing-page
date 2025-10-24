import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

const isPublicRoute = createRouteMatcher(["/", "/pricing", "/auth/login(.*)", "/auth/sign-up(.*)", "/api/webhooks(.*)"])

export default clerkMiddleware(
  async (auth, request: NextRequest) => {
    // Protect all routes except public ones
    if (!isPublicRoute(request)) {
      await auth.protect()
    }

    // Continue with Supabase session management
    return await updateSession(request)
  },
  {
    // Configure Clerk middleware options
    debug: false,
  },
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
