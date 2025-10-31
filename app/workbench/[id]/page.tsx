"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, Play, Pause, Settings, Share2, Download, 
  Database, FlaskConical, Lightbulb, TrendingUp, Upload,
  Plus, Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"
import { useSessionStore } from "@/lib/stores/session-store"
import { useDataStore } from "@/lib/stores/data-store"
import { useHypothesisStore } from "@/lib/stores/hypothesis-store"
import { DataUpload } from "@/components/workbench/data-upload"
import { DatasetList } from "@/components/workbench/dataset-list"
import { HypothesisBuilder } from "@/components/workbench/hypothesis-builder"
import { HypothesisCard } from "@/components/workbench/hypothesis-card"
import { HypothesisResults } from "@/components/workbench/hypothesis-results"

type TabType = "overview" | "data" | "experiments" | "hypotheses" | "insights"

export default function SessionWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  
  const { currentSession, setCurrentSession, fetchSessions, pauseSession, resumeSession } = useSessionStore()
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/workbench/sessions/${sessionId}`)
        if (response.ok) {
          const session = await response.json()
          setCurrentSession(session)
        } else {
          router.push('/workbench')
        }
      } catch (error) {
        console.error('Failed to load session:', error)
        router.push('/workbench')
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [sessionId, router, setCurrentSession])

  const handleToggleStatus = async () => {
    if (!currentSession) return
    
    if (currentSession.status === 'active') {
      await pauseSession(currentSession.id)
    } else {
      await resumeSession(currentSession.id)
    }
    
    // Reload session
    const response = await fetch(`/api/workbench/sessions/${sessionId}`)
    if (response.ok) {
      const session = await response.json()
      setCurrentSession(session)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/5 flex items-center justify-center">
        <AIAvatarSwirl state="thinking" size={80} />
      </div>
    )
  }

  if (!currentSession) {
    return null
  }

  const typeConfig = {
    "contamination-analysis": { icon: "🔬", color: "from-red-500 to-orange-500" },
    "substrate-optimization": { icon: "🧪", color: "from-green-500 to-emerald-500" },
    "yield-prediction": { icon: "📊", color: "from-blue-500 to-cyan-500" },
    "species-identification": { icon: "🍄", color: "from-purple-500 to-pink-500" },
  }

  const config = typeConfig[currentSession.type]

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "data", label: "Data", icon: Database, count: currentSession.datasets },
    { id: "experiments", label: "Experiments", icon: FlaskConical },
    { id: "hypotheses", label: "Hypotheses", icon: Lightbulb, count: currentSession.hypotheses },
    { id: "insights", label: "Insights", icon: TrendingUp, count: currentSession.insights },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/5">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/workbench"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Workbench
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{config.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {currentSession.title}
                </h1>
                <p className="text-sm text-muted-foreground mb-3">
                  {currentSession.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      currentSession.status === 'active' ? 'bg-green-500 animate-pulse' :
                      currentSession.status === 'paused' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    {currentSession.status.charAt(0).toUpperCase() + currentSession.status.slice(1)}
                  </span>
                  <span>•</span>
                  <span>{currentSession.lastActivity}</span>
                  <span>•</span>
                  <span>{currentSession.progress}% complete</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleToggleStatus}
              className={`${
                currentSession.status === 'active' 
                  ? 'bg-yellow-500 hover:bg-yellow-600' 
                  : `bg-gradient-to-r ${config.color}`
              }`}
            >
              {currentSession.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Session
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Session
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && <OverviewTab session={currentSession} />}
        {activeTab === "data" && <DataTab session={currentSession} />}
        {activeTab === "experiments" && <ExperimentsTab session={currentSession} />}
        {activeTab === "hypotheses" && <HypothesesTab session={currentSession} />}
        {activeTab === "insights" && <InsightsTab session={currentSession} />}
      </div>
    </div>
  )
}

function OverviewTab({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="glass-card rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Session Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold text-foreground">{session.progress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                style={{ width: `${session.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Datasets</p>
              <p className="text-3xl font-bold text-foreground">{session.datasets}</p>
            </div>
            <Database className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Hypotheses</p>
              <p className="text-3xl font-bold text-foreground">{session.hypotheses}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Insights</p>
              <p className="text-3xl font-bold text-foreground">{session.insights}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-pink-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
            <div>
              <p className="text-foreground">Session created</p>
              <p className="text-muted-foreground text-xs">{session.lastActivity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DataTab({ session }: { session: any }) {
  const [showUpload, setShowUpload] = useState(false)
  const { datasets, fetchDatasets, deleteDataset } = useDataStore()
  const sessionDatasets = datasets.filter(d => d.metadata?.sessionId === session.id)

  useEffect(() => {
    fetchDatasets()
  }, [fetchDatasets])

  if (showUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Upload Dataset</h2>
          <Button variant="outline" onClick={() => setShowUpload(false)}>
            Cancel
          </Button>
        </div>
        <DataUpload
          sessionId={session.id}
          onComplete={() => {
            setShowUpload(false)
            fetchDatasets()
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Datasets</h2>
        <Button className="bg-primary" onClick={() => setShowUpload(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Data
        </Button>
      </div>

      {sessionDatasets.length === 0 ? (
        <div className="glass-card rounded-xl p-12 border border-dashed border-border text-center">
          <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No datasets yet</h3>
          <p className="text-muted-foreground mb-6">
            Upload your first dataset to begin analysis
          </p>
          <Button className="bg-primary" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Dataset
          </Button>
        </div>
      ) : (
        <DatasetList
          datasets={sessionDatasets}
          onDelete={async (id) => {
            await deleteDataset(id)
            fetchDatasets()
          }}
        />
      )}
    </div>
  )
}

function ExperimentsTab({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Experiments</h2>
        <Button className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Experiment
        </Button>
      </div>

      <div className="glass-card rounded-xl p-12 border border-dashed border-border text-center">
        <FlaskConical className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No experiments yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first experiment pipeline
        </p>
        <Button className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Experiment
        </Button>
      </div>
    </div>
  )
}

function HypothesesTab({ session }: { session: any }) {
  const [showBuilder, setShowBuilder] = useState(false)
  const [selectedHypothesis, setSelectedHypothesis] = useState<any>(null)
  const { hypotheses, createHypothesis, testHypothesis, deleteHypothesis, fetchHypotheses } = useHypothesisStore()
  const { datasets } = useDataStore()
  
  // Get datasets for this session
  const sessionDatasets = datasets.filter(d => d.metadata?.sessionId === session.id)

  useEffect(() => {
    fetchHypotheses(session.id)
  }, [session.id, fetchHypotheses])

  const handleCreateHypothesis = async (hypothesisData: any) => {
    const newHypothesis = await createHypothesis(session.id, hypothesisData)
    setShowBuilder(false)
    // Automatically start testing with session datasets
    await testHypothesis(newHypothesis.id, sessionDatasets)
  }

  const handleTestHypothesis = async (id: string) => {
    await testHypothesis(id, sessionDatasets)
  }

  if (selectedHypothesis) {
    return (
      <HypothesisResults
        hypothesis={selectedHypothesis}
        onBack={() => setSelectedHypothesis(null)}
      />
    )
  }

  if (showBuilder) {
    return (
      <HypothesisBuilder
        sessionId={session.id}
        datasets={[]}
        onSave={handleCreateHypothesis}
        onCancel={() => setShowBuilder(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Hypotheses</h2>
        <Button className="bg-primary" onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Hypothesis
        </Button>
      </div>

      {hypotheses.length === 0 ? (
        <div className="glass-card rounded-xl p-12 border border-dashed border-border text-center">
          <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No hypotheses yet</h3>
          <p className="text-muted-foreground mb-6">
            Formulate your first hypothesis for AI-powered testing
          </p>
          <Button className="bg-primary" onClick={() => setShowBuilder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Hypothesis
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hypotheses.map((hypothesis) => (
            <HypothesisCard
              key={hypothesis.id}
              hypothesis={hypothesis}
              onView={() => setSelectedHypothesis(hypothesis)}
              onTest={() => handleTestHypothesis(hypothesis.id)}
              onDelete={() => deleteHypothesis(hypothesis.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function InsightsTab({ session }: { session: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">AI-Generated Insights</h2>

      <div className="glass-card rounded-xl p-12 border border-dashed border-border text-center">
        <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No insights yet</h3>
        <p className="text-muted-foreground">
          Insights will appear as the DeepParallel agents analyze your data
        </p>
      </div>
    </div>
  )
}
