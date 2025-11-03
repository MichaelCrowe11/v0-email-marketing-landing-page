"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  Database,
  Dna,
  Microscope,
  CheckCircle,
  AlertCircle,
  X,
  Play,
  Pause,
  RotateCcw,
  Zap,
} from "lucide-react"

interface DatasetFile {
  id: string
  name: string
  size: number
  type: 'genome' | 'species' | 'chemical' | 'cultivation' | 'image' | 'other'
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  preview?: any
  metadata?: {
    records?: number
    species?: string[]
    compounds?: number
    timeRange?: string
  }
}

interface AnalysisResult {
  type: string
  confidence: number
  insights: string[]
  recommendations: string[]
}

const fileTypeConfig = {
  genome: {
    icon: Dna,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    formats: ['.fasta', '.fa', '.seq', '.gb'],
    description: "Genomic sequences and DNA data"
  },
  species: {
    icon: Microscope,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
    formats: ['.csv', '.xlsx', '.tsv'],
    description: "Species identification and taxonomy"
  },
  chemical: {
    icon: Zap,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    formats: ['.sdf', '.mol', '.csv', '.json'],
    description: "Chemical compounds and metabolites"
  },
  cultivation: {
    icon: Database,
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    formats: ['.csv', '.json', '.xlsx'],
    description: "Growth conditions and yield data"
  },
  image: {
    icon: FileText,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-400",
    formats: ['.jpg', '.png', '.tiff', '.microscopy'],
    description: "Microscopy and morphology images"
  },
  other: {
    icon: FileText,
    color: "from-gray-500 to-slate-600",
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-400",
    formats: ['.*'],
    description: "Other research data"
  }
}

