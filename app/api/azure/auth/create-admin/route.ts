// Azure auth - create admin account (one-time setup)
import { type NextRequest, NextResponse } from "next/server"
import { insert, selectSingle, update } from "@/lib/azure/database"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Admin credentials - CHANGE THESE AFTER FIRST USE
const ADMIN_EMAIL = "admin@crowelogic.com"
const ADMIN_PASSWORD = "CroweAdmin2024!"
const ADMIN_NAME = "Administrator"

export async function POST(request: NextRequest) {
  try {
    // Check for setup key to prevent unauthorized access
    const { setupKey } = await request.json()

    if (setupKey !== "setup-admin-account-2024") {
      return NextResponse.json(
        { error: "Invalid setup key" },
        { status: 401 }
      )
    }

    // Check if admin already exists
    const { data: existingUser } = await selectSingle<{ id: string; email: string }>(
      "users",
      "id, email",
      "email = @email",
      { email: ADMIN_EMAIL }
    )

    if (existingUser) {
      // Update existing user to be admin
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

      const { error: updateError } = await update(
        "users",
        { password_hash: passwordHash, is_admin: true, name: ADMIN_NAME },
        "email = @email",
        { email: ADMIN_EMAIL }
      )

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update admin: " + updateError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Existing user updated to admin",
        credentials: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        },
      })
    }

    // Create new admin user
    const id = uuidv4()
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

    const { error: insertError } = await insert("users", {
      id,
      email: ADMIN_EMAIL,
      password_hash: passwordHash,
      name: ADMIN_NAME,
      is_admin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create admin: " + insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
