# CLAI Cost Tracking Dashboard - Complete Guide

**Version:** 1.0
**Date:** October 28, 2025
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Setup & Installation](#setup--installation)
5. [Usage Guide](#usage-guide)
6. [API Reference](#api-reference)
7. [Integration with CLAI Modules](#integration-with-clai-modules)
8. [Budget Alerts](#budget-alerts)
9. [Reporting & Export](#reporting--export)
10. [Best Practices](#best-practices)

---

## Overview

The CLAI Cost Tracking Dashboard provides lab administrators with comprehensive visibility into AI usage and costs across all CLAI analytical modules. Built on the AI orchestration infrastructure, it tracks every AI operation, calculates costs, and provides actionable insights for budget management.

### Key Benefits

- **Full Cost Transparency:** Track every dollar spent on AI operations
- **Module-Level Attribution:** Know which modules cost the most
- **Researcher Accountability:** Monitor individual user spending
- **Predictive Budgeting:** Forecast future costs based on trends
- **Automated Alerts:** Get notified before budgets are exceeded
- **CLAI Principle Alignment:** Supports reproducibility and audit trails

---

## Features

### 1. Real-Time Cost Monitoring

- **Live Dashboard:** Updates with every AI request
- **Multi-Period Views:** Day, week, month, quarter
- **Comparison Metrics:** Compare to previous periods
- **Cost Per Request:** Understand average costs

### 2. Module Breakdown

Track costs across all 8 CLAI modules:
- Crowe Vision (contamination detection)
- Growth Analytics
- Environmental Monitoring
- Yield Prediction
- Contamination Detection
- Species Library
- General Chat
- Batch Analysis

### 3. Researcher Usage Tracking

- Individual researcher costs
- Usage patterns by role
- Cost attribution by module per user
- Last activity tracking

### 4. Cost Forecasting

- Linear projection based on historical data
- Confidence scoring
- Module-specific forecasts
- Budget planning recommendations

### 5. Budget Alerts

- Threshold-based notifications
- Multiple alert scopes (global, module, user)
- Email notifications
- Automated monitoring

### 6. Export & Reporting

- CSV format for Excel/Google Sheets
- JSON format for programmatic analysis
- Customizable date ranges
- Comprehensive cost attribution

---

## Architecture

### Data Flow

```
AI Request
    ↓
Orchestrator (lib/ai/orchestrator.ts)
    ↓
Track Token Usage (lib/ai/observability.ts)
    ↓
Track Module Cost (lib/admin/cost-tracking.ts)
    ↓
Store in Vercel KV
    ↓
Dashboard API (app/api/admin/cost-dashboard/)
    ↓
Admin UI (app/admin/cost-dashboard/)
```

### Storage Structure

All data stored in Vercel KV (Redis):

```
tokens:modules:{module}:{date}        → Module daily costs
tokens:{userId}:modules:{module}      → User-module costs
tokens:{userId}:totals                → User total usage
tokens:models:{modelId}               → Model performance
tokens:daily:{date}                   → Daily aggregates
budget-alerts:config                  → Alert configurations
```

### Cost Calculation

```typescript
Cost = (InputTokens / 1,000,000 × InputCost) +
       (OutputTokens / 1,000,000 × OutputCost)

UserCharge = ProviderCost × 1.25  // 25% markup
```

---

## Setup & Installation

### Prerequisites

✅ AI Orchestration system installed
✅ Vercel KV configured
✅ Supabase with `users` table
✅ Admin role defined in database

### Step 1: Database Setup

Ensure your Supabase `users` table has a `role` column:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'researcher';

-- Set admin users
UPDATE users SET role = 'admin' WHERE email IN ('admin@lab.com');
```

### Step 2: Environment Variables

Already configured if you completed the AI orchestration setup:

```bash
# .env.local
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

### Step 3: Install UI Dependencies

```bash
npm install  # All dependencies already in package.json
```

### Step 4: Deploy

```bash
git add .
git commit -m "feat: add CLAI cost tracking dashboard"
git push origin main

# Vercel auto-deploys
```

### Step 5: Access Dashboard

Navigate to: `https://your-app.vercel.app/admin/cost-dashboard`

---

## Usage Guide

### Accessing the Dashboard

1. Log in as an admin user
2. Navigate to `/admin/cost-dashboard`
3. Select time period (day, week, month)

### Dashboard Sections

#### Overview Cards

**Total Cost**
- Current period spend
- Comparison to previous period
- Trend indicator (up/down)

**AI Requests**
- Total requests made
- Change from previous period
- Request volume trends

**Tokens Used**
- Total tokens consumed
- Cost per million tokens
- Efficiency metric

**Active Users**
- Number of researchers using AI
- Average cost per user
- User engagement level

#### Modules Tab

**Visual Bar Chart**
- Color-coded modules
- Percentage of total cost
- Quick visual comparison

**Detailed Table**
- Module name
- Total cost
- Request count
- Token consumption
- Average cost per request
- Top model used

**Use Cases:**
- Identify most expensive modules
- Find optimization opportunities
- Track module adoption

#### Researchers Tab

**Researcher Table**
- Name and email
- Role (Admin, Researcher, Lab Tech)
- Total costs
- Request count
- Token usage
- Cost per request
- Last activity date

**Summary Stats**
- Total researchers
- Average cost per researcher
- Total spend

**Use Cases:**
- Monitor individual usage
- Identify heavy users
- Budget allocation per researcher

#### Forecast Tab

**Projected Spend**
- Next week/month/quarter projection
- Trend analysis
- Confidence scoring
- Current vs projected comparison

**Budget Planning**
- Conservative estimate (80%)
- Expected estimate (100%)
- Buffer recommendation (+20%)

**Module Projections**
- Forecasted cost per module
- Percentage distribution
- Growth trends

**Insights Panel**
- Trend explanations
- Top spending modules
- Optimization suggestions
- Confidence notes

#### Export Tab

**Date Range Selection**
- Custom start/end dates
- Quick presets (7/30/90 days, this month)

**Export Formats**
- CSV for Excel
- JSON for programmatic use

**Report Contents**
- Module breakdown
- Researcher usage
- Model distribution
- Token metrics

---

## API Reference

### GET /api/admin/cost-dashboard

Get complete dashboard summary

**Query Parameters:**
- `period`: "day" | "week" | "month"

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-10-28T...",
    "currentPeriod": {
      "totalCost": 123.45,
      "totalRequests": 5000,
      "totalTokens": 10000000,
      "activeUsers": 15,
      "activeModules": 6
    },
    "comparison": {
      "previousPeriod": { ... },
      "percentChange": {
        "cost": 12.5,
        "requests": 8.3
      }
    },
    "topModules": [...],
    "topUsers": [...],
    "alerts": [...],
    "forecast": { ... }
  }
}
```

### GET /api/admin/cost-dashboard/modules

Get module cost breakdown

**Query Parameters:**
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD

**Response:**
```json
{
  "success": true,
  "data": {
    "startDate": "2025-10-21",
    "endDate": "2025-10-28",
    "modules": [
      {
        "module": "crowe-vision",
        "totalCost": 45.23,
        "totalRequests": 1200,
        "totalTokens": 3500000,
        "avgCostPerRequest": 0.0377,
        "percentOfTotal": 36.5,
        "topModels": [...]
      }
    ],
    "total": 123.45
  }
}
```

### GET /api/admin/cost-dashboard/researchers

Get researcher usage data

**Query Parameters:**
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD

**Response:**
```json
{
  "success": true,
  "data": {
    "researchers": [
      {
        "userId": "...",
        "userName": "Dr. Smith",
        "email": "smith@lab.com",
        "role": "researcher",
        "totalCost": 23.45,
        "totalRequests": 500,
        "totalTokens": 1500000,
        "costByModule": {
          "crowe-vision": 15.20,
          "growth-analytics": 8.25
        },
        "lastActive": "2025-10-28T..."
      }
    ],
    "total": 123.45,
    "totalActiveUsers": 15
  }
}
```

### GET /api/admin/cost-dashboard/export

Export cost report

**Query Parameters:**
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD
- `format`: "csv" | "json"

**Response:**
File download (CSV or JSON)

### GET /api/admin/budget-alerts

Manage budget alerts

**Query Parameters:**
- `action`: "summary" | "check" (optional)

**Actions:**
- No action: Get all alerts
- `summary`: Get alert summary
- `check`: Run alert check

### POST /api/admin/budget-alerts

Create new alert

**Request Body:**
```json
{
  "name": "Monthly Budget",
  "threshold": 1000,
  "period": "monthly",
  "scope": "global",
  "notifyEmails": ["admin@lab.com"],
  "enabled": true
}
```

---

## Integration with CLAI Modules

### Module Cost Tracking

Every CLAI module should track costs using the orchestrator:

```typescript
// Example: Crowe Vision module
import { generateAIResponse } from '@/lib/ai/orchestrator'
import { trackModuleCost } from '@/lib/admin/cost-tracking'

export async function POST(req: Request) {
  const { imageUrl, batchId, userId } = await req.json()

  // Use orchestrator (automatically tracks)
  const analysis = await generateAIResponse({
    userId,
    modelId: 'openai/gpt-4o',
    messages: [...],
    metadata: {
      module: 'crowe-vision',  // ← Important!
      batchId,
      analysisType: 'contamination'
    }
  })

  // Additional module-specific tracking (optional)
  await trackModuleCost(
    'crowe-vision',
    analysis.cost,
    analysis.tokenUsage.total,
    analysis.modelUsed,
    userId
  )

  return Response.json({ ... })
}
```

### Module Registration

Add new modules to the cost tracking system:

```typescript
// lib/admin/cost-tracking.ts
export type CLAIModule =
  | 'crowe-vision'
  | 'growth-analytics'
  | 'your-new-module'  // ← Add here
```

```typescript
// components/admin/module-breakdown.tsx
const moduleNames: Record<string, string> = {
  'your-new-module': 'Your New Module'  // ← Add display name
}

const moduleColors: Record<string, string> = {
  'your-new-module': 'bg-orange-500'  // ← Add color
}
```

---

## Budget Alerts

### Creating Alerts

**Via UI:**
1. Go to Budget Alerts tab (to be built)
2. Click "Create Alert"
3. Configure threshold and scope
4. Add notification emails
5. Enable alert

**Via API:**
```typescript
const response = await fetch('/api/admin/budget-alerts', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Crowe Vision Daily Limit',
    threshold: 20,
    period: 'daily',
    scope: 'module',
    scopeId: 'crowe-vision',
    notifyEmails: ['vision-team@lab.com'],
    enabled: true
  })
})
```

### Alert Scopes

**Global**
- Monitors total lab spend
- Use for overall budget control

**Module**
- Monitors specific module spend
- Use for module budget allocation

**User**
- Monitors individual researcher spend
- Use for user quotas

### Alert Thresholds

Notifications triggered at:
- **80%:** Warning notification
- **90%:** Critical notification
- **100%:** Budget exceeded

### Automated Monitoring

Set up periodic alert checks:

```typescript
// Example: Vercel Cron Job
// vercel.json
{
  "crons": [{
    "path": "/api/admin/budget-alerts/check",
    "schedule": "0 */6 * * *"  // Every 6 hours
  }]
}
```

---

## Reporting & Export

### CSV Reports

**Format:**
```csv
Report Type,Module/User,Total Cost,Total Requests,Total Tokens,Avg Cost/Request
Module,crowe-vision,45.23,1200,3500000,0.0377
Module,growth-analytics,32.10,800,2100000,0.0401
Researcher,Dr. Smith,23.45,500,1500000,0.0469
```

**Use Cases:**
- Import to Excel for pivot tables
- Share with finance department
- Quarterly budget reviews

### JSON Reports

**Format:**
```json
{
  "moduleBreakdown": [...],
  "researchers": [...]
}
```

**Use Cases:**
- Programmatic analysis
- Data pipelines
- Custom dashboards
- BI tools

### Scheduled Reports

Set up automated monthly reports:

```typescript
// Example: Send monthly report
async function sendMonthlyReport() {
  const startDate = new Date()
  startDate.setDate(1)  // First of month

  const endDate = new Date()

  const report = await exportCostReport(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0],
    'csv'
  )

  // Send via email
  await sendEmail({
    to: 'finance@lab.com',
    subject: 'Monthly CLAI Cost Report',
    attachments: [{
      filename: 'clai-report.csv',
      content: report
    }]
  })
}
```

---

## Best Practices

### 1. Regular Monitoring

- **Daily:** Check overview dashboard
- **Weekly:** Review module breakdown
- **Monthly:** Analyze researcher usage
- **Quarterly:** Forecast and budget planning

### 2. Cost Optimization

**Identify High-Cost Modules:**
```
If Crowe Vision > 40% of budget:
  → Consider caching frequent analyses
  → Use cheaper models for preliminary scans
  → Batch similar requests
```

**Optimize Model Selection:**
```
Simple queries → gpt-4o-mini ($0.15/M)
Complex analysis → gpt-4o ($2.50/M)
Vision tasks → GPT-4o Vision
Reasoning → o1 (only when needed)
```

**Leverage Caching:**
```
Species Library queries → Cache 24h
SOPs and guides → Cache 7 days
Real-time sensor data → No cache
```

### 3. Budget Allocation

**Recommended Budget Distribution:**
```
40% - Research modules (Crowe Vision, Growth Analytics)
30% - Monitoring (Environmental, Contamination Detection)
20% - General operations (Species Library, Chat)
10% - Buffer for spikes
```

### 4. User Quotas

**Role-Based Limits:**
```
Lab Tech:    $50/month  (routine operations)
Researcher:  $200/month (active research)
Admin:       Unlimited  (system management)
```

### 5. Alert Configuration

**Recommended Alerts:**
```
1. Daily Global: $50 threshold
2. Monthly Global: $1000 threshold
3. Per-Module: 40% of budget
4. Per-User: Role-based limits
```

### 6. Audit Trail Integration

Link costs to specific batches:

```typescript
// When using AI for batch analysis
const analysis = await generateAIResponse({
  userId,
  modelId: 'crowelogic/mini',
  messages: [...],
  metadata: {
    module: 'batch-analysis',
    batchId: 'BATCH-2025-001',  // ← Link to batch
    facilitator: 'Dr. Smith',
    purpose: 'contamination-check'
  }
})

// Later: Query costs for specific batch
const batchCosts = await getBatchCosts('BATCH-2025-001')
```

### 7. Performance Monitoring

**Track Key Metrics:**
- Cost per successful analysis
- Cache hit rate per module
- Average tokens per module
- Model success rate
- Researcher efficiency (cost/insight)

---

## Troubleshooting

### Issue: Costs not appearing

**Solution:**
```typescript
// Verify orchestrator is being used
import { generateAIResponse } from '@/lib/ai/orchestrator'

// NOT direct API calls
// ❌ fetch('https://api.openai.com/...')
// ✅ generateAIResponse({...})
```

### Issue: Module breakdown missing modules

**Solution:**
```typescript
// Ensure metadata.module is set
await generateAIResponse({
  ...
  metadata: {
    module: 'crowe-vision'  // ← Must match CLAIModule type
  }
})
```

### Issue: Alerts not triggering

**Solution:**
```bash
# Test alert check manually
curl https://your-app.vercel.app/api/admin/budget-alerts?action=check

# Set up cron job for automated checks
# See "Automated Monitoring" section
```

### Issue: Export returns empty data

**Solution:**
```typescript
// Check date range
const startDate = '2025-10-21'  // ✅ Valid
const endDate = '2025-10-28'    // ✅ Valid

// Not:
const startDate = '10/21/2025'  // ❌ Wrong format
```

---

## Future Enhancements

### Planned Features

1. **Real-Time Alerts UI**
   - Visual alert management
   - Slack/Discord integration
   - SMS notifications

2. **Advanced Analytics**
   - Cost trends by day of week
   - Researcher efficiency scoring
   - Module ROI analysis

3. **Budget Enforcement**
   - Hard limits with automatic shutoff
   - Approval workflows for overages
   - Prepaid credit system

4. **Batch Cost Attribution**
   - Direct batch-to-cost linking
   - Batch profitability analysis
   - Per-client cost tracking

5. **Optimization Recommendations**
   - AI-powered cost reduction suggestions
   - Model upgrade/downgrade recommendations
   - Caching optimization hints

---

## Support & Resources

### Files Created

```
lib/admin/
├── cost-tracking.ts       # Core tracking logic
└── budget-alerts.ts       # Alert system

app/api/admin/
├── cost-dashboard/
│   ├── route.ts          # Main dashboard API
│   ├── modules/route.ts  # Module breakdown
│   ├── researchers/route.ts  # Researcher usage
│   └── export/route.ts   # Report export
└── budget-alerts/route.ts  # Alert management

app/admin/cost-dashboard/
└── page.tsx              # Dashboard UI

components/admin/
├── cost-overview.tsx     # Overview cards
├── module-breakdown.tsx  # Module visualization
├── researcher-usage.tsx  # Researcher table
├── cost-forecast.tsx     # Forecasting
└── export-reports.tsx    # Export UI
```

### Related Documentation

- [AI Orchestration Upgrade](./AI_ORCHESTRATION_UPGRADE.md)
- [Vercel KV Setup](./VERCEL_KV_SETUP.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [CLAI Design Guidelines](./CLAI_DESIGN_GUIDELINES.md)

### Getting Help

**Dashboard Issues:**
- Check Vercel logs for errors
- Verify KV connection
- Ensure admin role is set

**Cost Tracking Issues:**
- Verify orchestrator integration
- Check metadata.module values
- Review KV keys in dashboard

**Contact:**
- Technical: dev@lab.com
- Budget: finance@lab.com
- Admin: admin@lab.com

---

## Conclusion

The CLAI Cost Tracking Dashboard provides complete financial visibility into your AI-powered laboratory operations. By tracking costs at the module, researcher, and request level, you can make informed decisions about budget allocation, identify optimization opportunities, and ensure sustainable AI usage.

**Key Takeaways:**

✅ Full cost transparency across all CLAI modules
✅ Researcher-level accountability and usage tracking
✅ Predictive budgeting with confidence scoring
✅ Automated alerts prevent budget overruns
✅ Exportable reports for financial analysis
✅ CLAI-aligned with audit trail principles

**Next Steps:**

1. Set up initial budget alerts
2. Review first week's data
3. Establish baseline costs per module
4. Configure role-based quotas
5. Schedule monthly cost reviews

---

**Dashboard ready for production use!** 🎉
