# Browser Research Setup Guide

This guide explains how to set up browser research capabilities for Crowe Logic AI using Kernel + Browser Use.

## Overview

Crowe Logic AI uses [Browser Use](https://github.com/browser-use/browser-use) with [Kernel](https://kernel.com) to provide AI-powered browser automation for research tasks. This allows the AI to:

- Search the web for information
- Navigate websites and extract data
- Analyze content and synthesize findings
- Provide real-time visual feedback to users

## Architecture

\`\`\`
User Request → Next.js API → Python Backend → Kernel Browser → Browser Use Agent → Results
                                                    ↓
                                            Live View Stream → User Interface
\`\`\`

## Setup Instructions

### 1. Install Python Dependencies

Create a Python backend service for browser automation:

\`\`\`bash
# Create a new directory for the Python service
mkdir python-services
cd python-services

# Initialize Python environment
uv init
uv add kernel browser-use anthropic
\`\`\`

### 2. Create Browser Research Service

Create `python-services/browser_research.py`:

\`\`\`python
from kernel import Kernel
from browser_use import Browser, Agent
from anthropic import Anthropic
import os
import json
import sys

def run_research(task: str):
    """Run browser research using Kernel + Browser Use"""
    
    # Initialize Kernel client
    kernel = Kernel(api_key=os.getenv("ONKERNEL_API_KEY"))
    
    # Create a Kernel browser session
    print(json.dumps({"type": "status", "message": "Creating browser session...", "progress": 10}))
    sys.stdout.flush()
    
    kernel_browser = kernel.browsers.create()
    
    try:
        # Update Browser definition to use Kernel's CDP URL
        browser = Browser(
            cdp_url=kernel_browser.cdp_ws_url,
            headless=False,
            window_size={'width': 1024, 'height': 768},
            viewport={'width': 1024, 'height': 768},
            device_scale_factor=1.0
        )
        
        print(json.dumps({"type": "status", "message": "Initializing AI agent...", "progress": 20}))
        sys.stdout.flush()
        
        # Initialize Anthropic LLM
        llm = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
        # Create Browser Use agent
        agent = Agent(
            task=task,
            llm=llm,
            browser_session=browser
        )
        
        print(json.dumps({"type": "status", "message": "Starting research...", "progress": 30}))
        sys.stdout.flush()
        
        # Run the research
        result = agent.run()
        
        print(json.dumps({
            "type": "complete",
            "progress": 100,
            "message": "Research complete",
            "results": result
        }))
        sys.stdout.flush()
        
    finally:
        # Clean up browser session
        kernel.browsers.delete_by_id(kernel_browser.session_id)

if __name__ == "__main__":
    task = sys.argv[1] if len(sys.argv) > 1 else "Research mushroom cultivation techniques"
    run_research(task)
\`\`\`

### 3. Create API Endpoint

Update `app/api/research/browser/route.ts` to call the Python service:

\`\`\`typescript
import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"

export async function POST(request: NextRequest) {
  try {
    const { query, task } = await request.json()
    
    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    
    // Spawn Python process
    const python = spawn("uv", ["run", "python", "python-services/browser_research.py", query || task])
    
    // Stream output from Python
    python.stdout.on("data", async (data) => {
      const lines = data.toString().split("\n").filter(Boolean)
      for (const line of lines) {
        await writer.write(encoder.encode(`data: ${line}\n\n`))
      }
    })
    
    python.stderr.on("data", async (data) => {
      console.error("[v0] Python error:", data.toString())
    })
    
    python.on("close", async () => {
      await writer.close()
    })
    
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Browser research error:", error)
    return NextResponse.json({ error: "Failed to start browser research" }, { status: 500 })
  }
}
\`\`\`

### 4. Add Environment Variables

Add to your `.env.local`:

\`\`\`bash
ONKERNEL_API_KEY=your_kernel_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
\`\`\`

### 5. Configure Kernel Dashboard

1. Sign up at [kernel.com](https://kernel.com)
2. Create a new project
3. Get your API key from the dashboard
4. Configure browser settings:
   - Viewport: 1024x768
   - Stealth mode: Enabled
   - Live view: Enabled

## Usage

Users can trigger browser research by asking questions like:

- "Research the latest mushroom cultivation techniques"
- "Look up information about contamination prevention"
- "Find the best substrate recipes for oyster mushrooms"

The AI will automatically:
1. Create a Kernel browser session
2. Use Browser Use to navigate and extract information
3. Stream live updates to the user interface
4. Synthesize findings into a clear summary

## Live View

Users can see the browser in action through the research panel, which shows:
- Current browser action (search, navigate, extract)
- Progress percentage
- Real-time status updates
- Final synthesized results

## Benefits

- **No local browser management**: Runs in the cloud
- **Scalability**: Multiple concurrent research sessions
- **Stealth mode**: Avoids detection for web scraping
- **Live view**: Users see exactly what the AI is doing
- **Session persistence**: Can maintain state across requests

## Troubleshooting

### Browser session fails to create
- Check your Kernel API key is valid
- Verify your Kernel account has available browser credits

### Python process errors
- Ensure all dependencies are installed: `uv sync`
- Check Python version compatibility (3.10+)

### Streaming issues
- Verify the API route is properly configured
- Check browser console for connection errors

## Next Steps

- Deploy Python service to production (Railway, Render, etc.)
- Add authentication to browser research API
- Implement rate limiting for research requests
- Add caching for common research queries
