/**
 * Health Check API Endpoint
 * 
 * Provides health status and configuration validation information
 * Useful for monitoring and deployment verification
 */

import { NextResponse } from "next/server"
import { getHealthStatus } from "@/lib/startup-validation"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const healthStatus = await getHealthStatus()

    const statusCode = 
      healthStatus.status === "healthy" ? 200 :
      healthStatus.status === "degraded" ? 200 :
      503

    return NextResponse.json(
      {
        status: healthStatus.status,
        timestamp: new Date().toISOString(),
        message: healthStatus.message,
        checks: healthStatus.checks,
      },
      { status: statusCode }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : "Health check failed",
        checks: [],
      },
      { status: 503 }
    )
  }
}
