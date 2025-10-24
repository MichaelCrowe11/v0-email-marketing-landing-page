export interface GPTProduct {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  stripeLink: string
  category: "cultivation" | "business" | "research" | "specialty"
  features: string[]
  capabilities: string[]
  knowledgeBase: string[]
  popular?: boolean
  openAILink?: string
  icon: string
}

export const GPT_PRODUCTS: GPTProduct[] = [
  {
    id: "mycology-master-gpt",
    name: "Mycology Master GPT",
    description: "Complete mushroom cultivation expert with 20+ years of Michael Crowe's knowledge",
    longDescription:
      "The ultimate AI assistant for mushroom cultivation, trained on Michael Crowe's two decades of professional experience. Provides expert guidance on species selection, substrate formulation, environmental control, contamination prevention, and commercial scaling strategies.",
    price: 97,
    stripeLink: "https://buy.stripe.com/placeholder-mycology-master",
    category: "cultivation",
    icon: "🍄",
    features: [
      "Species-specific cultivation protocols",
      "Substrate recipe optimization",
      "Contamination identification & treatment",
      "Environmental parameter guidance",
      "Troubleshooting assistance",
      "Commercial scaling advice",
    ],
    capabilities: [
      "Answer cultivation questions 24/7",
      "Generate custom SOPs",
      "Analyze grow room conditions",
      "Recommend equipment & supplies",
      "Calculate yields & economics",
    ],
    knowledgeBase: [
      "20+ years commercial cultivation experience",
      "7 major species cultivation protocols",
      "Contamination identification database",
      "Substrate formulation library",
      "Environmental control strategies",
    ],
    popular: true,
    openAILink: "https://chat.openai.com/g/g-mycology-master",
  },
  {
    id: "spawn-production-gpt",
    name: "Spawn Production GPT",
    description: "Specialized AI for grain spawn and liquid culture production",
    longDescription:
      "Expert assistant focused exclusively on spawn production, from grain preparation to quality control. Trained on professional lab protocols and contamination prevention strategies.",
    price: 67,
    stripeLink: "https://buy.stripe.com/placeholder-spawn-production",
    category: "cultivation",
    icon: "🧫",
    features: [
      "Grain spawn recipes & protocols",
      "Liquid culture formulations",
      "Sterilization cycle guidance",
      "Quality control procedures",
      "Contamination prevention",
      "Production scaling",
    ],
    capabilities: [
      "Generate spawn production SOPs",
      "Calculate grain hydration rates",
      "Troubleshoot contamination issues",
      "Optimize sterilization cycles",
      "Design lab workflows",
    ],
    knowledgeBase: [
      "Professional lab protocols",
      "Grain spawn formulations",
      "Liquid culture techniques",
      "Sterilization best practices",
      "QC procedures",
    ],
    openAILink: "https://chat.openai.com/g/g-spawn-production",
  },
  {
    id: "mushroom-business-gpt",
    name: "Mushroom Business GPT",
    description: "Business strategy and operations expert for mushroom farms",
    longDescription:
      "Strategic business advisor trained on successful mushroom farm operations, market analysis, financial planning, and scaling strategies. Perfect for entrepreneurs and established farms looking to grow.",
    price: 97,
    stripeLink: "https://buy.stripe.com/placeholder-business",
    category: "business",
    icon: "💼",
    features: [
      "Business plan development",
      "Market analysis & pricing",
      "Financial projections",
      "Marketing strategies",
      "Operations optimization",
      "Scaling roadmaps",
    ],
    capabilities: [
      "Create business plans",
      "Analyze market opportunities",
      "Calculate profitability",
      "Design marketing campaigns",
      "Optimize operations",
    ],
    knowledgeBase: [
      "Southwest Mushrooms case study",
      "Market analysis data",
      "Financial modeling templates",
      "Marketing strategies",
      "Scaling frameworks",
    ],
    popular: true,
    openAILink: "https://chat.openai.com/g/g-mushroom-business",
  },
  {
    id: "substrate-formulation-gpt",
    name: "Substrate Formulation GPT",
    description: "Advanced substrate recipe development and optimization",
    longDescription:
      "Specialized AI for creating and optimizing substrate formulations for any mushroom species. Includes cost analysis, ingredient sourcing, and performance optimization.",
    price: 67,
    stripeLink: "https://buy.stripe.com/placeholder-substrate",
    category: "cultivation",
    icon: "🌾",
    features: [
      "Custom substrate recipes",
      "Ingredient substitution guidance",
      "Cost optimization",
      "Moisture content calculations",
      "Supplementation strategies",
      "Performance analysis",
    ],
    capabilities: [
      "Generate substrate recipes",
      "Calculate ingredient ratios",
      "Optimize for cost or yield",
      "Recommend supplements",
      "Troubleshoot substrate issues",
    ],
    knowledgeBase: [
      "Substrate formulation database",
      "Ingredient properties",
      "Cost analysis data",
      "Performance metrics",
      "Supplementation research",
    ],
    openAILink: "https://chat.openai.com/g/g-substrate-formulation",
  },
  {
    id: "contamination-detective-gpt",
    name: "Contamination Detective GPT",
    description: "Expert contamination identification and prevention specialist",
    longDescription:
      "AI specialist trained to identify, diagnose, and prevent contamination in mushroom cultivation. Provides detailed visual identification guides and treatment protocols.",
    price: 47,
    stripeLink: "https://buy.stripe.com/placeholder-contamination",
    category: "specialty",
    icon: "🔬",
    features: [
      "Visual contamination identification",
      "Root cause analysis",
      "Prevention protocols",
      "Treatment recommendations",
      "Sanitation procedures",
      "Emergency response plans",
    ],
    capabilities: [
      "Identify contaminants from descriptions",
      "Diagnose contamination sources",
      "Create prevention plans",
      "Generate sanitation SOPs",
      "Emergency response guidance",
    ],
    knowledgeBase: [
      "Contamination identification database",
      "Visual identification guides",
      "Treatment protocols",
      "Prevention strategies",
      "Sanitation procedures",
    ],
    openAILink: "https://chat.openai.com/g/g-contamination-detective",
  },
  {
    id: "research-mycologist-gpt",
    name: "Research Mycologist GPT",
    description: "Academic research assistant for mycology studies",
    longDescription:
      "Advanced AI trained on mycological research, scientific literature, and experimental design. Perfect for researchers, students, and serious cultivators exploring new techniques.",
    price: 127,
    stripeLink: "https://buy.stripe.com/placeholder-research",
    category: "research",
    icon: "🔬",
    features: [
      "Literature review assistance",
      "Experimental design guidance",
      "Data analysis support",
      "Research methodology",
      "Citation management",
      "Grant writing help",
    ],
    capabilities: [
      "Review scientific literature",
      "Design experiments",
      "Analyze research data",
      "Generate hypotheses",
      "Write research proposals",
    ],
    knowledgeBase: [
      "Scientific literature database",
      "Research methodologies",
      "Statistical analysis",
      "Experimental protocols",
      "Academic writing",
    ],
    openAILink: "https://chat.openai.com/g/g-research-mycologist",
  },
]

export function getGPTProductById(id: string): GPTProduct | undefined {
  return GPT_PRODUCTS.find((gpt) => gpt.id === id)
}

export function getGPTProductsByCategory(category: string): GPTProduct[] {
  return GPT_PRODUCTS.filter((gpt) => gpt.category === category)
}

export function getPriceInCents(gpt: GPTProduct): number {
  return Math.round(gpt.price * 100)
}
