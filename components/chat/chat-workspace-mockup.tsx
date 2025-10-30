"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code, FileText, MessageSquare, Download, Share2, Maximize2, Minimize2 } from "lucide-react"
import Image from "next/image"

export function ChatWorkspaceMockup() {
    const [layout, setLayout] = useState<'all-three' | 'chat-code' | 'chat-preview' | 'chat-only'>('all-three')

    return (
        <div className="w-full h-screen bg-background p-4">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-4 p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-3">
                    <Image src="/crowe-avatar.png" alt="Crowe Logic AI" width={40} height={40} className="rounded-full" />
                    <div>
                        <h2 className="font-semibold text-foreground">Document Workspace</h2>
                        <p className="text-sm text-muted-foreground">Generate SOPs, Reports & Business Plans</p>
                    </div>
                </div>

                {/* Layout Controls */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={layout === 'all-three' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLayout('all-three')}
                    >
                        <Code className="w-4 h-4 mr-2" />
                        All Panels
                    </Button>
                    <Button
                        variant={layout === 'chat-code' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLayout('chat-code')}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat + Code
                    </Button>
                    <Button
                        variant={layout === 'chat-preview' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLayout('chat-preview')}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Chat + Preview
                    </Button>
                </div>
            </div>

            {/* Three-Panel Workspace */}
            <div className="flex gap-4 h-[calc(100vh-120px)]">
                {/* Left Panel: Code/Markdown Editor */}
                {(layout === 'all-three' || layout === 'chat-code') && (
                    <div className="flex-1 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm font-semibold text-gray-200">Raw Markdown</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                                <Minimize2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                            <div className="space-y-1">
                                <div className="text-green-400"># Standard Operating Procedure</div>
                                <div className="text-purple-400">## Oyster Mushroom Substrate Preparation</div>
                                <div className="text-gray-400"></div>
                                <div className="text-cyan-400">### Materials Required</div>
                                <div className="text-gray-300">- Hardwood sawdust: 50%</div>
                                <div className="text-gray-300">- Wheat bran: 20%</div>
                                <div className="text-gray-300">- Gypsum: 2%</div>
                                <div className="text-gray-300">- Water: 28%</div>
                                <div className="text-gray-400"></div>
                                <div className="text-cyan-400">### Equipment</div>
                                <div className="text-gray-300">- Mixer (cement mixer or paddle mixer)</div>
                                <div className="text-gray-300">- Autoclave or pressure cooker</div>
                                <div className="text-gray-300">- Polypropylene bags (5lb capacity)</div>
                                <div className="text-gray-400"></div>
                                <div className="text-cyan-400">### Procedure</div>
                                <div className="text-yellow-300">**Step 1: Mixing**</div>
                                <div className="text-gray-300">1. Combine dry ingredients in mixer</div>
                                <div className="text-gray-300">2. Add water gradually while mixing</div>
                                <div className="text-gray-300">3. Mix for 10-15 minutes until uniform</div>
                                <div className="text-gray-400"></div>
                                <div className="text-yellow-300">**Step 2: Bagging**</div>
                                <div className="text-gray-300">1. Fill bags to 5lbs each</div>
                                <div className="text-gray-300">2. Compact substrate firmly</div>
                                <div className="text-pink-400 animate-pulse">|</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Center Panel: Chat Interface */}
                <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Image src="/crowe-avatar.png" alt="Crowe Logic AI" width={32} height={32} className="rounded-full" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                            </div>
                            <span className="text-sm font-semibold text-foreground">Crowe Logic AI</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Generating document...</div>
                    </div>

                    <div className="flex-1 p-4 overflow-auto space-y-4">
                        {/* User Message */}
                        <div className="flex justify-end">
                            <div className="bg-purple-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                                <p className="text-sm">Generate an SOP for oyster mushroom substrate preparation</p>
                            </div>
                        </div>

                        {/* AI Response */}
                        <div className="flex gap-2">
                            <Image src="/crowe-avatar.png" alt="AI" width={32} height={32} className="rounded-full h-8" />
                            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                                <p className="text-sm text-foreground mb-2">
                                    I'll create a comprehensive SOP for you. I'm pulling from my 20 years at Southwest Mushrooms.
                                </p>
                                <p className="text-sm text-foreground">
                                    What batch size are you working with?
                                </p>
                            </div>
                        </div>

                        {/* User Response */}
                        <div className="flex justify-end">
                            <div className="bg-purple-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                                <p className="text-sm">50 pound bags, about 100 bags per batch</p>
                            </div>
                        </div>

                        {/* AI Generating */}
                        <div className="flex gap-2">
                            <Image src="/crowe-avatar.png" alt="AI" width={32} height={32} className="rounded-full h-8" />
                            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                                <p className="text-sm text-foreground mb-3">
                                    Perfect. I'm generating your SOP now with the exact formulation we use at Southwest Mushrooms for commercial production.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                    <span>Writing sections...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask Crowe Logic AI anything..."
                                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                Send
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Document Preview */}
                {(layout === 'all-three' || layout === 'chat-preview') && (
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-semibold text-gray-900">Document Preview</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                    <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                    <Maximize2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-auto bg-white">
                            {/* Document Header */}
                            <div className="mb-8 pb-6 border-b-2 border-purple-600">
                                <div className="flex items-center justify-between mb-4">
                                    <Image src="/crowe-logic-logo.png" alt="Southwest Mushrooms" width={60} height={60} className="rounded-full" />
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Document ID: SOP-2024-001</p>
                                        <p className="text-xs text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Standard Operating Procedure</h1>
                                <h2 className="text-xl font-semibold text-purple-600">Oyster Mushroom Substrate Preparation</h2>
                            </div>

                            {/* Document Content */}
                            <div className="space-y-6 text-gray-800">
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Materials Required</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Hardwood sawdust: 50%</li>
                                        <li>Wheat bran: 20%</li>
                                        <li>Gypsum: 2%</li>
                                        <li>Water: 28%</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Equipment</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Mixer (cement mixer or paddle mixer)</li>
                                        <li>Autoclave or pressure cooker</li>
                                        <li>Polypropylene bags (5lb capacity)</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Procedure</h3>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Step 1: Mixing</h4>
                                        <ol className="list-decimal list-inside space-y-1 text-sm ml-4">
                                            <li>Combine dry ingredients in mixer</li>
                                            <li>Add water gradually while mixing</li>
                                            <li>Mix for 10-15 minutes until uniform</li>
                                        </ol>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Step 2: Bagging</h4>
                                        <ol className="list-decimal list-inside space-y-1 text-sm ml-4">
                                            <li>Fill bags to 5lbs each</li>
                                            <li>Compact substrate firmly</li>
                                            <li className="text-gray-400 italic">Generating...</li>
                                        </ol>
                                    </div>
                                </section>

                                {/* Footer */}
                                <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-500">
                                    <p className="font-semibold text-purple-600">Crowe Logic AI</p>
                                    <p>Powered by 20+ years of commercial cultivation expertise</p>
                                    <p className="mt-1">© {new Date().getFullYear()} Southwest Mushrooms. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
