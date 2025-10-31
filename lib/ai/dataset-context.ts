import { Dataset, DataRecord } from '@/lib/types/workbench'

/**
 * Prepare dataset context for AI analysis
 */
export function prepareDatasetContext(datasets: Dataset[]): string {
  if (datasets.length === 0) {
    return 'No datasets available for analysis.'
  }

  const context = datasets.map((dataset, index) => {
    const summary = generateDatasetSummary(dataset)
    const sample = generateDatasetSample(dataset)

    return `
Dataset ${index + 1}: ${dataset.name}
Format: ${dataset.format}
Records: ${dataset.records.length}
${summary}

Sample Data:
${sample}
`
  }).join('\n---\n')

  return context
}

/**
 * Generate statistical summary of dataset
 */
function generateDatasetSummary(dataset: Dataset): string {
  const { records, format } = dataset

  if (format === 'fasta' || format === 'genbank') {
    // Sequence data summary
    const lengths = records.map(r => r.data.length || 0)
    const totalLength = lengths.reduce((sum, len) => sum + len, 0)
    const avgLength = Math.round(totalLength / lengths.length)
    const minLength = Math.min(...lengths)
    const maxLength = Math.max(...lengths)

    return `Sequence Statistics:
- Total sequences: ${records.length}
- Average length: ${avgLength} bp
- Length range: ${minLength} - ${maxLength} bp`
  } else {
    // Tabular data summary
    if (records.length === 0) return 'No records'

    const columns = Object.keys(records[0].data)
    const numericColumns = columns.filter(col => {
      const values = records.map(r => r.data[col]).filter(v => v !== null && v !== undefined)
      return values.length > 0 && !isNaN(Number(values[0]))
    })

    const stats = numericColumns.map(col => {
      const values = records.map(r => Number(r.data[col])).filter(v => !isNaN(v))
      const sum = values.reduce((a, b) => a + b, 0)
      const avg = sum / values.length
      const min = Math.min(...values)
      const max = Math.max(...values)

      return `  ${col}: avg=${avg.toFixed(2)}, min=${min}, max=${max}`
    })

    return `Columns: ${columns.join(', ')}
Numeric Statistics:
${stats.join('\n') || '  No numeric columns'}`
  }
}

/**
 * Generate sample data from dataset
 */
function generateDatasetSample(dataset: Dataset, maxRecords: number = 5): string {
  const { records, format } = dataset

  if (records.length === 0) {
    return 'No data available'
  }

  const sampleRecords = records.slice(0, maxRecords)

  if (format === 'fasta' || format === 'genbank') {
    // Sequence data sample
    return sampleRecords.map((record, index) => {
      const sequence = record.data.sequence || ''
      const truncated = sequence.length > 60 ? `${sequence.substring(0, 60)}...` : sequence
      return `${index + 1}. ${record.data.header || 'Sequence'} (${record.data.length || 0} bp)
   ${truncated}`
    }).join('\n')
  } else {
    // Tabular data sample
    const columns = Object.keys(sampleRecords[0].data)
    const header = columns.join('\t')
    const rows = sampleRecords.map(record => 
      columns.map(col => {
        const value = record.data[col]
        if (value === null || value === undefined) return '-'
        if (typeof value === 'string' && value.length > 30) {
          return `${value.substring(0, 30)}...`
        }
        return String(value)
      }).join('\t')
    )

    return `${header}\n${rows.join('\n')}`
  }
}

/**
 * Extract relevant data based on hypothesis variables
 */
export function extractRelevantData(
  datasets: Dataset[],
  variableNames: string[]
): { dataset: string; records: any[] }[] {
  return datasets.map(dataset => {
    const relevantRecords = dataset.records
      .filter(record => {
        // Check if record contains any of the variables
        const recordKeys = Object.keys(record.data).map(k => k.toLowerCase())
        return variableNames.some(varName => 
          recordKeys.some(key => key.includes(varName.toLowerCase()))
        )
      })
      .slice(0, 100) // Limit to 100 records per dataset

    return {
      dataset: dataset.name,
      records: relevantRecords.map(r => r.data),
    }
  }).filter(result => result.records.length > 0)
}

/**
 * Calculate basic statistics for numeric columns
 */
export function calculateStatistics(data: any[], column: string): {
  mean: number
  median: number
  stdDev: number
  min: number
  max: number
  count: number
} | null {
  const values = data
    .map(row => Number(row[column]))
    .filter(v => !isNaN(v))

  if (values.length === 0) return null

  const sorted = [...values].sort((a, b) => a - b)
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = sum / values.length
  const median = sorted[Math.floor(sorted.length / 2)]
  
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  const stdDev = Math.sqrt(variance)

  return {
    mean,
    median,
    stdDev,
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length,
  }
}

/**
 * Calculate correlation between two numeric columns
 */
export function calculateCorrelation(
  data: any[],
  column1: string,
  column2: string
): number | null {
  const pairs = data
    .map(row => ({
      x: Number(row[column1]),
      y: Number(row[column2]),
    }))
    .filter(pair => !isNaN(pair.x) && !isNaN(pair.y))

  if (pairs.length < 2) return null

  const n = pairs.length
  const sumX = pairs.reduce((sum, p) => sum + p.x, 0)
  const sumY = pairs.reduce((sum, p) => sum + p.y, 0)
  const sumXY = pairs.reduce((sum, p) => sum + p.x * p.y, 0)
  const sumX2 = pairs.reduce((sum, p) => sum + p.x * p.x, 0)
  const sumY2 = pairs.reduce((sum, p) => sum + p.y * p.y, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  if (denominator === 0) return null

  return numerator / denominator
}
