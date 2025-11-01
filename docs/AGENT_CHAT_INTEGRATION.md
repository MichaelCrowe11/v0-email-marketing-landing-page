# Agent Chat - Azure OpenAI Integration

## Overview

The DeepParallel Agent Chat is now connected to Azure OpenAI, providing real AI-powered conversations with three specialized agents.

## Architecture

```
User Input
    ↓
Frontend (app/workbench/agents/page.tsx)
    ↓
API Route (app/api/workbench/agents/chat/route.ts)
    ↓
Azure OpenAI API
    ↓
Response with Agent Personality
    ↓
Display in Chat Interface
```

## Three Specialized Agents

### 1. DeepParallel - The Strategist (Cyan/Blue)

**Personality:**
- Fast, tactical thinker
- Provides rapid, actionable analysis
- Efficient communication
- Practical solutions focus
- Field researcher mindset

**Specializations:**
- Contamination analysis
- Substrate optimization
- Quick problem-solving
- Immediate next steps

**Temperature:** 0.7 (balanced)
**Max Tokens:** 500 (concise responses)

**Example Prompts:**
- "What's the fastest way to identify green mold contamination?"
- "Give me 3 quick steps to optimize my substrate mix"
- "How do I prevent contamination in my grow room?"

### 2. DeepThought - The Philosopher (Purple/Pink)

**Personality:**
- Deep, thorough analysis
- Multiple perspectives
- Theoretical frameworks
- Profound insights
- Research scientist mindset

**Specializations:**
- Yield prediction
- Species identification
- Hypothesis formulation
- Complex problem analysis

**Temperature:** 0.8 (more creative)
**Max Tokens:** 1000 (comprehensive responses)

**Example Prompts:**
- "Explain the relationship between temperature and mycelial growth"
- "What are the theoretical implications of substrate composition?"
- "Help me formulate a hypothesis about contamination patterns"

### 3. DeepVision - The Visionary (Green/Amber)

**Personality:**
- Creative problem-solving
- Pattern recognition
- Visual thinking
- Innovative approaches
- Innovator mindset

**Specializations:**
- Data visualization
- Morphological analysis
- Pattern detection
- Novel solutions

**Temperature:** 0.9 (most creative)
**Max Tokens:** 800 (balanced)

**Example Prompts:**
- "What patterns do you see in my yield data?"
- "Suggest an innovative approach to substrate sterilization"
- "How can I visualize contamination spread over time?"

## API Endpoint

### POST /api/workbench/agents/chat

**Request:**
```typescript
{
  agent: 'DeepParallel' | 'DeepThought' | 'DeepVision',
  messages: [
    { role: 'user', content: 'Your question here' },
    { role: 'assistant', content: 'Previous response' },
    // ... conversation history
  ]
}
```

**Response:**
```typescript
{
  message: string,           // AI response
  agent: string,             // Agent name
  usage: {
    promptTokens: number,
    completionTokens: number,
    totalTokens: number
  }
}
```

**Error Response:**
```typescript
{
  error: string,
  details?: string
}
```

## Implementation Details

### System Prompts

Each agent has a unique system prompt that defines:
1. **Identity** - Who they are
2. **Characteristics** - How they think
3. **Specializations** - What they're good at
4. **Approach** - How they respond
5. **Tone** - Communication style

### Temperature Settings

- **DeepParallel:** 0.7 - Balanced, reliable
- **DeepThought:** 0.8 - More exploratory
- **DeepVision:** 0.9 - Most creative

### Token Limits

- **DeepParallel:** 500 tokens - Quick, concise
- **DeepThought:** 1000 tokens - Comprehensive
- **DeepVision:** 800 tokens - Balanced

### Conversation History

The API maintains conversation context by sending all previous messages. This allows:
- Follow-up questions
- Context-aware responses
- Natural conversation flow

## User Experience

### Chat Flow

1. **User selects agent** from sidebar
2. **Types message** in input field
3. **Presses Enter** or clicks Send
4. **Agent avatar animates** (thinking → reasoning)
5. **Loading indicator** shows (3 bouncing dots)
6. **Response appears** in chat bubble
7. **Agent returns to idle** state

