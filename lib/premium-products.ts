// Premium Products Configuration
// This file will be updated with real Stripe Price IDs after products are created

export type ProductCategory = "subscription" | "consultation" | "gpt_module" | "credits" | "course"
export type AccessLevel = "master_grower" | "expert" | "pro" | "free"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stripePriceId: string
  category: ProductCategory
  features?: string[]
  popular?: boolean
  savings?: number
  metadata?: Record<string, any>
}

// Master Grower Tier (New Premium Tier)
export const masterGrowerProducts = {
  monthly: {
    id: "master-grower-monthly",
    name: "Master Grower Access",
    description: "Premium tier with quarterly 1-on-1 consultations, white-label capability, and dedicated support",
    price: 497,
    stripePriceId: process.env.NEXT_PUBLIC_MASTER_GROWER_MONTHLY_PRICE_ID || "",
    category: "subscription" as ProductCategory,
    features: [
      "Everything in Expert Access",
      "Quarterly 30-min 1-on-1 consultation with Michael Crowe ($212.50 value)",
      "White-label capability (remove branding)",
      "Multi-facility management (up to 5 locations)",
      "Team collaboration (up to 10 users)",
      "API access for custom integrations",
      "Dedicated account manager",
      "Custom SOP creation service",
    ],
    popular: false,
  },
  yearly: {
    id: "master-grower-yearly",
    name: "Master Grower Access",
    description: "Premium tier with quarterly 1-on-1 consultations, white-label capability, and dedicated support",
    price: 4997,
    stripePriceId: process.env.NEXT_PUBLIC_MASTER_GROWER_YEARLY_PRICE_ID || "",
    category: "subscription" as ProductCategory,
    savings: 967,
    features: [
      "Everything in Expert Access",
      "Quarterly 30-min 1-on-1 consultation with Michael Crowe ($212.50 value)",
      "White-label capability (remove branding)",
      "Multi-facility management (up to 5 locations)",
      "Team collaboration (up to 10 users)",
      "API access for custom integrations",
      "Dedicated account manager",
      "Custom SOP creation service",
    ],
    popular: false,
  },
}

// Consultation Packages
export const consultationProducts = {
  oneHour: {
    id: "consultation-1hr",
    name: "1-Hour Expert Consultation",
    description: "One-on-one consultation with Michael Crowe covering any cultivation challenge",
    price: 425,
    stripePriceId: process.env.NEXT_PUBLIC_CONSULTATION_1HR_PRICE_ID || "",
    category: "consultation" as ProductCategory,
    features: [
      "Pre-call questionnaire",
      "Custom recommendations",
      "Follow-up summary document",
      "2 weeks of email support",
    ],
  },
  threeHour: {
    id: "consultation-3hr",
    name: "3-Hour Consultation Package",
    description: "Extended consultation for facility setup, troubleshooting, or staff training",
    price: 1150,
    stripePriceId: process.env.NEXT_PUBLIC_CONSULTATION_3HR_PRICE_ID || "",
    category: "consultation" as ProductCategory,
    savings: 125,
    features: [
      "Everything in 1-hour session",
      "Extended 3-hour consultation",
      "Detailed action plan",
      "30 days of email support",
    ],
    popular: true,
  },
  fullDay: {
    id: "consultation-fullday",
    name: "Full Day (6-Hour) Consultation",
    description: "Full-day intensive for facility audits, team training, or operation overhauls",
    price: 2250,
    stripePriceId: process.env.NEXT_PUBLIC_CONSULTATION_FULLDAY_PRICE_ID || "",
    category: "consultation" as ProductCategory,
    savings: 300,
    features: [
      "Full 6-hour consultation",
      "On-site or virtual options",
      "Comprehensive facility audit",
      "Detailed report with recommendations",
      "30 days of follow-up support",
    ],
  },
  retainer: {
    id: "consultation-retainer",
    name: "Monthly Consulting Retainer - Premium",
    description: "Exclusive monthly consulting for commercial operations and serious cultivators",
    price: 25000,
    stripePriceId: process.env.NEXT_PUBLIC_CONSULTATION_RETAINER_PRICE_ID || "",
    category: "consultation" as ProductCategory,
    features: [
      "Priority access to Michael Crowe",
      "Unlimited strategic consulting",
      "Facility optimization",
      "Operational troubleshooting",
      "Custom SOP development",
      "Direct phone/video access",
      "Commercial operation support",
      "For serious businesses only",
    ],
  },
}

// GPT Module Products
// NOTE: GPT products are managed separately with existing Stripe checkout links
// Existing pricing: Core $97, Spawn/Substrate/Inoculation $67 each
// Bundles: Full Access $159, Ultimate $197, Lab Bundle $149
// See /app/gpts/page.tsx for the existing GPT marketplace

