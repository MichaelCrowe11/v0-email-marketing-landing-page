// Azure auth - get current user
import { NextResponse } from "next/server"
import { getUser } from "@/lib/azure/auth"

export async function GET() {
  try {
    const { data, error } = await getUser()
    if (error) {
      return NextResponse.json({ user: null, error: error.message })
    }
    return NextResponse.json({ user: data.user, error: null })
  } catch (error) {
    return NextResponse.json({ user: null, error: (error as Error).message })
  }
}
