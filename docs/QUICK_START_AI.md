# Quick Start: AI-Powered Hypothesis Testing

## Setup (5 minutes)

### 1. Configure Azure OpenAI

Create `.env.local` in your project root:

```bash
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_KEY=your-azure-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

### 2. Start the Server

```bash
npm run dev
```

### 3. Open the Workbench

Navigate to: `http://localhost:3000/workbench`

## Test the AI System (2 minutes)

### Step 1: Create a Session

1. Click "New Research Session"
2. Select "Substrate Optimization"
3. Enter title: "Moisture Test"
4. Click "Create Session"

### Step 2: Upload Test Data

1. Click "Data" tab
2. Click "Upload Data"
3. Create a test CSV file:

```csv
strain,moisture_content,contamination_rate,yield
Oyster-1,60,5,450
Oyster-2,65,8,480
Oyster-3,70,15,420
Oyster-4,75,25,380
Oyster-5,80,35,320
```

4. Upload the file

### Step 3: Create Hypothesis

1. Click "Hypotheses" tab
2. Click "New Hypothesis"
3. Enter statement:
   ```
   Higher substrate moisture content (>65%) leads to increased contamination rates
   ```
4. Add variables:
   - `moisture_content` (numeric)
   - `contamination_rate` (numeric)
5. Enter expected outcome:
   ```
   We expect to see a positive correlation between moisture content and contamination rates
   ```
6. Click "Create & Test Hypothesis"

### Step 4: Watch the AI Work!

You'll see:
1. Status changes to "Running"
2. Three agents work in sequence:
   - 🔵 Retrieval Agent - Searches data
   - 🟣 Analysis Agent - Analyzes patterns
   - 🟢 Synthesis Agent - Generates conclusion
3. Results appear with confidence score

### Step 5: Explore Results

1. Click "View Results"
2. See:
   - Confidence score (e.g., 89%)
   - Evidence items with relevance
   - Reasoning trace (3 steps)
   - Citations (if applicable)

## What Just Happened?

The system:
1. ✅ Prepared your dataset context
2. ✅ Called Azure OpenAI 3 times (one per agent)
3. ✅ Analyzed your data with AI
4. ✅ Generated evidence-based conclusion
5. ✅ Calculated confidence score

## Next Steps

### Try Different Hypotheses

**Negative Correlation:**
```
Lower moisture content (<65%) leads to higher yields
```

**Categorical Analysis:**
```
Oyster mushroom strains show different contamination resistance
```

**Complex Hypothesis:**
```
The interaction between moisture content and substrate type affects both contamination and yield
```

### Upload More Data

- FASTA sequences for species identification
- JSON data for complex analyses
- Multiple datasets for cross-validation

### Explore Features

- Compare multiple hypotheses
- Export results to PDF
- Share with collaborators

## Troubleshooting

### "Azure OpenAI is not configured"

**Fix:** Check your `.env.local` file has all three variables

### "No datasets available"

**Fix:** Upload data in the Data tab first

### "Failed to test hypothesis"

**Check:**
1. Azure OpenAI deployment is active
2. API key is valid
3. Model supports JSON mode (GPT-4 or GPT-3.5-turbo)

## Cost Estimate

- Each hypothesis test: ~$0.15-$0.25 (GPT-4)
- Or ~$0.01-$0.02 (GPT-3.5-turbo)

## Tips for Best Results

1. **Upload quality data**
   - At least 10-20 records
   - Clean, structured format
   - Relevant variables

2. **Write clear hypotheses**
   - Specific and testable
   - Define variables clearly
   - State expected outcome

3. **Review reasoning traces**
   - Understand AI logic
   - Verify evidence
   - Check confidence scores

## Example Results

```
Hypothesis: Higher moisture content leads to increased contamination

Confidence: 89%

Evidence:
✓ Strong positive correlation (r=0.95, p<0.001)
✓ Each 5% moisture increase = 8% more contamination
✓ Supported by 5 data points

Reasoning:
1. Retrieval: Found 5 relevant records (95% confidence)
2. Analysis: Calculated correlation (91% confidence)
3. Synthesis: Integrated findings (89% confidence)
```

---

**Ready to explore AI-powered research!** 🚀