// Crowe Vision Credits
export const croweVisionCredits = {
  small: {
    id: "vision-10",
    name: "Crowe Vision - 10 Credits",
    description: "10 contamination analysis credits",
    price: 29,
    stripePriceId: process.env.NEXT_PUBLIC_VISION_10_PRICE_ID || "",
    category: "credits" as ProductCategory,
    metadata: { credits: 10, unitPrice: 2.9 },
  },
  medium: {
    id: "vision-50",
    name: "Crowe Vision - 50 Credits",
    description: "50 contamination analysis credits",
    price: 99,
    stripePriceId: process.env.NEXT_PUBLIC_VISION_50_PRICE_ID || "",
    category: "credits" as ProductCategory,
    savings: 46,
    metadata: { credits: 50, unitPrice: 1.98 },
    popular: true,
  },
  large: {
    id: "vision-100",
    name: "Crowe Vision - 100 Credits",
    description: "100 contamination analysis credits for commercial operations",
    price: 149,
    stripePriceId: process.env.NEXT_PUBLIC_VISION_100_PRICE_ID || "",
    category: "credits" as ProductCategory,
    savings: 141,
    metadata: { credits: 100, unitPrice: 1.49 },
  },
}

// Video Studio Credits
export const videoStudioCredits = {
  small: {
    id: "video-5",
    name: "Video Studio - 5 Credits",
    description: "Generate 5 educational cultivation videos",
    price: 49,
    stripePriceId: process.env.NEXT_PUBLIC_VIDEO_5_PRICE_ID || "",
    category: "credits" as ProductCategory,
    metadata: { credits: 5 },
  },
  large: {
    id: "video-20",
    name: "Video Studio - 20 Credits",
    description: "Generate 20 educational cultivation videos",
    price: 149,
    stripePriceId: process.env.NEXT_PUBLIC_VIDEO_20_PRICE_ID || "",
    category: "credits" as ProductCategory,
    savings: 47,
    metadata: { credits: 20 },
    popular: true,
  },
}

// Premium Courses
export const courseProducts = {
  masterCourse: {
    id: "master-course",
    name: "Crowe Mycology Course",
    description: "Comprehensive 12-week video course with live Q&A and certification",
    price: 997,
    stripePriceId: process.env.NEXT_PUBLIC_MASTER_COURSE_PRICE_ID || "",
    category: "course" as ProductCategory,
    features: [
      "12-week comprehensive program",
      "Live Q&A sessions with Michael Crowe",
      "Certification upon completion",
      "Lifetime access to course materials",
      "Private student community",
      "Downloadable resources",
    ],
    popular: true,
  },
  facilitySetup: {
    id: "facility-setup",
    name: "Commercial Facility Setup - Small Scale",
    description:
      "Complete facility design for small operations (1-5 grow rooms). Enterprise pricing available for larger projects.",
    price: 50000,
    stripePriceId: process.env.NEXT_PUBLIC_FACILITY_SETUP_PRICE_ID || "",
    category: "course" as ProductCategory,
    features: [
      "For 1-5 grow room facilities",
      "Full facility design review",
      "Equipment recommendations",
      "Workflow optimization",
      "Compliance guidance",
      "90 days of email support",
      "Follow-up consultation included",
      "Enterprise pricing for 10+ rooms (custom quote)",
    ],
  },
  customAI: {
    id: "custom-ai",
    name: "Custom AI Model Training",
    description: "Train a dedicated AI model on your facility's specific protocols",
    price: 5000,
    stripePriceId: process.env.NEXT_PUBLIC_CUSTOM_AI_TRAINING_PRICE_ID || "",
    category: "course" as ProductCategory,
    features: [
      "Custom AI model training",
      "Knowledge base integration",
      "Dedicated model deployment",
      "Training on your specific strains/methods",
      "Ongoing model updates (1 year)",
      "Technical support included",
    ],
  },
}

// Helper function to get all products
export function getAllProducts(): Product[] {
  return [
    masterGrowerProducts.monthly,
    masterGrowerProducts.yearly,
    consultationProducts.oneHour,
    consultationProducts.threeHour,
    consultationProducts.fullDay,
    consultationProducts.retainer,
    // GPT products excluded - managed separately
    croweVisionCredits.small,
    croweVisionCredits.medium,
    croweVisionCredits.large,
    videoStudioCredits.small,
    videoStudioCredits.large,
    courseProducts.masterCourse,
    courseProducts.facilitySetup,
    courseProducts.customAI,
  ]
}

// Helper function to get products by category
export function getProductsByCategory(category: ProductCategory): Product[] {
  return getAllProducts().filter((product) => product.category === category)
}

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((product) => product.id === id)
}
