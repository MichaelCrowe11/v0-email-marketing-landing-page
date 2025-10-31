// Core Data Types for Mycological Work Bench

export interface Dataset {
  id: string
  name: string
  format: 'csv' | 'json' | 'fasta' | 'genbank' | 'excel'
  size: number
  uploaded: Date
  metadata: Record<string, any>
  records: DataRecord[]
}

export interface DataRecord {
  id: string
  data: Record<string, any>
  timestamp?: Date
}

export interface Experiment {
  id: string
  name: string
  pipeline: Pipeline
  inputs: string[] // Dataset IDs
  outputs: string[] // Dataset IDs
  status: 'draft' | 'running' | 'completed' | 'failed'
  started?: Date
  completed?: Date
  results?: ExperimentResults
}

export interface Pipeline {
  id: string
  name: string
  nodes: PipelineNode[]
  edges: PipelineEdge[]
}

export interface PipelineNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    parameters: Record<string, any>
    inputs: Port[]
    outputs: Port[]
  }
}

export interface PipelineEdge {
  id: string
  source: string
  target: string
  sourceHandle: string
  targetHandle: string
}

export interface Port {
  id: string
  type: string
  label: string
}

export interface ExperimentResults {
  outputs: Dataset[]
  logs: string[]
  metrics: Record<string, number>
  visualizations: Visualization[]
}

export interface HypothesisModel {
  id: string
  statement: string
  variables: Variable[]
  conditions: Condition[]
  expectedOutcome: string
  testResults?: HypothesisTest
}

export interface Variable {
  name: string
  type: 'numeric' | 'categorical' | 'boolean'
  description: string
}

export interface Condition {
  variable: string
  operator: 'equals' | 'greater' | 'less' | 'contains' | 'matches'
  value: any
}

export interface HypothesisTest {
  id: string
  hypothesis: HypothesisModel
  status: 'pending' | 'running' | 'completed' | 'failed'
  results?: {
    confidence: number
    evidence: Evidence[]
    reasoning: ReasoningTrace
    citations: Citation[]
  }
}

export interface Evidence {
  id: string
  type: 'data' | 'literature' | 'analysis'
  content: string
  source: string
  relevance: number
}

export interface ReasoningTrace {
  steps: ReasoningStep[]
  confidence: number
  evidence: Evidence[]
  citations: Citation[]
}

export interface ReasoningStep {
  agent: string
  action: string
  input: any
  output: any
  reasoning: string
  confidence: number
  timestamp: Date
}

export interface Citation {
  id: string
  title: string
  authors: string[]
  journal?: string
  year: number
  doi?: string
  url?: string
}

export interface Visualization {
  id: string
  type: 'phylogenetic-tree' | 'growth-curve' | 'heatmap' | 'scatter' | '3d-structure'
  data: any
  config: VisualizationConfig
}

export interface VisualizationConfig {
  title?: string
  xAxis?: AxisConfig
  yAxis?: AxisConfig
  colorScheme?: string
  interactive?: boolean
}

export interface AxisConfig {
  label: string
  scale?: 'linear' | 'log' | 'time'
  min?: number
  max?: number
}

// Agent Types
export interface AgentTask {
  id: string
  type: 'retrieval' | 'analysis' | 'synthesis'
  input: any
  priority: number
  status: 'pending' | 'running' | 'completed' | 'failed'
}

export interface AgentResult {
  taskId: string
  output: any
  confidence: number
  reasoning: string
  evidence: Evidence[]
  timestamp: Date
}

// Collaboration Types
export interface Collaborator {
  id: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: Date
  active: boolean
}

export interface SessionUpdate {
  type: 'insert' | 'delete' | 'update'
  path: string[]
  value?: any
  timestamp: Date
  userId: string
}

// Parser Types
export interface ParsedData {
  records: DataRecord[]
  metadata: Record<string, any>
  errors: ParseError[]
  warnings: string[]
}

export interface ParseError {
  line?: number
  column?: number
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ParseError[]
  warnings: string[]
}
