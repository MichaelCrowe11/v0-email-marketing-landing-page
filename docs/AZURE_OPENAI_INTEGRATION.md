# Azure OpenAI Integration - Deep Parallel Workbench

## Overview

The Deep Parallel Workbench now uses **Azure OpenAI** for real AI-powered hypothesis testing with multi-agent reasoning. This replaces the mock data system with actual AI analysis.

## Architecture

### Multi-Agent System

```
Hypothesis Testing Flow:
┌─────────────────────────────────────────────────────────┐
│                  User Creates Hypothesis                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              API: /api/workbench/hypotheses/[id]/test   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           lib/ai/hypothesis-testing.ts                   │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │  1. Retrieval Agent (Cyan/Blue)                │   │
│  │     - Searches datasets                         │   │
│  │     - Extracts relevant data                    │   │
│  │     - Calculates relevance scores               │   │
│  │     - Azure OpenAI Call #1                      │   │
│  └────────────────────────────────────────────────┘   │
│                       │                                  │
│                       ▼                                  │
│  ┌────────────────────────────────────────────────┐   │
│  │  2. Analysis Agent (Purple/Pink)               │   │
│  │     - Statistical analysis                      │   │
│  │     - Pattern recognition                       │   │
│  │     - Confidence calculation                    │   │
│  │     - Azure OpenAI Call #2                      │   │
│  └────────────────────────────────────────────────┘   │
│                       │                                  │
│                       ▼                                  │
│  ┌────────────────────────────────────────────────┐   │
│  │  3. Synthesis Agent (Green/Emerald)            │   │
│  │     - Result aggregation                        │   │
│  │     - Conclusion generation                     │   │
│  │     - Citation formatting                       │   │
│  │     - Azure OpenAI Call #3                      │   │
│  └────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    Results Returned                      │
│  - Confidence Score                                      │
│  - Evidence Items                                        │
│  - Reasoning Steps                                       │
│  - Citations                                             │
└─────────────────────────────────────────────────────────┘
```

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```bash
# Azure OpenAI Configuration (Required)
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_KEY=your-azure-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
```

### Azure OpenAI Setup

1. **Create Azure OpenAI Resource**
   - Go to Azure Portal
   - Create a new Azure OpenAI resource
   - Note the endpoint URL

2. **Deploy a Model**
   - Deploy GPT-4 or GPT-3.5-turbo
   - Note the deployment name
   - Ensure JSON mode is supported

3. **Get API Key**
   - Go to Keys and Endpoint
   - Copy one of the keys

## API Endpoints

### POST /api/workbench/hypotheses/[id]/test

Test a hypothesis using Azure OpenAI multi-agent reasoning.

**Request Body:**
```typescript
{
  hypothesis: HypothesisModel,
  datasets: Dataset[],
  sessionContext?: string
}
```

**Response:**
```typescript
{
  confidence: number,        // 0-1 overall confidence
  evidence: Evidence[],      // Supporting evidence
  reasoning: ReasoningStep[], // Agent reasoning steps
  citations: Citation[]      // Academic citations
}
```

## Agent Details

### 1. Retrieval Agent

**Purpose:** Search datasets for relevant information

**Process:**
1. Receives hypothesis and datasets
2. Prepares dataset context with statistics
3. Extracts relevant data based on variables
4. Calls Azure OpenAI to analyze relevance
5. Returns evidence with relevance scores

**Azure OpenAI Prompt:**
```
You are a data retrieval agent for scientific research.
Task: Search datasets and find relevant information.
Return: JSON with evidence array and reasoning.
```

**Output:**
```typescript
{
  evidence: [
    {
      content: "Finding description",
      source: "Dataset name",
      relevance: 0.95
    }
  ],
  reasoning: "How evidence was found",
  confidence: 0.9
}
```

### 2. Analysis Agent

**Purpose:** Perform statistical analysis

**Process:**
1. Receives evidence from retrieval agent
2. Analyzes patterns and correlations
3. Calculates statistical significance
4. Calls Azure OpenAI for interpretation
5. Returns analysis with confidence

**Azure OpenAI Prompt:**
```
You are a statistical analysis agent.
Task: Analyze evidence and determine support for hypothesis.
Return: JSON with analysis and confidence.
```

**Output:**
```typescript
{
  analysis: "Detailed statistical analysis",
  patterns: ["Pattern 1", "Pattern 2"],
  statisticalSignificance: "p-value interpretation",
  supportsHypothesis: true,
  confidence: 0.85
}
```

### 3. Synthesis Agent

**Purpose:** Generate final conclusion

**Process:**
1. Receives all evidence and reasoning
2. Integrates findings
3. Generates comprehensive conclusion
4. Calls Azure OpenAI for synthesis
5. Returns final results with citations

**Azure OpenAI Prompt:**
```
You are a synthesis agent.
Task: Integrate all findings into comprehensive conclusion.
Return: JSON with conclusion, confidence, and citations.
```

**Output:**
```typescript
{
  conclusion: "Clear statement",
  overallConfidence: 0.89,
  reasoning: "Explanation",
  keyFindings: ["Finding 1", "Finding 2"],
  citations: [...]
}
```

## Dataset Context Preparation

### lib/ai/dataset-context.ts

**Functions:**

1. **prepareDatasetContext(datasets)**
   - Generates human-readable dataset summaries
   - Includes statistics and sample data
   - Formats for AI consumption

2. **extractRelevantData(datasets, variableNames)**
   - Filters records based on hypothesis variables
   - Limits to 100 records per dataset
   - Returns structured data

