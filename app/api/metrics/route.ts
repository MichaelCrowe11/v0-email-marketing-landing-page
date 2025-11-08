export const runtime = "nodejs"

import { promises as fs } from "fs"
import path from "path"

const METRICS_PATH = path.join(process.cwd(), "data", "metrics.json")

export async function GET() {
  try {
    const raw = await fs.readFile(METRICS_PATH, "utf8")
    const data = JSON.parse(raw)
    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: "Failed to load metrics", details: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
