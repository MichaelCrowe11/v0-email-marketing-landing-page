// Azure auth - sign up
import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/azure/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    const { data, error } = await signUp(email, password, { name })

    if (error) {
      return NextResponse.json({ user: null, error: error.message })
    }

    return NextResponse.json({ user: data.user, error: null })
  } catch (error) {
    return NextResponse.json({ user: null, error: (error as Error).message })
  }
}