### Visual States

- **Idle:** Agent ready
- **Thinking:** Processing query (0.5s)
- **Reasoning:** Calling Azure OpenAI (2-5s)
- **Complete:** Response delivered (2s)
- **Back to Idle:** Ready for next query

### Error Handling

If Azure OpenAI fails:
1. Error logged to console
2. User-friendly message displayed
3. Agent returns to idle state
4. User can retry

## Cost Optimization

### Per Message Cost

**DeepParallel:**
- Input: ~100-200 tokens
- Output: ~300-500 tokens
- Cost: ~$0.02-$0.03 per message (GPT-4)

**DeepThought:**
- Input: ~100-200 tokens
- Output: ~600-1000 tokens
- Cost: ~$0.03-$0.05 per message (GPT-4)

**DeepVision:**
- Input: ~100-200 tokens
- Output: ~500-800 tokens
- Cost: ~$0.02-$0.04 per message (GPT-4)

### Optimization Strategies

1. **Token Limits** - Prevent runaway costs
2. **Conversation Pruning** - Limit history to last 10 messages
3. **Agent Selection** - Use DeepParallel for quick queries
4. **Caching** - Cache common questions (future)

## Testing

### Manual Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to agents:**
   ```
   http://localhost:3000/workbench/agents
   ```

3. **Test each agent:**
   - Select DeepParallel
   - Ask: "What causes green mold?"
   - Verify response is concise and practical
   
   - Select DeepThought
   - Ask: "Explain mycelial growth patterns"
   - Verify response is detailed and theoretical
   
   - Select DeepVision
   - Ask: "What patterns indicate contamination?"
   - Verify response is creative and visual

### API Testing

```bash
curl -X POST http://localhost:3000/api/workbench/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "DeepParallel",
    "messages": [
      {"role": "user", "content": "What causes contamination?"}
    ]
  }'
```

## Monitoring

### Azure Portal

Monitor in Azure OpenAI resource:
1. **Total Calls** - Track usage
2. **Token Usage** - Monitor costs
3. **Latency** - Response times
4. **Errors** - Failed requests

### Application Logs

Check console for:
- API call timing
- Token usage per message
- Error messages
- Agent selection

## Future Enhancements

### Planned Features

1. **Conversation Persistence**
   - Save chat history to database
   - Resume conversations
   - Export transcripts

2. **Multi-Agent Collaboration**
   - All agents discuss a problem
   - Synthesize multiple perspectives
   - Collective reasoning

3. **Context Awareness**
   - Access session data
   - Reference uploaded datasets
   - Hypothesis-aware responses

4. **Voice Integration**
   - Speech-to-text input
   - Text-to-speech output
   - Voice-only mode

5. **Advanced Features**
   - File attachments
   - Image analysis
   - Code execution
   - Real-time collaboration

## Troubleshooting

### Issue: "Azure OpenAI is not configured"

**Solution:**
1. Check environment variables in Vercel
2. Verify `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT_NAME`
3. Redeploy after adding variables

### Issue: Slow responses

**Causes:**
- Azure OpenAI latency
- Large conversation history
- High token limits

**Solutions:**
- Use DeepParallel for faster responses
- Prune conversation history
- Reduce max_tokens

### Issue: Generic responses

**Causes:**
- System prompt not working
- Temperature too low
- Context not maintained

**Solutions:**
- Verify system prompt in API
- Adjust temperature settings
- Check message history

## Success Metrics

✅ **Functionality**
- All three agents respond correctly
- Personalities are distinct
- Responses are relevant
- Error handling works

✅ **Performance**
- Response time: 2-5 seconds
- Token usage: Within limits
- Cost: Predictable
- Reliability: >95% success rate

✅ **User Experience**
- Smooth animations
- Clear loading states
- Helpful error messages
- Natural conversation flow

---

**Status:** ✅ Complete - Real AI Integration

**Next:** Test in production, gather feedback, iterate on personalities
