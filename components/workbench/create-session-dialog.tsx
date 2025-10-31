"use client"

import { useState } from "react"
import { X, Microscope, Beaker, TrendingUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIAvatarSwirl } from "@/components/chat/ai-avatar-swirl"

interface CreateSessionDialogProps {
  onClose: () => void
}

const sessionTypes = [
  {
    id: "contamination-analysis",
    title: "Contamination Analysis",
    description: "Identify and analyze contamination patterns with AI-powered vision and reasoning",
    icon: Microscope,
    color: "from-red-500 to-orange-500",
    emoji: "🔬",
  },
  {
    id: "substrate-optimization",
    title: "Substrate Optimization",
    description: "Optimize substrate formulas for maximum yield and efficiency",
    icon: Beaker,
    color: "from-green-500 to-emerald-500",
    emoji: "🧪",
  },
  {
    id: "yield-prediction",
    title: "Yield Prediction",
    description: "Build predictive models for cultivation yields based on environmental factors",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    emoji: "📊",
  },
  {
    id: "species-identification",
    title: "Species Identification",
    description: "Identify mushroom species using advanced computer vision and mycological knowledge",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    emoji: "🍄",
  },
]

export function CreateSessionDialog({ onClose }: CreateSessionDialogProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [step, setStep] = useState<"type" | "details">("type")

  const handleCreate = () => {
    // TODO: Create session via API
    console.log("Creating session:", { type: selectedType, title, description })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl glass-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
          <div className="flex items-center gap-3">
            <AIAvatarSwirl state="thinking" size={48} />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                New Research Session
              </h2>
              <p className="text-sm text-muted-foreground">
                {step === "type" ? "Choose your research type" : "Configure your session"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "type" && (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Select the type of research you want to conduct. The AI will configure specialized reasoning agents for
                your chosen domain.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`text-left p-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      selectedType === type.id
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{type.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Session Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Oyster Mushroom Contamination Study"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you want to research..."
                  rows={4}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                />
              </div>

              <div className="glass-card rounded-lg p-4 border border-accent/30 bg-accent/5">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {sessionTypes.find((t) => t.id === selectedType)?.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {sessionTypes.find((t) => t.id === selectedType)?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The DeepParallel reasoning engine will deploy specialized agents for this research type.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/5">
          <Button variant="outline" onClick={step === "details" ? () => setStep("type") : onClose}>
            {step === "details" ? "Back" : "Cancel"}
          </Button>

          <Button
            onClick={step === "type" ? () => setStep("details") : handleCreate}
            disabled={step === "type" ? !selectedType : !title.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {step === "type" ? "Continue" : "Create Session"}
          </Button>
        </div>
      </div>
    </div>
  )
}
