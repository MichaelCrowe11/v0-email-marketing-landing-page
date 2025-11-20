export interface Dataset {
  id: string
  name: string
  description: string
  price: number // Price in dollars
  stripeProductId?: string
  category: "research" | "professional" | "enterprise"
  features: string[]
  sampleCount: number
  formats: string[]
  license: string
  support: string
  popular?: boolean
  downloadSize?: string
  azureBlobContainer?: string
}

export function getDatasetPriceInCents(dataset: Dataset): number {
  return Math.round(dataset.price * 100)
}

export const DATASETS: Dataset[] = [
  {
    id: "mushroom-dataset-research",
    name: "Mushroom Cultivation Dataset - Research Edition",
    description: "Curated dataset for academic research and non-commercial AI training with 5,000 labeled samples",
    price: 997,
    category: "research",
    sampleCount: 5000,
    formats: ["CSV", "JSON", "Parquet", "PyTorch"],
    license: "Research License - Non-commercial use with attribution",
    support: "Community support via forums",
    downloadSize: "2.5 GB",
    azureBlobContainer: "datasets-research",
    features: [
      "5,000 labeled cultivation images",
      "Species classification labels",
      "Growth stage annotations",
      "Basic environmental data",
      "Image metadata and timestamps",
      "CSV, JSON, Parquet, PyTorch formats",
      "Community forum access",
      "Sample notebooks and examples"
    ],
  },
  {
    id: "mushroom-dataset-professional",
    name: "Mushroom Cultivation Dataset - Professional Edition",
    description: "Comprehensive dataset for commercial AI development with 100,000 samples and advanced features",
    price: 9997,
    category: "professional",
    sampleCount: 100000,
    formats: ["CSV", "JSON", "Parquet", "PyTorch"],
    license: "Commercial License - Internal use with support",
    support: "Email support + documentation + examples",
    downloadSize: "45 GB",
    azureBlobContainer: "datasets-professional",
    popular: true,
    features: [
      "100,000 high-quality labeled samples",
      "Full species taxonomy (50+ species)",
      "Growth stage timelines with timestamps",
      "Environmental condition tracking",
      "Contamination detection labels",
      "Yield prediction features",
      "Quality assessment scores",
      "Computer vision feature embeddings",
      "Professional email support",
      "Jupyter notebooks and training scripts",
      "API access for programmatic download",
      "Quarterly dataset updates for 1 year"
    ],
  },
  {
    id: "mushroom-dataset-enterprise",
    name: "Mushroom Cultivation Dataset - Enterprise Edition",
    description: "Complete dataset with 633,000+ samples, raw video, pre-trained models, and white-label rights",
    price: 49997,
    category: "enterprise",
    sampleCount: 633709,
    formats: ["CSV", "JSON", "Parquet", "PyTorch", "Video", "Audio"],
    license: "Enterprise License - Full commercial use with white-label rights",
    support: "Premium support + consulting + custom development",
    downloadSize: "350 GB",
    azureBlobContainer: "datasets-enterprise",
    features: [
      "633,000+ complete dataset samples",
      "All annotations and advanced labels",
      "Raw video and audio files (80+ hours)",
      "Advanced computer vision features",
      "Pre-trained model checkpoints",
      "Proprietary contamination detection algorithms",
      "Custom model training service (10 hours included)",
      "White-label licensing rights",
      "Dedicated support engineer",
      "Custom data augmentation pipelines",
      "Azure AI integration templates",
      "Lifetime updates and new data additions",
      "Priority API access with higher rate limits"
    ],
  },
]

export function getDatasetsByCategory(category: Dataset["category"]) {
  return DATASETS.filter((d) => d.category === category)
}

export function getDatasetById(id: string) {
  return DATASETS.find((d) => d.id === id)
}
