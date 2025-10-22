export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: "mms" | "books" | "templates" | "sops"
  features: string[]
  popular?: boolean
}

export const PRODUCTS: Product[] = [
  // MMS Products
  {
    id: "crowe-logic-mms-pro",
    name: "Crowe Logic MMS Pro",
    description:
      "Complete Mushroom Management System with AI-powered insights, real-time monitoring, and automated SOPs",
    priceInCents: 29900, // $299/month
    category: "mms",
    features: [
      "AI-powered cultivation insights",
      "Real-time environmental monitoring",
      "Automated SOP generation",
      "Contamination detection & alerts",
      "Yield optimization recommendations",
      "Multi-facility management",
    ],
    popular: true,
  },
  {
    id: "crowe-logic-mms-starter",
    name: "Crowe Logic MMS Starter",
    description: "Essential mushroom management tools for small-scale growers",
    priceInCents: 9900, // $99/month
    category: "mms",
    features: [
      "Basic cultivation tracking",
      "SOP templates",
      "Environmental logging",
      "Yield tracking",
      "Email support",
    ],
  },

  // Books
  {
    id: "mycology-mastery-guide",
    name: "Mycology Mastery: The Complete Guide",
    description: "500+ page comprehensive guide to commercial mushroom cultivation",
    priceInCents: 4900, // $49
    category: "books",
    features: [
      "500+ pages of expert knowledge",
      "Full-color illustrations",
      "Species-specific protocols",
      "Troubleshooting guides",
      "Digital + Print versions",
    ],
    popular: true,
  },
  {
    id: "contamination-handbook",
    name: "Contamination Prevention Handbook",
    description: "Master contamination identification, prevention, and remediation",
    priceInCents: 2900, // $29
    category: "books",
    features: ["Visual ID guide", "Prevention protocols", "Root cause analysis", "CAPA procedures", "Case studies"],
  },

  // Templates
  {
    id: "farm-management-templates",
    name: "Farm Management Template Pack",
    description: "Complete set of spreadsheets and documents for running your mushroom farm",
    priceInCents: 9900, // $99
    category: "templates",
    features: [
      "Production tracking sheets",
      "Inventory management",
      "Cost analysis templates",
      "Employee schedules",
      "Quality control checklists",
      "Financial projections",
    ],
  },
  {
    id: "cultivation-logs-bundle",
    name: "Cultivation Logs Bundle",
    description: "Professional logging templates for every stage of cultivation",
    priceInCents: 4900, // $49
    category: "templates",
    features: [
      "Spawn run logs",
      "Fruiting room logs",
      "Harvest tracking",
      "Environmental data sheets",
      "QC inspection forms",
    ],
  },

  // SOPs
  {
    id: "complete-sop-library",
    name: "Complete SOP Library",
    description: "Industry-standard SOPs for commercial mushroom production",
    priceInCents: 19900, // $199
    category: "sops",
    features: [
      "50+ detailed SOPs",
      "Substrate preparation",
      "Sterilization protocols",
      "Inoculation procedures",
      "Fruiting management",
      "Harvest & packaging",
      "Sanitation protocols",
    ],
    popular: true,
  },
  {
    id: "specialty-species-sops",
    name: "Specialty Species SOPs",
    description: "Detailed protocols for gourmet and medicinal mushrooms",
    priceInCents: 9900, // $99
    category: "sops",
    features: [
      "Lion's Mane protocols",
      "Reishi cultivation",
      "Cordyceps procedures",
      "Turkey Tail methods",
      "Shiitake techniques",
    ],
  },
]
