# Quick Fix: Get AI Chat Working in 2 Minutes

## Problem
Chat interface loads but doesn't respond to messages.

## Solution 1: Use AI Gateway (Fastest - No Setup)

1. Open `/components/chat/chat-container.tsx`
2. Find line ~35: `const [selectedModel, setSelectedModel] = useState("azure/crowelogic")`
3. Change to: `const [selectedModel, setSelectedModel] = useState("openai/gpt-4o-mini")`
4. Save and refresh

**Done!** Chat will now work using Vercel AI Gateway (no API keys needed).

## Solution 2: Configure Azure AI (If You Want Custom Assistant)

1. Get your Azure OpenAI credentials from Azure Portal
2. Add to Vercel project environment variables:
   \`\`\`
   AZURE_AI_API_KEY=your_key
   AZURE_AI_ENDPOINT=https://your-resource.openai.azure.com
   \`\`\`
3. Redeploy or restart dev server

## Verify It's Working

1. Open chat at `/chat`
2. Type "Hello" and press Enter
3. You should see a response within 2-3 seconds
4. Check browser console for `[v0]` logs

## Still Not Working?

Run this test:
\`\`\`bash
# Test the API directly
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"openai/gpt-4o-mini"}'
\`\`\`

If you see a response, the API works. If not, check:
- Is the dev server running?
- Are there errors in the terminal?
- Is `/api/chat/route.ts` present?

## Model Options

These work without any setup (AI Gateway):
- `openai/gpt-4o` - Best quality
- `openai/gpt-4o-mini` - Fast and cheap
- `anthropic/claude-sonnet-4.5` - Great for analysis
- `xai/grok-2-latest` - Alternative option

These require Azure AI setup:
- `azure/crowelogic` - Your custom assistant
- `azure/agent874` - Alternative assistant
