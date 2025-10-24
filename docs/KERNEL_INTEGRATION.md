# Kernel Integration Guide

## Quick Start with Kernel

Kernel provides cloud-hosted browsers with Chrome DevTools Protocol (CDP) support, perfect for AI-powered browser automation.

### 1. Sign Up for Kernel

Visit [kernel.com](https://kernel.com) and create an account.

### 2. Get Your API Key

1. Go to your Kernel dashboard
2. Navigate to Settings → API Keys
3. Create a new API key
4. Copy the key and add it to your environment variables

### 3. Install Kernel SDK

For Python backend:
\`\`\`bash
uv add kernel
\`\`\`

For Node.js (if needed):
\`\`\`bash
npm install @onkernel/sdk
\`\`\`

### 4. Create Your First Browser Session

\`\`\`python
from kernel import Kernel

# Initialize client
kernel = Kernel(api_key="your_api_key")

# Create browser
browser = kernel.browsers.create()

# Get CDP URL for automation
cdp_url = browser.cdp_ws_url

# Use with Browser Use, Playwright, Puppeteer, etc.
\`\`\`

### 5. Configure Browser Settings

\`\`\`python
browser = kernel.browsers.create(
    viewport={'width': 1024, 'height': 768},
    stealth=True,  # Enable anti-detection
    live_view=True,  # Enable real-time viewing
    timeout=300  # 5 minute timeout
)
\`\`\`

## Features

### Stealth Mode
Avoid detection when scraping websites:
\`\`\`python
browser = kernel.browsers.create(stealth=True)
\`\`\`

### Live View
Debug your automations in real-time:
\`\`\`python
browser = kernel.browsers.create(live_view=True)
live_url = browser.live_view_url
# Share this URL to watch the browser in action
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

## Pricing

Kernel charges based on:
- Browser session time (per minute)
- Bandwidth usage
- Storage for persistent sessions

Check [kernel.com/pricing](https://kernel.com/pricing) for current rates.

## Best Practices

1. **Always clean up sessions**
   \`\`\`python
   try:
       # Your automation
       pass
   finally:
       kernel.browsers.delete_by_id(browser.session_id)
   \`\`\`

2. **Use appropriate timeouts**
   - Short tasks: 60-120 seconds
   - Research tasks: 300-600 seconds
   - Long-running: 1800+ seconds

3. **Enable stealth for scraping**
   - Reduces detection risk
   - Better success rates

4. **Monitor usage**
   - Check dashboard regularly
   - Set up billing alerts
   - Implement rate limiting

## Support

- Documentation: [docs.kernel.com](https://docs.kernel.com)
- Discord: [kernel.com/discord](https://kernel.com/discord)
- Email: support@kernel.com
