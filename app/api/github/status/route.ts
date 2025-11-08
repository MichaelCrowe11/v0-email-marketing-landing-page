import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ connected: false })
    }

    const { data: tokenData } = await supabase
      .from("github_tokens")
      .select("access_token")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({ connected: !!tokenData })
  } catch (error) {
    return NextResponse.json({ connected: false })
  }
}
