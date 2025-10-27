# AI Provider Routing System

## Overview

The chat system now supports dual-provider routing:
- **Azure AI**: For your custom Crowe Logic assistant
- **AI Gateway**: For all standard models (OpenAI, Anthropic, xAI, Google)

## How It Works

### Model Selection
When a user selects a model from the dropdown:

1. **Azure Models** (`azure/*`):
   - Routes to Azure OpenAI endpoint
   - Uses your custom assistant (ID: `asst_7ycbM8XLx9HjiBfvI0tGdhtz`)
   - Requires: `AZURE_AI_ENDPOINT` and `AZURE_AI_API_KEY`

2. **AI Gateway Models** (all others):
   - Routes through Vercel AI Gateway
   - Supports: OpenAI, Anthropic, xAI, Google
   - Requires: `AI_GATEWAY_API_KEY` or `OPENAI_API_KEY`

### Environment Variables

\`\`\`env
# Azure AI (Optional - for custom assistant)
AZURE_AI_ENDPOINT=https://your-endpoint.openai.azure.com
AZURE_AI_API_KEY=your-azure-key

# AI Gateway (Recommended - for all standard models)
AI_GATEWAY_API_KEY=your-gateway-key

# Direct OpenAI (Fallback)
OPENAI_API_KEY=your-openai-key
\`\`\`

## Available Models

### Custom Assistant
- `azure/crowelogic` - Your custom Crowe Logic AI agent

### OpenAI (via AI Gateway)
- `openai/gpt-4o-mini` - Fast and efficient (default)
- `openai/gpt-4o` - Most capable

### Anthropic (via AI Gateway)
- `anthropic/claude-3-5-sonnet-20241022` - Most capable
- `anthropic/claude-3-5-haiku-20241022` - Fastest

### xAI (via AI Gateway)
- `xai/grok-beta` - xAI's flagship model

### Google (via AI Gateway)
- `google/gemini-2.0-flash-exp` - Latest multimodal
- `google/gemini-1.5-pro-latest` - Advanced reasoning

## Testing

1. **Test Azure AI**:
   - Select "Crowe Logic Assistant"
   - Ask: "What's your expertise?"
   - Should respond with custom assistant personality

2. **Test AI Gateway**:
   - Select "GPT-4o Mini"
   - Ask: "What are you?"
   - Should respond with standard OpenAI model

3. **Test Model Switching**:
   - Switch between different providers
   - Verify each responds correctly
   - Check console logs for routing confirmation

## Troubleshooting

### Azure AI Not Working
- Check `AZURE_AI_ENDPOINT` and `AZURE_AI_API_KEY` are set
- Verify assistant ID is correct
- Check Azure OpenAI deployment status

### AI Gateway Not Working
- Verify `AI_GATEWAY_API_KEY` is set in Vercel
- Check model string format matches AI Gateway requirements
- Review console logs for API errors

### No Response
- Open browser console (F12)
- Look for `[v0]` prefixed logs
- Check network tab for API call status
- Verify environment variables in Vercel dashboard
