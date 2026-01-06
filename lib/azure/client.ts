// Client-side Azure database and auth helpers

import type { User, Session } from "./auth"

export interface AzureClient {
  auth: {
    getUser: () => Promise<{ data: { user: User | null }; error: Error | null }>
    signInWithPassword: (credentials: {
      email: string
      password: string
    }) => Promise<{ data: { user: User | null; session: Session | null }; error: Error | null }>
    signUp: (credentials: {
      email: string
      password: string
      options?: { emailRedirectTo?: string; data?: { name?: string } }
    }) => Promise<{ data: { user: User | null }; error: Error | null }>
    signOut: () => Promise<{ error: Error | null }>
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      data: { subscription: { unsubscribe: () => void } }
    }
  }
  from: (table: string) => QueryBuilder
}

// Query builder to mimic Supabase's chainable API
class QueryBuilder {
  private table: string
  private selectColumns = "*"
  private whereConditions: { clause: string; params: Record<string, unknown> }[] = []
  private orderByClause?: string
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
    this.whereConditions.push({
      clause: `${column} = @${column}`,
      params: { [column]: value },
    })
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    const direction = options?.ascending === false ? "DESC" : "ASC"
    this.orderByClause = `${column} ${direction}`
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
    try {
      const response = await fetch("/api/azure/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "insert", table: this.table, data }),
      })
      const result = await response.json()
      return { data: result.data, error: result.error ? new Error(result.error) : null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async update(data: Record<string, unknown>) {
    try {
      const whereParams = this.whereConditions.reduce(
        (acc, cond) => ({ ...acc, ...cond.params }),
        {} as Record<string, unknown>,
      )
      const whereClause = this.whereConditions.map((c) => c.clause).join(" AND ")

      const response = await fetch("/api/azure/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          table: this.table,
          data,
          whereClause,
          whereParams,
        }),
      })
      const result = await response.json()
      return { data: result.data, error: result.error ? new Error(result.error) : null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async delete() {
    try {
      const whereParams = this.whereConditions.reduce(
        (acc, cond) => ({ ...acc, ...cond.params }),
        {} as Record<string, unknown>,
      )
      const whereClause = this.whereConditions.map((c) => c.clause).join(" AND ")

      const response = await fetch("/api/azure/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          table: this.table,
          whereClause,
          whereParams,
        }),
      })
      const result = await response.json()
      return { error: result.error ? new Error(result.error) : null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async then(resolve: (value: { data: unknown; error: Error | null }) => void) {
    try {
      const whereParams = this.whereConditions.reduce(
        (acc, cond) => ({ ...acc, ...cond.params }),
        {} as Record<string, unknown>,
      )
      const whereClause = this.whereConditions.map((c) => c.clause).join(" AND ")

      const response = await fetch("/api/azure/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "select",
          table: this.table,
          columns: this.selectColumns,
          whereClause: whereClause || undefined,
          whereParams: Object.keys(whereParams).length > 0 ? whereParams : undefined,
          orderBy: this.orderByClause,
          limit: this.limitValue,
        }),
      })
      const result = await response.json()

      const data = this.singleResult ? result.data?.[0] || null : result.data
      resolve({ data, error: result.error ? new Error(result.error) : null })
    } catch (error) {
      resolve({ data: null, error: error as Error })
    }
  }
}

// Singleton client instance
let client: AzureClient | null = null

export function createClient(): AzureClient {
  if (client) return client

  client = {
    auth: {
      getUser: async () => {
        try {
          const response = await fetch("/api/azure/auth/user")
          const result = await response.json()
          return { data: { user: result.user }, error: result.error ? new Error(result.error) : null }
        } catch (error) {
          return { data: { user: null }, error: error as Error }
        }
      },
      signInWithPassword: async ({ email, password }) => {
        try {
          const response = await fetch("/api/azure/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })
          const result = await response.json()
          return {
            data: { user: result.user, session: result.session },
            error: result.error ? new Error(result.error) : null,
          }
        } catch (error) {
          return { data: { user: null, session: null }, error: error as Error }
        }
      },
      signUp: async ({ email, password, options }) => {
        try {
          const response = await fetch("/api/azure/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name: options?.data?.name }),
          })
          const result = await response.json()
          return { data: { user: result.user }, error: result.error ? new Error(result.error) : null }
        } catch (error) {
          return { data: { user: null }, error: error as Error }
        }
      },
      signOut: async () => {
        try {
          await fetch("/api/azure/auth/signout", { method: "POST" })
          return { error: null }
        } catch (error) {
          return { error: error as Error }
        }
      },
      onAuthStateChange: (callback) => {
        // Client-side auth state management
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },
    from: (table: string) => new QueryBuilder(table),
  }

  return client
}
