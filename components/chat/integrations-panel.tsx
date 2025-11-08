"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  config?: Record<string, string>
}

export function IntegrationsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "notion",
      name: "Notion",
      description: "Connect to your Notion workspace for cultivation notes and research",
      icon: "📝",
      connected: false,
    },
    {
      id: "google-sheets",
      name: "Google Sheets",
      description: "Sync cultivation data and tracking spreadsheets",
      icon: "📊",
      connected: false,
    },
    {
      id: "airtable",
      name: "Airtable",
      description: "Manage strain libraries and cultivation records",
      icon: "🗂️",
      connected: false,
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get cultivation alerts and notifications",
      icon: "💬",
      connected: false,
    },
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [apiKey, setApiKey] = useState("")

  const handleConnect = () => {
    if (selectedIntegration && apiKey) {
      setIntegrations((prev) =>
        prev.map((int) => (int.id === selectedIntegration.id ? { ...int, connected: true, config: { apiKey } } : int)),
      )
      setSelectedIntegration(null)
      setApiKey("")
    }
  }

  const handleDisconnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) => (int.id === id ? { ...int, connected: false, config: undefined } : int)),
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg text-foreground">External Integrations</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Connect external services to enhance your cultivation workflow
            </p>
          </DialogHeader>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <h3 className="font-medium text-foreground">{integration.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{integration.description}</p>
                      {integration.connected && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {integration.connected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                        className="text-xs"
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntegration(integration)}
                        className="text-xs"
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base text-foreground">Connect {selectedIntegration?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">API Key / Access Token</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Your API key will be stored securely and used to access {selectedIntegration?.name} on your behalf.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConnect} className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600">
                Connect
              </Button>
              <Button variant="outline" onClick={() => setSelectedIntegration(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
