# Kernel Integration Guide

## Quick Start with Kernel

Kernel provides cloud-hosted browsers with Chrome DevTools Protocol (CDP) support, perfect for AI-powered browser automation with real-time viewing.

### 1. Sign Up for Kernel

Visit [onkernel.com](https://onkernel.com) and create an account.

### 2. Get Your API Key

1. Go to your Kernel dashboard
2. Navigate to Settings → API Keys
3. Create a new API key
4. Add it to your Vercel project environment variables as `ONKERNEL_API_KEY`

### 3. Add Environment Variables

In your Vercel project settings (or Vars section in v0), add:
\`\`\`
ONKERNEL_API_KEY=your_kernel_api_key_here
CDP_WEBSOCKET_URL=wss://api.onkernel.com/browsers/YOUR_BROWSER_ID/cdp
\`\`\`

**Note:** The `CDP_WEBSOCKET_URL` can be either:
- A persistent browser session URL (if you have a long-running browser)
- Dynamically generated per research session (recommended for production)

### 4. Install Kernel SDK (Python Backend)

For the Python backend service:
\`\`\`bash
pip install kernel-sdk
# or with uv
uv add kernel-sdk
\`\`\`

### 5. Create Browser with Live View

\`\`\`python
from kernel import Kernel
import os

# Initialize client
kernel = Kernel(api_key=os.environ["ONKERNEL_API_KEY"])

# Create browser with live view enabled
browser = kernel.browsers.create(
    viewport={'width': 1920, 'height': 1080},
    stealth=True,  # Enable anti-detection
    kiosk_mode=True  # Fullscreen mode without browser UI
)

# Get URLs
cdp_url = browser.cdp_ws_url  # For automation
live_view_url = browser.browser_live_view_url  # For real-time viewing

print(f"Live View: {live_view_url}")
\`\`\`

## Live View Features

### Real-Time Browser Viewing

The `browser_live_view_url` provides a real-time view of the browser as the AI conducts research:

\`\`\`python
browser = kernel.browsers.create()
live_url = browser.browser_live_view_url

# Share this URL or embed in iframe
# Users can watch the AI browse in real-time
\`\`\`

### Query Parameters

Customize the live view with query parameters:

- `readOnly=true` - Non-interactive view (recommended for embedding)
- Example: `https://api.onkernel.com/browser/live/<TOKEN>?readOnly=true`

### Kiosk Mode

Enable fullscreen experience without browser UI elements:

\`\`\`python
browser = kernel.browsers.create(
    viewport={'width': 1920, 'height': 1080},
    kiosk_mode=True
)
\`\`\`

### Embedding Live View

In your Next.js app, embed the live view:

\`\`\`tsx
<iframe
  src={`${liveViewUrl}?readOnly=true`}
  className="w-full h-96"
  title="Browser Live View"
  sandbox="allow-same-origin allow-scripts"
/>
\`\`\`

## Integration with Browser Use

Combine Kernel's live view with Browser Use for AI-powered automation:

\`\`\`python
from kernel import Kernel
from browser_use import Agent

# Create Kernel browser
kernel = Kernel()
browser = kernel.browsers.create(kiosk_mode=True)

# Get live view URL to send to frontend
live_view_url = browser.browser_live_view_url

# Use CDP URL with Browser Use
agent = Agent(
    task="Research mushroom cultivation techniques",
    llm=your_llm,
    browser_config={
        "cdp_url": browser.cdp_ws_url
    }
)

result = await agent.run()
\`\`\`

## Using CDP WebSocket URL

### Option 1: Persistent Browser Session (Current Setup)

If you have a persistent Kernel browser session, you can use the CDP WebSocket URL directly:

\`\`\`typescript
// In your Next.js API route
const cdpUrl = process.env.CDP_WEBSOCKET_URL

// Extract browser ID for live view
const browserIdMatch = cdpUrl.match(/browsers\/([^/]+)/)
const browserId = browserIdMatch ? browserIdMatch[1] : null

if (browserId) {
  const liveViewUrl = `https://app.kernel.com/browser/${browserId}?readOnly=true`
  // Send to frontend for embedding
}
\`\`\`

### Option 2: Dynamic Session Creation (Production)

For production, create fresh browser sessions per research task:

\`\`\`python
from kernel import Kernel

kernel = Kernel(api_key=os.environ["ONKERNEL_API_KEY"])
browser = kernel.browsers.create(kiosk_mode=True)

# Use these URLs
cdp_url = browser.cdp_ws_url
live_view_url = browser.browser_live_view_url
\`\`\`

## Features

### Stealth Mode
Avoid detection when scraping websites:
\`\`\`python
browser = kernel.browsers.create(stealth=True)
\`\`\`

### Session Persistence
Maintain browser state across requests:
\`\`\`python
# Create session
browser = kernel.browsers.create(persistent=True)
session_id = browser.session_id

# Later, reconnect to same session
browser = kernel.browsers.get(session_id)
\`\`\`

### Browser Cleanup

Always clean up browser sessions:
\`\`\`python
try:
    # Your automation
    result = await agent.run()
finally:
    kernel.browsers.delete(browser.id)
\`\`\`

## Architecture

\`\`\`
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP Request
         │
┌────────▼────────┐
│  Python Backend │
│  (FastAPI/Flask)│
└────────┬────────┘
         │
         │ Kernel SDK
         │
┌────────▼────────┐
│  Kernel Cloud   │
│   Browsers      │
└────────┬────────┘
         │
         │ Live View URL
         │
┌────────▼────────┐
│  User's Browser │
│  (Embedded View)│
└─────────────────┘
\`\`\`

## Pricing

Kernel charges based on:
- Browser session time (per minute)
- Bandwidth usage
- Storage for persistent sessions

Check [onkernel.com/pricing](https://onkernel.com/pricing) for current rates.

## Best Practices

1. **Always use read-only mode for embedded views**
   \`\`\`python
   live_url = f"{browser.browser_live_view_url}?readOnly=true"
   \`\`\`

2. **Enable kiosk mode for cleaner viewing**
   \`\`\`python
   browser = kernel.browsers.create(kiosk_mode=True)
   \`\`\`

3. **Set appropriate timeouts**
   - Short tasks: 60-120 seconds
   - Research tasks: 300-600 seconds
   - Long-running: 1800+ seconds

4. **Clean up sessions promptly**
   - Reduces costs
   - Frees resources
   - Prevents orphaned browsers

5. **Monitor usage**
   - Check dashboard regularly
   - Set up billing alerts
   - Implement rate limiting

## Troubleshooting

### Live View Not Loading

1. Check browser was created successfully
2. Verify `browser_live_view_url` is valid
3. Ensure iframe sandbox permissions are correct
4. Check browser hasn't been deleted/timed out

### Connection Issues

1. Verify ONKERNEL_API_KEY is set correctly
2. Check network connectivity
3. Ensure Kernel service is operational
4. Review browser timeout settings

## Support

- Documentation: [docs.onkernel.com](https://docs.onkernel.com)
- Discord: [onkernel.com/discord](https://onkernel.com/discord)
- Email: support@onkernel.com

## Next Steps

1. Set up Python backend service (see BROWSER_RESEARCH_SETUP.md)
2. Configure Kernel API key in environment variables
3. Test browser creation and live view
4. Integrate with Browser Use for AI automation
5. Deploy to production

## Current Platform Integration

The Crowe Logic AI platform is configured to use your CDP WebSocket URL:

1. **Environment Variable Set:** `CDP_WEBSOCKET_URL` ✓
2. **API Integration:** Browser research API detects and uses the CDP URL
3. **Live View:** Automatically extracts browser ID and constructs live view URL
4. **Frontend Display:** Research panel embeds the live browser view

### How It Works

\`\`\`typescript
// app/api/research/browser/route.ts
if (process.env.CDP_WEBSOCKET_URL) {
  // Extract browser ID from CDP URL
  const cdpUrl = process.env.CDP_WEBSOCKET_URL
  const browserIdMatch = cdpUrl.match(/browsers\/([^/]+)/)
  const browserId = browserIdMatch?.[1]
  
  // Construct live view URL
  const liveViewUrl = `https://app.kernel.com/browser/${browserId}?readOnly=true`
  
  // Send to frontend
  controller.enqueue(encoder.encode(
    `data: ${JSON.stringify({ type: "live_view", url: liveViewUrl })}\n\n`
  ))
}
