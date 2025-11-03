import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase credentials are not available or invalid, return null
  if (!supabaseUrl || !supabaseAnonKey ||
      supabaseUrl === 'https://placeholder.supabase.co' ||
      supabaseUrl === 'your-supabase-url' ||
      !supabaseUrl.startsWith('https://')) {
    console.warn("[v0] Supabase credentials not configured properly, client disabled")
    return null
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}
