import type { LucideIcon } from "lucide-react"
import { Building2, User, Users } from "lucide-react"

export type WorkspaceTier = "solo" | "team" | "business"

export interface WorkspacePlan {
  type: WorkspaceTier
  title: string
  description: string
  features: string[]
  price: string
  icon?: LucideIcon
  color?: string
  popular?: boolean
}

export interface WorkspaceSummary {
  id: string
  name: string
  type: WorkspaceTier
  members: number
  projects: number
  storage: string
  lastActive: string
}

export const workspacePlans: WorkspacePlan[] = [
  {
    type: "solo",
    icon: User,
    title: "Solo Researcher",
    description: "Individual research and experimentation",
    features: [
      "5 GB storage",
      "Unlimited models",
      "Private workspace",
      "Basic analytics",
      "Community support",
    ],
    price: "Free",
    color: "text-secondary",
  },
  {
    type: "team",
    icon: Users,
    title: "Team",
    description: "Collaborative research for small teams",
    features: [
      "100 GB shared storage",
      "Unlimited models",
      "5 team members",
      "Advanced analytics",
      "Shared datasets",
      "Priority support",
    ],
    price: "$49/month",
    color: "text-primary",
    popular: true,
  },
  {
    type: "business",
    icon: Building2,
    title: "Business",
    description: "Enterprise-grade research platform",
    features: [
      "1 TB storage",
      "Custom models",
      "Unlimited members",
      "Enterprise analytics",
      "Dedicated support",
      "SLA guarantee",
      "SSO & RBAC",
    ],
    price: "Custom",
    color: "text-warning",
  },
]

export const workspaceSummaries: WorkspaceSummary[] = [
  {
    id: "1",
    name: "Oyster Cultivation Research",
    type: "solo",
    members: 1,
    projects: 3,
    storage: "2.4 GB / 5 GB",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Contamination Analysis Lab",
    type: "team",
    members: 4,
    projects: 12,
    storage: "45 GB / 100 GB",
    lastActive: "30 minutes ago",
  },
]

export const workspaceFeatureRows = [
  { feature: "Storage", solo: "5 GB", team: "100 GB", business: "1 TB" },
  { feature: "Team Members", solo: "1", team: "5", business: "Unlimited" },
  { feature: "AI Models", solo: "All", team: "All + Priority", business: "All + Custom" },
  { feature: "Support", solo: "Community", team: "Priority", business: "Dedicated" },
]

export const workspaceHelpers = {
  getPlanByType(type: WorkspaceTier) {
    return workspacePlans.find((plan) => plan.type === type)
  },
}
