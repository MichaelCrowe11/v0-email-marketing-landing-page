"use client"

import { useState } from "react"
import { useSessionStore } from "@/lib/stores/session-store"
import { Button } from "@/components/ui/button"
import { Plus, FolderOpen, Trash2, Edit, Users, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export function SessionManager() {
  const { sessions, createSession, deleteSession, loadSession } = useSessionStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newSessionName, setNewSessionName] = useState('')
  const [newSessionDescription, setNewSessionDescription] = useState('')

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return
    
    await createSession(newSessionName, newSessionDescription)
    setNewSessionName('')
    setNewSessionDescription('')
    setShowCreateDialog(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <div>
      {/* Session Grid */}
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => loadSession(session.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-500 transition-colors">
                    {session.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {session.description || 'No description'}
                  </p>
                </div>
                <FolderOpen className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(session.modified)}</span>
                  </div>
                  {session.collaborators.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{session.collaborators.length}</span>
                    </div>
                  )}
                </div>

                {session.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{session.datasets.length} datasets</span>
                  <span>{session.experiments.length} experiments</span>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Implement edit
                    }}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSession(session.id)
                    }}
                    className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6">
            <Plus className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Research Sessions Yet</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Create your first research session to start analyzing mycological data with AI-powered reasoning
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Session
          </Button>
        </div>
      )}

      {/* Create Session Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-semibold mb-4">Create Research Session</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Session Name</label>
                <input
                  type="text"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g., Oyster Mushroom Growth Analysis"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                <textarea
                  value={newSessionDescription}
                  onChange={(e) => setNewSessionDescription(e.target.value)}
                  placeholder="Describe your research goals..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleCreateSession}
                disabled={!newSessionName.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Create Session
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false)
                  setNewSessionName('')
                  setNewSessionDescription('')
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
