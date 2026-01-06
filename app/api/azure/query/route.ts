// Azure database query API route
import { type NextRequest, NextResponse } from "next/server"
import { insert, update, select, remove } from "@/lib/azure/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, table, data, columns, whereClause, whereParams, orderBy, limit } = body

    switch (action) {
      case "insert": {
        const result = await insert(table, data)
        return NextResponse.json(result)
      }
      case "update": {
        const result = await update(table, data, whereClause, whereParams)
        return NextResponse.json(result)
      }
      case "select": {
        const result = await select(table, columns, whereClause, whereParams, { orderBy, limit })
        return NextResponse.json(result)
      }
      case "delete": {
        const result = await remove(table, whereClause, whereParams)
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
