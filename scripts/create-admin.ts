// Script to create an administrator account
// Run with: npx tsx scripts/create-admin.ts

import sql from "mssql"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

const config: sql.config = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER || "",
  database: process.env.AZURE_SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
}

async function createAdmin() {
  // Admin credentials
  const adminEmail = "admin@crowelogic.com"
  const adminPassword = "CroweAdmin2024!"
  const adminName = "Administrator"

  console.log("Creating administrator account...")
  console.log(`Email: ${adminEmail}`)
  console.log(`Password: ${adminPassword}`)

  try {
    const pool = await sql.connect(config)

    // Check if admin already exists
    const existing = await pool.request()
      .input("email", adminEmail)
      .query("SELECT id FROM users WHERE email = @email")

    if (existing.recordset.length > 0) {
      console.log("Admin user already exists. Updating to ensure admin privileges...")

      const passwordHash = await bcrypt.hash(adminPassword, 12)

      await pool.request()
        .input("email", adminEmail)
        .input("password_hash", passwordHash)
        .input("is_admin", true)
        .query("UPDATE users SET password_hash = @password_hash, is_admin = @is_admin WHERE email = @email")

      console.log("Admin user updated successfully!")
    } else {
      const id = uuidv4()
      const passwordHash = await bcrypt.hash(adminPassword, 12)

      await pool.request()
        .input("id", id)
        .input("email", adminEmail)
        .input("password_hash", passwordHash)
        .input("name", adminName)
        .input("is_admin", true)
        .query(`
          INSERT INTO users (id, email, password_hash, name, is_admin, created_at, updated_at)
          VALUES (@id, @email, @password_hash, @name, @is_admin, GETUTCDATE(), GETUTCDATE())
        `)

      console.log("Admin user created successfully!")
    }

    console.log("\n=== ADMIN LOGIN CREDENTIALS ===")
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log("================================\n")

    await pool.close()
  } catch (error) {
    console.error("Failed to create admin user:", error)
    process.exit(1)
  }
}

createAdmin()
