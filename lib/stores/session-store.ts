import { create } from 'zustand'

export interface ResearchSession {
  id: string
  name: string
  description: string
  owner: string
  collaborators: string[]
  created: Date
  modified: Date
  tags: string[]
  experiments: string[]
  datasets: string[]
  hypotheses: string[]
}

interface SessionStore {
  sessions: ResearchSession[]
  activeSession: ResearchSession | null
  loading: boolean
  error: string | null
  
  // Actions
  createSession: (name: string, description?: string) => Promise<void>
  loadSession: (id: string) => Promise<void>
  updateSession: (id: string, updates: Partial<ResearchSession>) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  setActiveSession: (session: ResearchSession | null) => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSession: null,
  loading: false,
  error: null,

  createSession: async (name: string, description?: string) => {
    set({ loading: true, error: null })
    
    try {
      // TODO: Replace with actual API call
      const newSession: ResearchSession = {
        id: crypto.randomUUID(),
        name,
        description: description || '',
        owner: 'current-user', // TODO: Get from auth
        collaborators: [],
        created: new Date(),
        modified: new Date(),
        tags: [],
        experiments: [],
        datasets: [],
        hypotheses: [],
      }
      
      set((state) => ({
        sessions: [...state.sessions, newSession],
        activeSession: newSession,
        loading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create session',
        loading: false 
      })
    }
  },

  loadSession: async (id: string) => {
    set({ loading: true, error: null })
    
    try {
      // TODO: Replace with actual API call
      const session = get().sessions.find(s => s.id === id)
      
      if (!session) {
        throw new Error('Session not found')
      }
      
      set({ activeSession: session, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load session',
        loading: false 
      })
    }
  },

  updateSession: async (id: string, updates: Partial<ResearchSession>) => {
    set({ loading: true, error: null })
    
    try {
      // TODO: Replace with actual API call
      set((state) => ({
        sessions: state.sessions.map(s => 
          s.id === id 
            ? { ...s, ...updates, modified: new Date() }
            : s
        ),
        activeSession: state.activeSession?.id === id
          ? { ...state.activeSession, ...updates, modified: new Date() }
          : state.activeSession,
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
      // TODO: Replace with actual API call
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id),
        activeSession: state.activeSession?.id === id ? null : state.activeSession,
        loading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete session',
        loading: false 
      })
    }
  },

  setActiveSession: (session: ResearchSession | null) => {
    set({ activeSession: session })
  },
}))