export function MushroomDatasetUploader() {
  const [files, setFiles] = useState<DatasetFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [totalProgress, setTotalProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const detectFileType = (fileName: string): keyof typeof fileTypeConfig => {
    const ext = fileName.toLowerCase().split('.').pop()

    if (['.fasta', '.fa', '.seq', '.gb'].some(format => fileName.includes(format))) return 'genome'
    if (['.sdf', '.mol'].some(format => fileName.includes(format))) return 'chemical'
    if (['.jpg', '.png', '.tiff'].some(format => fileName.includes(format))) return 'image'
    if (['.csv', '.xlsx', '.tsv'].some(format => fileName.includes(format))) {
      // Smart detection based on filename
      if (fileName.toLowerCase().includes('species') || fileName.toLowerCase().includes('taxonomy')) return 'species'
      if (fileName.toLowerCase().includes('compound') || fileName.toLowerCase().includes('metabolite')) return 'chemical'
      if (fileName.toLowerCase().includes('cultivation') || fileName.toLowerCase().includes('yield')) return 'cultivation'
      return 'species' // default for structured data
    }
    return 'other'
  }

  const generateMetadata = (file: File, type: keyof typeof fileTypeConfig) => {
    // Simulate metadata extraction
    const baseMetadata = {
      records: Math.floor(Math.random() * 10000) + 1000,
      timeRange: "2020-2024"
    }

    switch (type) {
      case 'genome':
        return {
          ...baseMetadata,
          species: ['Pleurotus ostreatus', 'Shiitake', 'Agaricus bisporus'],
        }
      case 'species':
        return {
          ...baseMetadata,
          species: Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, i) => `Species_${i + 1}`),
        }
      case 'chemical':
        return {
          ...baseMetadata,
          compounds: Math.floor(Math.random() * 500) + 100,
        }
      case 'cultivation':
        return {
          ...baseMetadata,
          records: Math.floor(Math.random() * 5000) + 500,
        }
      default:
        return baseMetadata
    }
  }

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: DatasetFile[] = Array.from(fileList).map((file) => {
      const type = detectFileType(file.name)
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type,
        status: 'pending',
        progress: 0,
        metadata: generateMetadata(file, type),
      }
    })

    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const startProcessing = useCallback((fileId: string) => {
    setFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, status: 'uploading' } : file
    ))

    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId && file.status === 'uploading') {
          const newProgress = Math.min(file.progress + Math.random() * 10, 100)
          const newStatus = newProgress >= 100 ? 'processing' : 'uploading'

          if (newProgress >= 100 && file.status === 'uploading') {
            setTimeout(() => {
              setFiles(p => p.map(f =>
                f.id === fileId ? { ...f, status: 'completed' } : f
              ))
            }, 2000)
          }

          return { ...file, progress: newProgress, status: newStatus }
        }
        return file
      }))
    }, 200)

    setTimeout(() => clearInterval(interval), 8000)
  }, [])

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const results: AnalysisResult[] = [
        {
          type: "Species Identification",
          confidence: 94.7,
          insights: [
            "Detected 23 unique mushroom species",
            "High-confidence matches for Pleurotus and Shiitake varieties",
            "Novel strain variations identified in dataset"
          ],
          recommendations: [
            "Focus on Pleurotus ostreatus cultivation optimization",
            "Investigate genetic markers for enhanced yield traits"
          ]
        },
        {
          type: "Genomic Analysis",
          confidence: 88.2,
          insights: [
            "Complete genome sequences for 12 species",
            "Identified 847 bioactive compound pathways",
            "Strong correlation between genetic markers and yield performance"
          ],
          recommendations: [
            "Sequence remaining partial genomes",
            "Validate bioactive compound predictions in lab"
          ]
        },
        {
          type: "Cultivation Optimization",
          confidence: 96.1,
          insights: [
            "Optimal pH range: 6.2-6.8 for maximum yield",
            "Temperature cycles significantly impact fruiting",
            "Substrate composition affects bioactive compound production"
          ],
          recommendations: [
            "Implement pH monitoring in cultivation protocol",
            "Test temperature cycling strategies"
          ]
        }
      ]

      setAnalysisResults(results)
      setIsAnalyzing(false)
    }, 5000)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const completedFiles = files.filter(f => f.status === 'completed')
  const hasFiles = files.length > 0
  const canAnalyze = completedFiles.length > 0

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-muted-foreground/20 bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12">
          <div
            className={`text-center transition-all duration-300 ${
              isDragging ? 'scale-105 opacity-80' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <motion.div
              className="mx-auto mb-6 relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-white" />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-cyan-500/30 rounded-full animate-ping" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-4">Upload Your Mushroom Datasets</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Drag and drop your research files or click to browse. We support genomic data, species records,
              chemical profiles, and cultivation data up to 30GB.
            </p>

            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="mb-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            >
              Choose Files
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".csv,.json,.fasta,.fa,.seq,.sdf,.mol,.xlsx,.tsv,.jpg,.png,.tiff"
            />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              {Object.entries(fileTypeConfig).filter(([key]) => key !== 'other').map(([type, config]) => {
                const Icon = config.icon
                return (
                  <div key={type} className={`p-4 rounded-lg ${config.bgColor} border border-white/10`}>
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${config.textColor}`} />
                    <h4 className="font-semibold text-sm mb-1 capitalize">{type}</h4>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {config.formats.slice(0, 2).join(', ')}
                      {config.formats.length > 2 && '...'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <AnimatePresence>
        {hasFiles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Uploaded Files ({files.length})</h3>
              {canAnalyze && (
                <Button
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              {files.map((file) => {
                const config = fileTypeConfig[file.type]
                const Icon = config.icon

                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-card border rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${config.bgColor}`}>
                        <Icon className={`w-6 h-6 ${config.textColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium truncate">{file.name}</h4>
                          <Badge variant="outline" className={config.textColor}>
                            {file.type}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground mb-3">
                          {formatFileSize(file.size)} • {file.metadata?.records?.toLocaleString()} records
                          {file.metadata?.species && ` • ${file.metadata.species.length} species`}
                          {file.metadata?.compounds && ` • ${file.metadata.compounds} compounds`}
                        </div>

                        {file.status !== 'pending' && (
                          <div className="space-y-2">
                            <Progress value={file.progress} className="h-2" />
                            <div className="flex items-center gap-2 text-sm">
                              {file.status === 'uploading' && <span>Uploading... {file.progress.toFixed(0)}%</span>}
                              {file.status === 'processing' && (
                                <>
                                  <RotateCcw className="w-4 h-4 animate-spin" />
                                  <span>Processing with AI agents...</span>
                                </>
                              )}
                              {file.status === 'completed' && (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-green-500">Ready for analysis</span>
                                </>
                              )}
                              {file.status === 'error' && (
                                <>
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                  <span className="text-red-500">Upload failed</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {file.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => startProcessing(file.id)}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {(isAnalyzing || analysisResults.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">AI Analysis Results</h3>

            {isAnalyzing && (
              <Card>
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h4 className="text-lg font-semibold mb-2">Analyzing Your Datasets</h4>
                  <p className="text-muted-foreground">
                    Our AI agents are processing your data with DeepParallel reasoning...
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6">
              {analysisResults.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{result.type}</CardTitle>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">
                          {result.confidence}% Confidence
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2 text-cyan-400">Key Insights</h5>
                        <ul className="space-y-1">
                          {result.insights.map((insight, j) => (
                            <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2 text-purple-400">Recommendations</h5>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, j) => (
                            <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Zap className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}