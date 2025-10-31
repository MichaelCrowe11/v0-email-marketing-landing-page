import { HypothesisModel, Evidence, ReasoningStep, Citation, Dataset } from '@/lib/types/workbench'
import { prepareDatasetContext, extractRelevantData, calculateStatistics, calculateCorrelation } from './dataset-context'

interface TestHypothesisParams {
  hypothesis: HypothesisModel
  datasets: Dataset[]
  sessionContext?: string
}

interface TestHypothesisResult {
  confidence: number
  evidence: Evidence[]
  reasoning: ReasoningStep[]
  citations: Citation[]
}

/**
 * Test a hypothesis using Azure OpenAI multi-agent reasoning
 */
export async function testHypothesisWithAI(
  params: TestHypothesisParams
): Promise<TestHypothesisResult> {
  const { hypothesis, datasets, sessionContext } = params

  // Step 1: Retrieval Agent - Search for relevant data
  const retrievalResult = await retrievalAgent(hypothesis, datasets)

  // Step 2: Analysis Agent - Analyze the data
  const analysisResult = await analysisAgent(hypothesis, retrievalResult)

  // Step 3: Synthesis Agent - Generate conclusion
  const synthesisResult = await synthesisAgent(hypothesis, analysisResult)

  return synthesisResult
}

/**
 * Retrieval Agent - Searches datasets for relevant information
 */
async function retrievalAgent(
  hypothesis: HypothesisModel,
  datasets: Dataset[]
): Promise<{ evidence: Evidence[]; reasoning: ReasoningStep }> {
  // Prepare dataset context
  const datasetContext = prepareDatasetContext(datasets)
  
  // Extract relevant data based on hypothesis variables
  const variableNames = hypothesis.variables.map(v => v.name)
  const relevantData = extractRelevantData(datasets, variableNames)

  const prompt = `You are a data retrieval agent for scientific research. Your task is to search through datasets and find relevant information for hypothesis testing.

Hypothesis: ${hypothesis.statement}

Expected Outcome: ${hypothesis.expectedOutcome}

Variables: ${hypothesis.variables.map(v => `${v.name} (${v.type}): ${v.description}`).join(', ')}

Available Datasets:
${datasetContext}

Relevant Data Found:
${JSON.stringify(relevantData, null, 2)}

Task: Analyze the datasets and identify relevant data points that could support or refute this hypothesis. For each piece of evidence:
1. Extract the relevant data
2. Explain why it's relevant
3. Assign a relevance score (0-1)

Return your findings in JSON format:
{
  "evidence": [
    {
      "content": "Description of the finding with specific data points",
      "source": "Dataset name or identifier",
      "relevance": 0.95,
      "dataPoints": "Specific data points found"
    }
  ],
  "reasoning": "Your reasoning process for finding this evidence",
  "confidence": 0.9
}`

  try {
    const response = await callAzureOpenAI(prompt, 'retrieval')

    const result = JSON.parse(response)

    const evidence: Evidence[] = result.evidence.map((e: any, index: number) => ({
      id: `evidence-${index}`,
      type: 'data' as const,
      content: e.content,
      source: e.source,
      relevance: e.relevance,
    }))

    const reasoningStep: ReasoningStep = {
      agent: 'retrieval',
      action: 'Data Collection',
      input: `Query: ${hypothesis.statement}`,
      output: `Retrieved ${evidence.length} relevant data points`,
      reasoning: result.reasoning,
      confidence: result.confidence,
      timestamp: new Date(),
    }

    return { evidence, reasoning: reasoningStep }
  } catch (error) {
    console.error('Retrieval agent error:', error)
    throw new Error('Failed to retrieve relevant data')
  }
}

/**
 * Analysis Agent - Performs statistical analysis
 */
