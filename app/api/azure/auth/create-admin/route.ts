// Azure auth - create admin account (one-time setup)
// SECURITY: This endpoint requires ADMIN_SETUP_KEY environment variable
import { type NextRequest, NextResponse } from "next/server"
import { insert, selectSingle, update } from "@/lib/azure/database"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { setupKey, email, password, name } = await request.json()

    // Validate setup key from environment variable
    const validSetupKey = process.env.ADMIN_SETUP_KEY
    if (!validSetupKey) {
      return NextResponse.json(
        { error: "Admin setup is disabled. Set ADMIN_SETUP_KEY environment variable." },
        { status: 403 }
      )
    }

    if (!setupKey || setupKey !== validSetupKey) {
      return NextResponse.json(
        { error: "Invalid setup key" },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 12) {
      return NextResponse.json(
        { error: "Password must be at least 12 characters" },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const { data: existingUser } = await selectSingle<{ id: string; email: string }>(
      "users",
      "id, email",
      "email = @email",
      { email }
    )

    const passwordHash = await bcrypt.hash(password, 12)

    if (existingUser) {
      // Update existing user to be admin
      const { error: updateError } = await update(
        "users",
        { password_hash: passwordHash, is_admin: true, name: name || "Administrator" },
        "email = @email",
        { email }
      )

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update admin: " + updateError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Existing user updated to admin. Remove ADMIN_SETUP_KEY from environment after setup.",
      })
    }

    // Create new admin user
    const id = uuidv4()

    const { error: insertError } = await insert("users", {
      id,
      email,
      password_hash: passwordHash,
      name: name || "Administrator",
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
      message: "Admin account created. Remove ADMIN_SETUP_KEY from environment after setup.",
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