3. **calculateStatistics(data, column)**
   - Mean, median, standard deviation
   - Min, max, count
   - For numeric columns

4. **calculateCorrelation(data, col1, col2)**
   - Pearson correlation coefficient
   - For numeric column pairs
   - Returns -1 to 1 value

## Usage Example

### 1. Create Hypothesis

```typescript
const hypothesis = {
  statement: "Higher moisture content leads to increased contamination",
  variables: [
    { name: "moisture_content", type: "numeric" },
    { name: "contamination_rate", type: "numeric" }
  ],
  expectedOutcome: "Positive correlation between moisture and contamination"
}
```

### 2. Upload Datasets

```csv
strain,moisture_content,contamination_rate
Oyster-1,60,5
Oyster-2,65,12
Oyster-3,70,23
Oyster-4,75,35
```

### 3. Test Hypothesis

The system automatically:
1. Prepares dataset context
2. Calls Retrieval Agent
3. Calls Analysis Agent
4. Calls Synthesis Agent
5. Returns results

### 4. View Results

```typescript
{
  confidence: 0.89,
  evidence: [
    {
      type: "data",
      content: "Analysis of 4 samples shows strong positive correlation (r=0.98)",
      relevance: 0.95
    }
  ],
  reasoning: [
    {
      agent: "retrieval",
      action: "Data Collection",
      confidence: 0.95
    },
    {
      agent: "analysis",
      action: "Statistical Analysis",
      confidence: 0.91
    },
    {
      agent: "synthesis",
      action: "Evidence Integration",
      confidence: 0.89
    }
  ]
}
```

## Cost Optimization

### Token Usage

Each hypothesis test makes **3 Azure OpenAI API calls**:

1. **Retrieval Agent:** ~1,500 tokens
2. **Analysis Agent:** ~1,200 tokens
3. **Synthesis Agent:** ~1,000 tokens

**Total:** ~3,700 tokens per hypothesis test

### Cost Estimates (GPT-4)

- Input: $0.03 per 1K tokens
- Output: $0.06 per 1K tokens
- **Cost per test:** ~$0.15-$0.25

### Optimization Strategies

1. **Limit dataset size**
   - Max 100 records per dataset
   - Sample large datasets

2. **Cache results**
   - Store completed tests
   - Reuse for similar hypotheses

3. **Use GPT-3.5-turbo**
   - 10x cheaper than GPT-4
   - Still effective for most analyses

## Error Handling

### Common Errors

1. **Azure OpenAI not configured**
   ```
   Error: Azure OpenAI is not configured
   Solution: Add environment variables
   ```

2. **Invalid JSON response**
   ```
   Error: Failed to parse AI response
   Solution: Check model supports JSON mode
   ```

3. **Rate limit exceeded**
   ```
   Error: 429 Too Many Requests
   Solution: Implement retry logic or reduce frequency
   ```

4. **No datasets available**
   ```
   Warning: Testing without data
   Solution: Upload datasets before testing
   ```

## Testing

### Manual Test

1. Start development server:
   ```bash
   npm run dev
   ```

2. Navigate to workbench:
   ```
   http://localhost:3000/workbench
   ```

3. Create a session

4. Upload a CSV dataset

5. Create a hypothesis

6. Watch AI agents work!

### API Test

```bash
curl -X POST http://localhost:3000/api/workbench/hypotheses/test-id/test \
  -H "Content-Type: application/json" \
  -d '{
    "hypothesis": {
      "statement": "Test hypothesis",
      "variables": [],
      "expectedOutcome": "Test outcome"
    },
    "datasets": []
  }'
```

## Monitoring

### Azure Portal

1. Go to Azure OpenAI resource
2. Click "Metrics"
3. Monitor:
   - Total calls
   - Token usage
   - Latency
   - Errors

### Application Logs

Check console for:
- API call timing
- Token usage
- Error messages
- Agent reasoning

## Future Enhancements

### Planned Features

1. **Streaming Responses**
   - Real-time agent updates
   - Progressive result display

2. **Agent Specialization**
   - Domain-specific agents
   - Custom prompts per research type

3. **Result Caching**
   - Store completed analyses
   - Faster repeat queries

4. **Batch Processing**
   - Test multiple hypotheses
   - Parallel execution

5. **Advanced Statistics**
   - ANOVA, t-tests
   - Regression analysis
   - Machine learning integration

## Troubleshooting

### Issue: No results returned

**Check:**
- Environment variables set correctly
- Azure OpenAI deployment is active
- Model supports JSON mode
- Datasets are uploaded

### Issue: Low confidence scores

**Possible causes:**
- Insufficient data
- Weak correlation
- Hypothesis too broad

**Solutions:**
- Upload more datasets
- Refine hypothesis
- Add more variables

### Issue: Slow response times

**Causes:**
- Large datasets
- Complex analysis
- Azure OpenAI latency

**Solutions:**
- Limit dataset size
- Use GPT-3.5-turbo
- Implement caching

## Security

### Best Practices

1. **Never commit API keys**
   - Use .env.local
   - Add to .gitignore

2. **Rotate keys regularly**
   - Azure Portal → Keys
   - Update environment variables

3. **Monitor usage**
   - Set spending limits
   - Track API calls

4. **Validate inputs**
   - Sanitize user data
   - Limit dataset sizes

---

**Status:** ✅ Azure OpenAI Integration Complete

**Next Steps:** Test with real data and refine prompts based on results
