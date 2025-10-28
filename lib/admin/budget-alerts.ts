/**
 * Budget Alert System
 *
 * Real-time cost monitoring and alerting for CLAI administrators
 */

import { kv, kvKey, KV_PREFIXES } from "@/lib/kv/client"
import type { BudgetAlert, CLAIModule } from "./cost-tracking"
import { getDailyStats, getUserUsage } from "@/lib/ai/observability"
import { getModuleCostBreakdown } from "./cost-tracking"

/**
 * Alert configuration storage key
 */
const ALERTS_KEY = kvKey(KV_PREFIXES.TOKEN_USAGE, "budget-alerts", "config")

/**
 * Create a new budget alert
 */
export async function createBudgetAlert(config: Omit<BudgetAlert, 'id' | 'currentSpend' | 'percentUsed'>): Promise<BudgetAlert> {
  try {
    const id = `alert_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const alert: BudgetAlert = {
      id,
      ...config,
      currentSpend: 0,
      percentUsed: 0
    }

    // Get existing alerts
    const alerts = await getAllBudgetAlerts()
    alerts.push(alert)

    // Save
    await kv.set(ALERTS_KEY, alerts, { ex: 31536000 }) // 1 year

    return alert
  } catch (error) {
    console.error('[BudgetAlerts] Failed to create alert:', error)
    throw error
  }
}

/**
 * Get all budget alerts
 */
export async function getAllBudgetAlerts(): Promise<BudgetAlert[]> {
  try {
    const alerts = await kv.get<BudgetAlert[]>(ALERTS_KEY)
    return alerts || []
  } catch (error) {
    console.error('[BudgetAlerts] Failed to get alerts:', error)
    return []
  }
}

/**
 * Update an existing alert
 */
export async function updateBudgetAlert(id: string, updates: Partial<BudgetAlert>): Promise<BudgetAlert | null> {
  try {
    const alerts = await getAllBudgetAlerts()
    const index = alerts.findIndex(a => a.id === id)

    if (index === -1) return null

    alerts[index] = { ...alerts[index], ...updates }
    await kv.set(ALERTS_KEY, alerts, { ex: 31536000 })

    return alerts[index]
  } catch (error) {
    console.error('[BudgetAlerts] Failed to update alert:', error)
    return null
  }
}

/**
 * Delete a budget alert
 */
export async function deleteBudgetAlert(id: string): Promise<boolean> {
  try {
    const alerts = await getAllBudgetAlerts()
    const filtered = alerts.filter(a => a.id !== id)

    await kv.set(ALERTS_KEY, filtered, { ex: 31536000 })
    return true
  } catch (error) {
    console.error('[BudgetAlerts] Failed to delete alert:', error)
    return false
  }
}

/**
 * Check if any alerts have been triggered
 */
export async function checkBudgetAlerts(): Promise<BudgetAlert[]> {
  try {
    const alerts = await getAllBudgetAlerts()
    const triggeredAlerts: BudgetAlert[] = []

    for (const alert of alerts) {
      if (!alert.enabled) continue

      let currentSpend = 0

      // Get spend based on scope
      if (alert.scope === 'global') {
        const stats = await getDailyStats()
        currentSpend = stats?.totalCost || 0
      } else if (alert.scope === 'module' && alert.scopeId) {
        const now = new Date()
        const startDate = getPeriodStartDate(now, alert.period)
        const endDate = now.toISOString().split('T')[0]
        const modules = await getModuleCostBreakdown(startDate, endDate)
        const module = modules.find(m => m.module === alert.scopeId)
        currentSpend = module?.totalCost || 0
      } else if (alert.scope === 'user' && alert.scopeId) {
        const usage = await getUserUsage(alert.scopeId)
        currentSpend = usage?.totalCost || 0
      }

      const percentUsed = (currentSpend / alert.threshold) * 100

      // Update alert with current data
      alert.currentSpend = currentSpend
      alert.percentUsed = percentUsed

      // Check if triggered (>= 80%)
      if (percentUsed >= 80) {
        triggeredAlerts.push(alert)
      }
    }

    // Save updated alerts
    await kv.set(ALERTS_KEY, alerts, { ex: 31536000 })

    return triggeredAlerts
  } catch (error) {
    console.error('[BudgetAlerts] Failed to check alerts:', error)
    return []
  }
}

/**
 * Get start date for period
 */
function getPeriodStartDate(now: Date, period: 'daily' | 'weekly' | 'monthly'): string {
  const start = new Date(now)

  if (period === 'daily') {
    // Start of today
    start.setHours(0, 0, 0, 0)
  } else if (period === 'weekly') {
    // Start of week (Monday)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)
    start.setHours(0, 0, 0, 0)
  } else if (period === 'monthly') {
    // Start of month
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
  }

  return start.toISOString().split('T')[0]
}

/**
 * Send alert notifications
 */
export async function sendAlertNotifications(alerts: BudgetAlert[]): Promise<void> {
  for (const alert of alerts) {
    try {
      // TODO: Integrate with your email system (Resend)
      console.log(`[BudgetAlerts] Alert triggered: ${alert.name}`)
      console.log(`  Spend: $${alert.currentSpend.toFixed(2)} / $${alert.threshold}`)
      console.log(`  Percent: ${alert.percentUsed.toFixed(1)}%`)
      console.log(`  Notify: ${alert.notifyEmails.join(', ')}`)

      // Example email notification (implement with Resend)
      /*
      await sendEmail({
        to: alert.notifyEmails,
        subject: `Budget Alert: ${alert.name}`,
        html: `
          <h2>Budget Alert Triggered</h2>
          <p><strong>${alert.name}</strong> has reached ${alert.percentUsed.toFixed(1)}% of its budget.</p>
          <p>Current spend: $${alert.currentSpend.toFixed(2)} / $${alert.threshold}</p>
          <p>Period: ${alert.period}</p>
          <p>Scope: ${alert.scope}</p>
        `
      })
      */
    } catch (error) {
      console.error('[BudgetAlerts] Failed to send notification:', error)
    }
  }
}

/**
 * Background job to check alerts (should be called periodically)
 */
export async function runAlertCheck(): Promise<void> {
  try {
    const triggeredAlerts = await checkBudgetAlerts()

    if (triggeredAlerts.length > 0) {
      await sendAlertNotifications(triggeredAlerts)
    }

    console.log(`[BudgetAlerts] Check complete. ${triggeredAlerts.length} alerts triggered.`)
  } catch (error) {
    console.error('[BudgetAlerts] Alert check failed:', error)
  }
}

/**
 * Get alert summary for dashboard
 */
export async function getAlertSummary(): Promise<{
  total: number
  active: number
  triggered: number
  alerts: BudgetAlert[]
}> {
  try {
    const alerts = await getAllBudgetAlerts()
    const activeAlerts = alerts.filter(a => a.enabled)
    const triggeredAlerts = activeAlerts.filter(a => a.percentUsed >= 80)

    return {
      total: alerts.length,
      active: activeAlerts.length,
      triggered: triggeredAlerts.length,
      alerts: triggeredAlerts
    }
  } catch (error) {
    console.error('[BudgetAlerts] Failed to get summary:', error)
    return {
      total: 0,
      active: 0,
      triggered: 0,
      alerts: []
    }
  }
}

/**
 * Predefined alert templates
 */
export const ALERT_TEMPLATES = {
  globalDaily: {
    name: 'Daily Spend Limit',
    threshold: 50,
    period: 'daily' as const,
    scope: 'global' as const,
    notifyEmails: ['admin@lab.com'],
    enabled: true
  },
  globalMonthly: {
    name: 'Monthly Budget',
    threshold: 1000,
    period: 'monthly' as const,
    scope: 'global' as const,
    notifyEmails: ['admin@lab.com', 'finance@lab.com'],
    enabled: true
  },
  croweVisionDaily: {
    name: 'Crowe Vision Daily Limit',
    threshold: 20,
    period: 'daily' as const,
    scope: 'module' as const,
    scopeId: 'crowe-vision',
    notifyEmails: ['vision-team@lab.com'],
    enabled: true
  }
}