async function analysisAgent(
  hypothesis: HypothesisModel,
  retrievalResult: { evidence: Evidence[]; reasoning: ReasoningStep }
): Promise<{ evidence: Evidence[]; reasoning: ReasoningStep[] }> {
  const prompt = `You are a statistical analysis agent for scientific research. Your task is to analyze data and determine if it supports or refutes a hypothesis.

Hypothesis: ${hypothesis.statement}

Expected Outcome: ${hypothesis.expectedOutcome}

Evidence Found:
${retrievalResult.evidence.map((e, i) => `${i + 1}. ${e.content} (Relevance: ${e.relevance})`).join('\n')}

Task: Perform statistical analysis on this evidence:
1. Identify patterns and correlations
2. Calculate statistical significance
3. Determine if the evidence supports the hypothesis
4. Provide confidence score

Return your analysis in JSON format:
{
  "analysis": "Your detailed statistical analysis",
  "patterns": ["Pattern 1", "Pattern 2"],
  "statisticalSignificance": "p-value and interpretation",
  "supportsHypothesis": true/false,
  "confidence": 0.85,
  "additionalEvidence": [
    {
      "content": "Analysis finding",
      "source": "Statistical Analysis",
      "relevance": 0.9
    }
  ]
}`

  try {
    const response = await callAzureOpenAI(prompt, 'analysis')

    const result = JSON.parse(response)

    const analysisEvidence: Evidence = {
      id: 'analysis-evidence',
      type: 'analysis',
      content: result.analysis,
      source: 'DeepParallel Statistical Analysis Agent',
      relevance: result.confidence,
    }

    const reasoningStep: ReasoningStep = {
      agent: 'analysis',
      action: 'Statistical Analysis',
      input: `${retrievalResult.evidence.length} evidence items`,
      output: result.statisticalSignificance,
      reasoning: result.analysis,
      confidence: result.confidence,
      timestamp: new Date(),
    }

    return {
      evidence: [...retrievalResult.evidence, analysisEvidence],
      reasoning: [retrievalResult.reasoning, reasoningStep],
    }
  } catch (error) {
    console.error('Analysis agent error:', error)
    throw new Error('Failed to analyze data')
  }
}

/**
 * Synthesis Agent - Generates final conclusion
 */
async function synthesisAgent(
  hypothesis: HypothesisModel,
  analysisResult: { evidence: Evidence[]; reasoning: ReasoningStep[] }
): Promise<TestHypothesisResult> {
  const prompt = `You are a synthesis agent for scientific research. Your task is to integrate all findings and generate a comprehensive conclusion.

Hypothesis: ${hypothesis.statement}

Expected Outcome: ${hypothesis.expectedOutcome}

Evidence Collected:
${analysisResult.evidence.map((e, i) => `${i + 1}. [${e.type}] ${e.content} (Relevance: ${e.relevance})`).join('\n')}

Reasoning Steps:
${analysisResult.reasoning.map((r, i) => `${i + 1}. ${r.agent}: ${r.reasoning} (Confidence: ${r.confidence})`).join('\n')}

Task: Synthesize all evidence and reasoning to:
1. Determine overall confidence in the hypothesis
2. Provide a clear conclusion
3. Suggest relevant citations (if applicable)
4. Explain the reasoning process

Return your synthesis in JSON format:
{
  "conclusion": "Clear statement of whether hypothesis is supported",
  "overallConfidence": 0.89,
  "reasoning": "Explanation of how you reached this conclusion",
  "keyFindings": ["Finding 1", "Finding 2"],
  "citations": [
    {
      "title": "Relevant paper title",
      "authors": ["Author 1", "Author 2"],
      "year": 2023,
      "journal": "Journal name",
      "doi": "10.xxxx/xxxxx"
    }
  ]
}`

  try {
    const response = await callAzureOpenAI(prompt, 'synthesis')

    const result = JSON.parse(response)

    const synthesisStep: ReasoningStep = {
      agent: 'synthesis',
      action: 'Evidence Integration',
      input: `${analysisResult.evidence.length} evidence items + ${analysisResult.reasoning.length} reasoning steps`,
      output: result.conclusion,
      reasoning: result.reasoning,
      confidence: result.overallConfidence,
      timestamp: new Date(),
    }

    const citations: Citation[] = result.citations.map((c: any, index: number) => ({
      id: `citation-${index}`,
      title: c.title,
      authors: c.authors,
      journal: c.journal,
      year: c.year,
      doi: c.doi,
    }))

    return {
      confidence: result.overallConfidence,
      evidence: analysisResult.evidence,
      reasoning: [...analysisResult.reasoning, synthesisStep],
      citations,
    }
  } catch (error) {
    console.error('Synthesis agent error:', error)
    throw new Error('Failed to synthesize results')
  }
}

/**
 * Call Azure OpenAI API
 */
async function callAzureOpenAI(prompt: string, agentType: string): Promise<string> {
  const useAzure = process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY

  if (!useAzure) {
    throw new Error('Azure OpenAI is not configured')
  }

  const apiUrl = `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.AZURE_OPENAI_API_KEY!,
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: `You are a ${agentType} agent in a multi-agent scientific reasoning system. Always respond with valid JSON.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Azure OpenAI API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}
