"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code, FileText, MessageSquare, Download, Share2, Settings, PanelLeftClose, PanelRightClose } from "lucide-react"
import Image from "next/image"

type PanelLayout = 'all-three' | 'chat-code' | 'chat-preview' | 'chat-only'
type DocumentType = 'sop' | 'report' | 'business-plan' | null

export default function ChatPage() {
  const [layout, setLayout] = useState<PanelLayout>('chat-only')
  const [documentType, setDocumentType] = useState<DocumentType>(null)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: "Hey! I'm Crowe Logic AI. I can help you with contamination issues, substrate formulas, or generate professional documents like SOPs and reports. What do you need?"
    }
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsGenerating(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant' as const,
        content: "I can help with that. Would you like me to generate a document for this?"
      }
      setMessages(prev => [...prev, aiMessage])
      setIsGenerating(false)
    }, 1000)
  }

  const startDocumentGeneration = (type: DocumentType) => {
    setDocumentType(type)
    setLayout('all-three')
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Great! I'll generate a ${type === 'sop' ? 'Standard Operating Procedure' : type === 'report' ? 'Analysis Report' : 'Business Plan'} for you. Let me gather some details...`
    }])
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Image src="/crowe-avatar.png" alt="Crowe Logic AI" width={40} height={40} className="rounded-full" />
          <div>
            <h1 className="font-semibold text-foreground">Crowe Logic AI</h1>
            <p className="text-xs text-muted-foreground">20+ years cultivation expertise</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Document Generation Buttons */}
          {layout === 'chat-only' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startDocumentGeneration('sop')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate SOP
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startDocumentGeneration('report')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </>
          )}
          
          {/* Layout Controls */}
          {layout !== 'chat-only' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout(layout === 'all-three' ? 'chat-preview' : 'all-three')}
                title="Toggle code panel"
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout(layout === 'all-three' ? 'chat-code' : 'all-three')}
                title="Toggle preview panel"
              >
                <PanelRightClose className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLayout('chat-only')
                  setDocumentType(null)
                }}
              >
                Close Workspace
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Code/Markdown Editor */}
        {(layout === 'all-three' || layout === 'chat-code') && (
          <div className="w-1/3 border-r border-border bg-gray-900 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-gray-200">Markdown Source</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                Copy
              </Button>
            </div>
            
            <div className="flex-1 p-4 font-mono text-sm overflow-auto">
              <div className="space-y-1 text-gray-300">
                <div className="text-green-400"># Standard Operating Procedure</div>
                <div className="text-purple-400">## Substrate Preparation</div>
                <div className="text-gray-500">// Generated by Crowe Logic AI</div>
                <div className="text-gray-400"></div>
                <div className="text-cyan-400">### Materials</div>
                <div>- Hardwood sawdust: 50%</div>
                <div>- Wheat bran: 20%</div>
                <div className="text-pink-400 animate-pulse">|</div>
              </div>
            </div>
          </div>
        )}

        {/* Center Panel: Chat Interface */}
        <div className={`flex flex-col ${layout === 'chat-only' ? 'flex-1' : layout === 'all-three' ? 'w-1/3' : 'flex-1'}`}>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <Image
                    src="/crowe-avatar.png"
                    alt="Crowe Logic AI"
                    width={32}
                    height={32}
                    className="rounded-full h-8"
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex gap-3">
                <Image
                  src="/crowe-avatar.png"
                  alt="Crowe Logic AI"
                  width={32}
                  height={32}
                  className="rounded-full h-8"
                />
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Crowe Logic AI anything..."
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button onClick={handleSendMessage} disabled={!input.trim() || isGenerating}>
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel: Document Preview */}
        {(layout === 'all-three' || layout === 'chat-preview') && (
          <div className="w-1/3 border-l border-border bg-white flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-900">Document Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-8 overflow-auto">
              <div className="mb-6 pb-4 border-b-2 border-purple-600">
                <div className="flex items-center justify-between mb-4">
                  <Image src="/crowe-logic-logo.png" alt="Crowe Logic" width={50} height={50} className="rounded-full" />
                  <div className="text-right text-xs text-gray-500">
                    <p>Doc ID: CL-SOP-001</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Standard Operating Procedure</h1>
                <h2 className="text-lg font-semibold text-purple-600">Substrate Preparation</h2>
              </div>

              <div className="space-y-4 text-gray-800 text-sm">
                <section>
                  <h3 className="font-bold text-gray-900 mb-2">Materials</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Hardwood sawdust: 50%</li>
                    <li>Wheat bran: 20%</li>
                    <li className="text-gray-400 italic">Generating...</li>
                  </ul>
                </section>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p className="font-semibold text-purple-600">Crowe Logic AI</p>
                <p>© {new Date().getFullYear()} Southwest Mushrooms</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
