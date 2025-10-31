import { create } from 'zustand'
import { HypothesisModel, HypothesisTest, Evidence, ReasoningTrace, Citation, Dataset } from '@/lib/types/workbench'

interface HypothesisStore {
  hypotheses: HypothesisTest[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchHypotheses: (sessionId: string) => Promise<void>
  createHypothesis: (sessionId: string, hypothesis: Partial<HypothesisModel>) => Promise<HypothesisTest>
  testHypothesis: (id: string, datasets?: Dataset[]) => Promise<void>
  deleteHypothesis: (id: string) => Promise<void>
  getHypothesis: (id: string) => HypothesisTest | undefined
}

export const useHypothesisStore = create<HypothesisStore>((set, get) => ({
  hypotheses: [],
  loading: false,
  error: null,

  fetchHypotheses: async (sessionId: string) => {
    set({ loading: true, error: null })
    
    try {
      // TODO: Fetch from API
      // For now, filter from in-memory store
      const allHypotheses = get().hypotheses
      const sessionHypotheses = allHypotheses.filter(
        h => (h.hypothesis as any).sessionId === sessionId
      )
      
      set({ hypotheses: sessionHypotheses, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch hypotheses',
        loading: false 
      })
    }
  },

  createHypothesis: async (sessionId: string, hypothesisData: Partial<HypothesisModel>) => {
    set({ loading: true, error: null })
    
    try {
      const hypothesis: HypothesisModel = {
        id: crypto.randomUUID(),
        statement: hypothesisData.statement || '',
        variables: hypothesisData.variables || [],
        conditions: hypothesisData.conditions || [],
        expectedOutcome: hypothesisData.expectedOutcome || '',
      }

      const hypothesisTest: HypothesisTest = {
        id: crypto.randomUUID(),
        hypothesis: { ...hypothesis, sessionId } as any,
        status: 'pending',
      }
      
      set((state) => ({
        hypotheses: [...state.hypotheses, hypothesisTest],
        loading: false,
      }))
      
      return hypothesisTest
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create hypothesis',
        loading: false 
      })
      throw error
    }
  },

  testHypothesis: async (id: string, datasets: Dataset[] = []) => {
    set({ loading: true, error: null })
    
    try {
      const hypothesis = get().hypotheses.find(h => h.id === id)
      if (!hypothesis) {
        throw new Error('Hypothesis not found')
      }

      // Update status to running
      set((state) => ({
        hypotheses: state.hypotheses.map(h =>
          h.id === id ? { ...h, status: 'running' as const } : h
        ),
      }))

      // Call Azure OpenAI API for real AI reasoning
      const response = await fetch(`/api/workbench/hypotheses/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hypothesis: hypothesis.hypothesis,
          datasets: datasets,
          sessionContext: '',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to test hypothesis')
      }

      const results = await response.json()

      // Update with results
      set((state) => ({
        hypotheses: state.hypotheses.map(h =>
          h.id === id ? { ...h, status: 'completed' as const, results } : h
        ),
        loading: false,
      }))
    } catch (error) {
      set((state) => ({
        hypotheses: state.hypotheses.map(h =>
          h.id === id ? { ...h, status: 'failed' as const } : h
        ),
        error: error instanceof Error ? error.message : 'Failed to test hypothesis',
        loading: false,
      }))
    }
  },

  deleteHypothesis: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      // TODO: Delete from API
      set((state) => ({
        hypotheses: state.hypotheses.filter(h => h.id !== id),
        loading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete hypothesis',
        loading: false 
      })
    }
  },

  getHypothesis: (id: string) => {
    return get().hypotheses.find(h => h.id === id)
  },
}))

// Mock result generator (replace with actual AI reasoning)
function generateMockResults() {
  const evidence: Evidence[] = [
    {
      id: '1',
      type: 'data',
      content: 'Analysis of 150 substrate blocks showed a strong positive correlation (r=0.82, p<0.001) between moisture content above 65% and contamination rates. Blocks with 70% moisture had 23% higher contamination compared to 60% moisture.',
      source: 'Dataset: Oyster Mushroom Cultivation Study 2024',
      relevance: 0.95,
    },
    {
      id: '2',
      type: 'literature',
      content: 'Previous research by Zhang et al. (2022) demonstrated that excessive moisture creates anaerobic conditions favorable for Trichoderma growth, with optimal contamination prevention occurring at 60-62% moisture content.',
      source: 'Zhang et al., Mycological Research, 2022',
      relevance: 0.88,
    },
    {
      id: '3',
      type: 'analysis',
      content: 'Statistical analysis using ANOVA revealed significant differences (F=45.3, p<0.0001) in contamination rates across moisture levels. Post-hoc tests confirmed that each 5% increase in moisture above 65% resulted in 15-18% higher contamination probability.',
      source: 'DeepParallel Statistical Analysis Agent',
      relevance: 0.92,
    },
  ]

  const reasoningSteps = [
    {
      agent: 'retrieval',
      action: 'Data Collection',
      input: 'Query: moisture content and contamination correlation',
      output: 'Retrieved 150 data points from 3 datasets',
      reasoning: 'Searched across all available datasets for records containing moisture content and contamination status. Found relevant data in the Oyster Mushroom Cultivation Study.',
      confidence: 0.95,
      timestamp: new Date(Date.now() - 5000),
    },
    {
      agent: 'analysis',
      action: 'Statistical Analysis',
      input: 'Dataset with 150 records',
      output: 'Correlation coefficient: 0.82, p-value: <0.001',
      reasoning: 'Performed Pearson correlation analysis and ANOVA to determine the relationship between moisture content and contamination rates. Results show strong positive correlation with high statistical significance.',
      confidence: 0.91,
      timestamp: new Date(Date.now() - 3000),
    },
    {
      agent: 'synthesis',
      action: 'Evidence Integration',
      input: 'Statistical results + literature review',
      output: 'Comprehensive conclusion with confidence score',
      reasoning: 'Integrated statistical findings with existing literature to form a comprehensive conclusion. The hypothesis is strongly supported by both empirical data and previous research.',
      confidence: 0.89,
      timestamp: new Date(Date.now() - 1000),
    },
  ]

  const citations: Citation[] = [
    {
      id: '1',
      title: 'Moisture Content Optimization in Oyster Mushroom Cultivation',
      authors: ['Zhang, L.', 'Wang, H.', 'Chen, M.'],
      journal: 'Mycological Research',
      year: 2022,
      doi: '10.1016/j.mycres.2022.03.015',
    },
    {
      id: '2',
      title: 'Contamination Prevention Strategies in Commercial Mushroom Production',
      authors: ['Smith, J.', 'Brown, K.'],
      journal: 'Applied Mycology',
      year: 2023,
      doi: '10.1080/am.2023.1234567',
    },
  ]

  const reasoning: ReasoningTrace = {
    steps: reasoningSteps,
    confidence: 0.89,
    evidence,
    citations,
  }

  return {
    confidence: 0.89,
    evidence,
    reasoning,
    citations,
  }
}
