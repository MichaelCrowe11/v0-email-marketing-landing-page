import { create } from 'zustand'
import { Dataset, DataRecord, ParsedData } from '@/lib/types/workbench'

interface DataStore {
  datasets: Dataset[]
  loading: boolean
  error: string | null
  uploadProgress: number
  
  // Actions
  uploadDataset: (file: File, sessionId: string) => Promise<void>
  deleteDataset: (id: string) => Promise<void>
  getDataset: (id: string) => Dataset | undefined
  updateDataset: (id: string, updates: Partial<Dataset>) => Promise<void>
  parseFile: (file: File) => Promise<ParsedData>
}

export const useDataStore = create<DataStore>((set, get) => ({
  datasets: [],
  loading: false,
  error: null,
  uploadProgress: 0,

  uploadDataset: async (file: File, sessionId: string) => {
    set({ loading: true, error: null, uploadProgress: 0 })
    
    try {
      // Parse the file
      const parsed = await get().parseFile(file)
      
      // Create dataset
      const dataset: Dataset = {
        id: crypto.randomUUID(),
        name: file.name,
        format: getFileFormat(file.name),
        size: file.size,
        uploaded: new Date(),
        metadata: parsed.metadata,
        records: parsed.records,
      }
      
      set((state) => ({
        datasets: [...state.datasets, dataset],
        loading: false,
        uploadProgress: 100,
      }))
      
      // TODO: Upload to S3 and save to database
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload dataset',
        loading: false,
        uploadProgress: 0,
      })
    }
  },

  deleteDataset: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      // TODO: Delete from S3 and database
      set((state) => ({
        datasets: state.datasets.filter(d => d.id !== id),
        loading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete dataset',
        loading: false 
      })
    }
  },

  getDataset: (id: string) => {
    return get().datasets.find(d => d.id === id)
  },

  updateDataset: async (id: string, updates: Partial<Dataset>) => {
    set({ loading: true, error: null })
    
    try {
      // TODO: Update in database
      set((state) => ({
        datasets: state.datasets.map(d => 
          d.id === id ? { ...d, ...updates } : d
        ),
        loading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update dataset',
        loading: false 
      })
    }
  },

  parseFile: async (file: File): Promise<ParsedData> => {
    const format = getFileFormat(file.name)
    
    // Read file content
    const content = await file.text()
    
    // Parse based on format
    switch (format) {
      case 'csv':
        return parseCSV(content)
      case 'json':
        return parseJSON(content)
      case 'fasta':
        return parseFASTA(content)
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  },
}))

// Helper functions
function getFileFormat(filename: string): Dataset['format'] {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'csv':
    case 'tsv':
      return 'csv'
    case 'json':
      return 'json'
    case 'fasta':
    case 'fa':
    case 'fna':
      return 'fasta'
    case 'gb':
    case 'gbk':
      return 'genbank'
    case 'xlsx':
    case 'xls':
      return 'excel'
    default:
      return 'csv'
  }
}

function parseCSV(content: string): ParsedData {
  const lines = content.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) {
    return {
      records: [],
      metadata: {},
      errors: [{ message: 'Empty file', severity: 'error' }],
      warnings: [],
    }
  }
  
  // Parse header
  const headers = lines[0].split(',').map(h => h.trim())
  
  // Parse rows
  const records: DataRecord[] = lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim())
    const data: Record<string, any> = {}
    
    headers.forEach((header, i) => {
      data[header] = values[i] || ''
    })
    
    return {
      id: `record-${index}`,
      data,
    }
  })
  
  return {
    records,
    metadata: {
      columns: headers,
      rowCount: records.length,
    },
    errors: [],
    warnings: [],
  }
}

function parseJSON(content: string): ParsedData {
  try {
    const data = JSON.parse(content)
    
    if (Array.isArray(data)) {
      const records: DataRecord[] = data.map((item, index) => ({
        id: `record-${index}`,
        data: item,
      }))
      
      return {
        records,
        metadata: {
          recordCount: records.length,
        },
        errors: [],
        warnings: [],
      }
    } else {
      return {
        records: [{
          id: 'record-0',
          data,
        }],
        metadata: {},
        errors: [],
        warnings: [],
      }
    }
  } catch (error) {
    return {
      records: [],
      metadata: {},
      errors: [{
        message: error instanceof Error ? error.message : 'Invalid JSON',
        severity: 'error',
      }],
      warnings: [],
    }
  }
}

function parseFASTA(content: string): ParsedData {
  const sequences: DataRecord[] = []
  const lines = content.split('\n')
  
  let currentHeader = ''
  let currentSequence = ''
  
  for (const line of lines) {
    if (line.startsWith('>')) {
      // Save previous sequence
      if (currentHeader) {
        sequences.push({
          id: currentHeader,
          data: {
            header: currentHeader,
            sequence: currentSequence,
            length: currentSequence.length,
          },
        })
      }
      
      // Start new sequence
      currentHeader = line.substring(1).trim()
      currentSequence = ''
    } else {
      currentSequence += line.trim()
    }
  }
  
  // Save last sequence
  if (currentHeader) {
    sequences.push({
      id: currentHeader,
      data: {
        header: currentHeader,
        sequence: currentSequence,
        length: currentSequence.length,
      },
    })
  }
  
  return {
    records: sequences,
    metadata: {
      sequenceCount: sequences.length,
      totalLength: sequences.reduce((sum, s) => sum + s.data.length, 0),
    },
    errors: [],
    warnings: [],
  }
}
