// Azure auth - sign out
import { NextResponse } from "next/server"
import { signOut } from "@/lib/azure/auth"

export async function POST() {
  try {
    await signOut()
    return NextResponse.json({ error: null })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message })
  }
}
