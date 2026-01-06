// This maintains API compatibility while using Azure backend

import { getUser } from "@/lib/azure/auth"
import * as db from "@/lib/azure/database"

// Query builder class to mimic Supabase's chainable API
class ServerQueryBuilder {
  private table: string
  private selectColumns = "*"
  private whereConditions: { column: string; value: unknown }[] = []
  private orderByClause?: string
  private orderDirection: "ASC" | "DESC" = "ASC"
  private limitValue?: number
  private singleResult = false

  constructor(table: string) {
    this.table = table
  }

  select(columns = "*") {
    this.selectColumns = columns
    return this
  }

  eq(column: string, value: unknown) {
    this.whereConditions.push({ column, value })
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderByClause = column
    this.orderDirection = options?.ascending === false ? "DESC" : "ASC"
    return this
  }

  limit(count: number) {
    this.limitValue = count
    return this
  }

  single() {
    this.singleResult = true
    this.limitValue = 1
    return this
  }

  async insert(data: Record<string, unknown> | Record<string, unknown>[]) {
    const insertData = Array.isArray(data) ? data[0] : data
    return db.insert(this.table, insertData)
  }

  async update(data: Record<string, unknown>) {
    if (this.whereConditions.length === 0) {
      return { data: null, error: new Error("Update requires a where condition") }
    }

    const whereClause = this.whereConditions.map((c) => `${c.column} = @${c.column}`).join(" AND ")
    const whereParams = this.whereConditions.reduce(
      (acc, c) => ({ ...acc, [c.column]: c.value }),
      {} as Record<string, unknown>,
    )

    return db.update(this.table, data, whereClause, whereParams)
  }

  async delete() {
    if (this.whereConditions.length === 0) {
      return { error: new Error("Delete requires a where condition") }
    }

    const whereClause = this.whereConditions.map((c) => `${c.column} = @${c.column}`).join(" AND ")
    const whereParams = this.whereConditions.reduce(
      (acc, c) => ({ ...acc, [c.column]: c.value }),
      {} as Record<string, unknown>,
    )

    return db.remove(this.table, whereClause, whereParams)
  }

  // Make the query builder thenable for await
  async then<T>(
    resolve: (value: { data: T | T[] | null; error: Error | null }) => void,
    reject?: (reason: Error) => void,
  ) {
    try {
      const whereClause =
        this.whereConditions.length > 0
          ? this.whereConditions.map((c) => `${c.column} = @${c.column}`).join(" AND ")
          : undefined

      const whereParams =
        this.whereConditions.length > 0
          ? this.whereConditions.reduce((acc, c) => ({ ...acc, [c.column]: c.value }), {} as Record<string, unknown>)
          : undefined

      const result = await db.select<T>(this.table, this.selectColumns, whereClause, whereParams, {
        orderBy: this.orderByClause ? `${this.orderByClause} ${this.orderDirection}` : undefined,
        limit: this.limitValue,
      })

      if (result.error) {
        resolve({ data: null, error: result.error })
        return
      }

      const data = this.singleResult ? (result.data?.[0] as T) || null : (result.data as T[])
      resolve({ data, error: null })
    } catch (error) {
      if (reject) {
        reject(error as Error)
      } else {
        resolve({ data: null, error: error as Error })
      }
    }
  }
}

// Server client that mimics Supabase client API
interface ServerClient {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string; email: string } | null }; error: Error | null }>
  }
  from: (table: string) => ServerQueryBuilder
  rpc: (functionName: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: Error | null }>
}

export async function createClient(): Promise<ServerClient> {
  return {
    auth: {
      getUser,
    },
    from: (table: string) => new ServerQueryBuilder(table),
    rpc: async (functionName: string, params?: Record<string, unknown>) => {
      // For RPC calls, we'd need to implement stored procedures in Azure SQL
      // For now, return a placeholder
      console.warn(`[Azure] RPC call to ${functionName} - stored procedures need to be implemented`)
      return { data: null, error: null }
    },
  }
}
