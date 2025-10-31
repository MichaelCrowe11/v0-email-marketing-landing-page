import { create } from 'zustand'

export interface ResearchSession {
  id: string
  title: string
  description: string
  type: "contamination-analysis" | "substrate-optimization" | "yield-prediction" | "species-identification"
  status: "active" | "paused" | "completed"
  progress: number
  lastActivity: string
  datasets: number
  hypotheses: number
  insights: number
  createdAt: Date
  updatedAt: Date
  userId?: string
}

interface SessionStore {
  sessions: ResearchSession[]
  currentSession: ResearchSession | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchSessions: () => Promise<void>
  createSession: (data: Partial<ResearchSession>) => Promise<ResearchSession>
  updateSession: (id: string, updates: Partial<ResearchSession>) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  setCurrentSession: (session: ResearchSession | null) => void
  pauseSession: (id: string) => Promise<void>
  resumeSession: (id: string) => Promise<void>
  archiveSession: (id: string) => Promise<void>
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,

  fetchSessions: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await fetch('/api/workbench/sessions')
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions')
      }
      
      const sessions = await response.json()
      set({ sessions, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch sessions',
        loading: false 
      })
    }
  },

  createSession: async (data: Partial<ResearchSession>) => {
    set({ loading: true, error: null })
    
    try {
      const response = await fetch('/api/workbench/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create session')
      }
      
      const newSession = await response.json()
      
      set((state) => ({
        sessions: [newSession, ...state.sessions],
        loading: false,
      }))
      
      return newSession
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create session',
        loading: false 
      })
      throw error
    }
  },

  updateSession: async (id: string, updates: Partial<ResearchSession>) => {
    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`/api/workbench/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update session')
      }
      
      const updatedSession = await response.json()
      
      set((state) => ({
        sessions: state.sessions.map(s => s.id === id ? updatedSession : s),
        currentSession: state.currentSession?.id === id ? updatedSession : state.currentSession,
        loading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update session',
        loading: false 
      })
    }
  },

  deleteSession: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`/api/workbench/sessions/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete session')
      }
      
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id),
        currentSession: state.currentSession?.id === id ? null : state.currentSession,
        loading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete session',
        loading: false 
      })
    }
  },

  setCurrentSession: (session: ResearchSession | null) => {
    set({ currentSession: session })
  },

  pauseSession: async (id: string) => {
    await get().updateSession(id, { status: 'paused' })
  },

  resumeSession: async (id: string) => {
    await get().updateSession(id, { status: 'active' })
  },

  archiveSession: async (id: string) => {
    await get().updateSession(id, { status: 'completed' })
  },
}))
