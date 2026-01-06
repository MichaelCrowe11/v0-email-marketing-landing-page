// Azure database query API route
// SECURITY: Public read for certain tables, auth required for writes
import { type NextRequest, NextResponse } from "next/server"
import { insert, update, select, remove } from "@/lib/azure/database"
import { getUser } from "@/lib/azure/auth"

// Tables that require admin access for write operations
const ADMIN_ONLY_TABLES = ["users", "gpt_modules", "species_library", "knowledge_base"]

// Tables that allow user read access (user can only read their own data)
const USER_READABLE_TABLES = [
  "cultivation_projects",
  "environmental_readings",
  "harvest_records",
  "ai_conversations",
  "ai_messages",
  "user_subscriptions",
  "user_gpt_purchases",
  "documents",
]

// Public read tables (anyone can read, no auth required)
const PUBLIC_READ_TABLES = [
  "forum_categories",
  "forum_posts",
  "forum_replies",
  "species_library",
  "mushroom_species_library",
  "knowledge_base",
  "contamination_library",
  "sop_templates",
  "gpt_modules",
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, table, data, columns, whereClause, whereParams, orderBy, limit } = body

    // Validate action
    if (!["insert", "update", "select", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Check if this is a public read request
    const isPublicRead = action === "select" && PUBLIC_READ_TABLES.includes(table)

    // Get user (may be null for public reads)
    const { data: { user } } = await getUser()

    // Require authentication for non-public requests
    if (!isPublicRead && !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Authorization checks based on action and table
    const isAdmin = user?.is_admin === true

    switch (action) {
      case "insert": {
        // Only admins can insert into admin-only tables
        if (ADMIN_ONLY_TABLES.includes(table) && !isAdmin) {
          return NextResponse.json(
            { error: "Admin access required for this operation" },
            { status: 403 }
          )
        }

        // For user tables, ensure user_id is set to current user
        const insertData = USER_READABLE_TABLES.includes(table) && user
          ? { ...data, user_id: user.id }
          : data

        const result = await insert(table, insertData)
        return NextResponse.json(result)
      }

      case "update": {
        // Only admins can update admin-only tables
        if (ADMIN_ONLY_TABLES.includes(table) && !isAdmin) {
          return NextResponse.json(
            { error: "Admin access required for this operation" },
            { status: 403 }
          )
        }

        // For user tables, restrict to own data
        let finalWhereClause = whereClause
        let finalWhereParams = whereParams

        if (USER_READABLE_TABLES.includes(table) && !isAdmin && user) {
          finalWhereClause = whereClause
            ? `(${whereClause}) AND user_id = @_auth_user_id`
            : "user_id = @_auth_user_id"
          finalWhereParams = { ...whereParams, _auth_user_id: user.id }
        }

        const result = await update(table, data, finalWhereClause, finalWhereParams)
        return NextResponse.json(result)
      }

      case "select": {
        // For public tables, allow unauthenticated access
        if (isPublicRead) {
          const result = await select(table, columns, whereClause, whereParams, { orderBy, limit })
          return NextResponse.json(result)
        }

        // Check if authenticated user can read this table
        const canRead =
          isAdmin ||
          PUBLIC_READ_TABLES.includes(table) ||
          USER_READABLE_TABLES.includes(table)

        if (!canRead) {
          return NextResponse.json(
            { error: "Access denied to this table" },
            { status: 403 }
          )
        }

        // For user-specific tables, restrict to own data unless admin
        let finalWhereClause = whereClause
        let finalWhereParams = whereParams

        if (USER_READABLE_TABLES.includes(table) && !isAdmin && user) {
          finalWhereClause = whereClause
            ? `(${whereClause}) AND user_id = @_auth_user_id`
            : "user_id = @_auth_user_id"
          finalWhereParams = { ...whereParams, _auth_user_id: user.id }
        }

        const result = await select(table, columns, finalWhereClause, finalWhereParams, { orderBy, limit })
        return NextResponse.json(result)
      }

      case "delete": {
        // Only admins can delete from admin-only tables
        if (ADMIN_ONLY_TABLES.includes(table) && !isAdmin) {
          return NextResponse.json(
            { error: "Admin access required for this operation" },
            { status: 403 }
          )
        }

        // For user tables, restrict to own data
        let finalWhereClause = whereClause
        let finalWhereParams = whereParams

        if (USER_READABLE_TABLES.includes(table) && !isAdmin && user) {
          finalWhereClause = whereClause
            ? `(${whereClause}) AND user_id = @_auth_user_id`
            : "user_id = @_auth_user_id"
          finalWhereParams = { ...whereParams, _auth_user_id: user.id }
        }

        const result = await remove(table, finalWhereClause, finalWhereParams)
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[Azure Query Error]", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
