"use client"

import { useState } from "react"
import { Video, Loader2, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GeneratedVideo {
  url: string
  prompt: string
  duration: number
  timestamp: string
}

export default function VideoStudioPage() {
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Video generation failed")
      }

      setGeneratedVideo({
        url: data.videoUrl,
        prompt: prompt,
        duration: data.duration || 5,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setGenerating(false)
    }
  }

  const examplePrompts = [
    "Time-lapse of oyster mushrooms growing from substrate to harvest",
    "Close-up of mycelium colonizing grain spawn in a jar",
    "Demonstration of proper sterile technique for inoculation",
    "Mushroom fruiting chamber with automated misting system",
  ]

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Video className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-black">Video Studio</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate educational cultivation videos with AI. Powered by Sora for realistic mushroom growing
            demonstrations.
          </p>
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by OpenAI Sora
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Generation Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Create Video</CardTitle>
              <CardDescription>Describe the cultivation video you want to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Prompt</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the mushroom cultivation scene you want to see..."
                  className="min-h-[120px] resize-none"
                  disabled={generating}
                />
              </div>

              <Button onClick={handleGenerate} disabled={generating || !prompt.trim()} className="w-full" size="lg">
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Example Prompts */}
              <div className="space-y-2 pt-4 border-t border-border">
                <p className="text-sm font-medium">Example Prompts</p>
                <div className="space-y-2">
                  {examplePrompts.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left p-3 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                      disabled={generating}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
              <CardDescription>Your generated video will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedVideo && !generating && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-border rounded-lg">
                  <Video className="w-16 h-16 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Generate a video to see it here</p>
                </div>
              )}

              {generating && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-border rounded-lg">
                  <Loader2 className="w-16 h-16 mb-4 text-primary animate-spin" />
                  <p className="text-foreground font-medium mb-2">Generating your video...</p>
                  <p className="text-sm text-muted-foreground">This may take 30-60 seconds</p>
                </div>
              )}

              {generatedVideo && !generating && (
                <div className="space-y-4">
                  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border">
                    <video
                      src={generatedVideo.url}
                      controls
                      className="w-full h-full object-contain"
                      poster="/mushroom-cultivation-video-thumbnail.jpg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Duration: {generatedVideo.duration}s</Badge>
                      <Button variant="outline" size="sm" asChild>
                        <a href={generatedVideo.url} download="cultivation-video.mp4">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Prompt Used:</p>
                      <p className="text-sm text-muted-foreground">{generatedVideo.prompt}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Educational Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate realistic cultivation demonstrations, time-lapses, and technique tutorials for learning.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Marketing Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create compelling product videos, grow room tours, and promotional content for your business.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Document your cultivation processes, contamination cases, and experimental results visually.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
