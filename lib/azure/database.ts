// Azure SQL Database client for Crowe Mycology
// This replaces Supabase database operations

import sql from "mssql"

// Whitelist of allowed table names to prevent SQL injection
const ALLOWED_TABLES = [
  "users",
  "user_subscriptions",
  "cultivation_projects",
  "environmental_readings",
  "harvest_records",
  "ai_conversations",
  "ai_messages",
  "forum_categories",
  "forum_posts",
  "forum_replies",
  "documents",
  "species_library",
  "mushroom_species_library",
  "knowledge_base",
  "gpt_modules",
  "user_gpt_purchases",
  "contamination_library",
  "sop_templates",
] as const

type AllowedTable = typeof ALLOWED_TABLES[number]

// Validate table name against whitelist
function validateTable(table: string): asserts table is AllowedTable {
  if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
    throw new Error(`Invalid table name: ${table}`)
  }
}

// Validate column names (alphanumeric, underscores only)
function validateColumns(columns: string): string {
  if (columns === "*") return columns
  const columnList = columns.split(",").map((c) => c.trim())
  for (const col of columnList) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col)) {
      throw new Error(`Invalid column name: ${col}`)
    }
  }
  return columns
}

// Connection configuration using Azure environment variables
const config: sql.config = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER || "",
  database: process.env.AZURE_SQL_DATABASE,
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

// Singleton connection pool
let pool: sql.ConnectionPool | null = null

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}

// Generic query helper
export async function query<T>(queryString: string, params?: Record<string, unknown>): Promise<T[]> {
  const poolConnection = await getPool()
  const request = poolConnection.request()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })
  }

  const result = await request.query(queryString)
  return result.recordset as T[]
}

// Insert helper
export async function insert<T>(
  table: string,
  data: Record<string, unknown>,
): Promise<{ data: T | null; error: Error | null }> {
  try {
    // Validate table name against whitelist
    validateTable(table)

    const columns = Object.keys(data).join(", ")
    // Validate column names
    validateColumns(columns)

    const values = Object.keys(data)
      .map((key) => `@${key}`)
      .join(", ")

    const poolConnection = await getPool()
    const request = poolConnection.request()

    Object.entries(data).forEach(([key, value]) => {
      request.input(key, value)
    })

    const result = await request.query(`
      INSERT INTO ${table} (${columns})
      OUTPUT INSERTED.*
      VALUES (${values})
    `)

    return { data: result.recordset[0] as T, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Update helper
export async function update<T>(
  table: string,
  data: Record<string, unknown>,
  whereClause: string,
  whereParams: Record<string, unknown>,
): Promise<{ data: T | null; error: Error | null }> {
  try {
    // Validate table name against whitelist
    validateTable(table)
    // Validate column names in data
    validateColumns(Object.keys(data).join(", "))

    const setClause = Object.keys(data)
      .map((key) => `${key} = @${key}`)
      .join(", ")

    const poolConnection = await getPool()
    const request = poolConnection.request()

    Object.entries(data).forEach(([key, value]) => {
      request.input(key, value)
    })

    Object.entries(whereParams).forEach(([key, value]) => {
      request.input(key, value)
    })

    const result = await request.query(`
      UPDATE ${table}
      SET ${setClause}
      OUTPUT INSERTED.*
      WHERE ${whereClause}
    `)

    return { data: result.recordset[0] as T, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Select helper
export async function select<T>(
  table: string,
  columns = "*",
  whereClause?: string,
  whereParams?: Record<string, unknown>,
  options?: { orderBy?: string; limit?: number },
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    // Validate table name against whitelist
    validateTable(table)
    // Validate column names
    validateColumns(columns)

    const poolConnection = await getPool()
    const request = poolConnection.request()

    let queryString = `SELECT ${columns} FROM ${table}`

    if (whereClause && whereParams) {
      queryString += ` WHERE ${whereClause}`
      Object.entries(whereParams).forEach(([key, value]) => {
        request.input(key, value)
      })
    }

    if (options?.orderBy) {
      queryString += ` ORDER BY ${options.orderBy}`
    }

    if (options?.limit) {
      queryString += ` OFFSET 0 ROWS FETCH NEXT ${options.limit} ROWS ONLY`
    }

    const result = await request.query(queryString)

    return { data: result.recordset as T[], error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Delete helper
export async function remove(
  table: string,
  whereClause: string,
  whereParams: Record<string, unknown>,
): Promise<{ error: Error | null }> {
  try {
    // Validate table name against whitelist
    validateTable(table)

    const poolConnection = await getPool()
    const request = poolConnection.request()

    Object.entries(whereParams).forEach(([key, value]) => {
      request.input(key, value)
    })

    await request.query(`DELETE FROM ${table} WHERE ${whereClause}`)

    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Single record helper
export async function selectSingle<T>(
  table: string,
  columns = "*",
  whereClause: string,
  whereParams: Record<string, unknown>,
): Promise<{ data: T | null; error: Error | null }> {
  const result = await select<T>(table, columns, whereClause, whereParams, { limit: 1 })
  if (result.error) {
    return { data: null, error: result.error }
  }
  return { data: result.data?.[0] || null, error: null }
}
