# Accessing the DeepParallel Agent Chat

## How to Access

### Option 1: From Workbench Dashboard

1. Go to `/workbench`
2. Click the **"AI Agents"** button in the top right header
3. Opens the agent chat interface at `/workbench/agents`

### Option 2: Direct URL

Navigate directly to:
```
http://localhost:3000/workbench/agents
```

Or in production:
```
https://your-app.vercel.app/workbench/agents
```

### Option 3: From Empty State

If you have no sessions yet:
1. Go to `/workbench`
2. See the "AI Agent Chat" card
3. Click to access the chat interface

## Agent Chat Features

### Three Specialized Agents

**1. DeepParallel - The Strategist**
- Fast, efficient, tactical thinking
- Rapid analysis and quick insights
- Color: Cyan/Blue

**2. DeepThought - The Philosopher**
- Deep reasoning and complex problem-solving
- Profound insights and detailed analysis
- Color: Purple/Pink

**3. DeepVision - The Visionary**
- Visual analysis and pattern recognition
- Creative solutions and innovative thinking
- Color: Green/Amber

### Chat Interface

```
┌─────────────────────────────────────────────────┐
│ DeepParallel Agent System                       │
├──────────────┬──────────────────────────────────┤
│              │                                   │
│  Agents      │  Chat Messages                    │
│  Sidebar     │                                   │
│              │  [User messages on right]         │
│  Select:     │  [Agent messages on left]         │
│  - Strategist│                                   │
│  - Philosopher│  [Agent avatars animate]         │
│  - Visionary │                                   │
│              │                                   │
│  [Activate   │                                   │
│   All]       │                                   │
│              ├───────────────────────────────────┤
│              │  [Type message...] [Send]         │
└──────────────┴──────────────────────────────────┘
```

### Features

- **Agent Selection** - Click an agent in the sidebar to chat with them
- **Real-time States** - Agents show thinking/reasoning animations
- **Message History** - See conversation with each agent
- **Keyboard Shortcuts**:
  - `Enter` - Send message
  - `Shift + Enter` - New line
- **Collective Reasoning** - Activate all agents at once

## Navigation Structure

```
/workbench
├── Dashboard (main page)
│   └── Button: "AI Agents" → /workbench/agents
├── /agents (chat interface)
│   └── Back button → /workbench
└── /[id] (session workspace)
    └── Back button → /workbench
```

## Quick Access Points

### From Workbench Header
```tsx
<Button variant="outline" size="sm">
  <Beaker className="w-4 h-4 mr-2" />
  AI Agents
</Button>
```

### From Empty State
```tsx
<Link href="/workbench/agents">
  <div className="glass-card">
    AI Agent Chat
    Talk to DeepParallel agents
  </div>
</Link>
```

## Testing

1. **Navigate to workbench:**
   ```
   http://localhost:3000/workbench
   ```

2. **Click "AI Agents" button** in top right

3. **Verify you see:**
   - Three agents in left sidebar
   - Chat interface on right
   - Empty state with agent description

4. **Select an agent** and send a message

5. **Verify:**
   - Agent avatar animates (thinking → reasoning)
   - Response appears after ~3 seconds
   - Message bubbles display correctly

## Troubleshooting

### Issue: "AI Agents" button not visible

**Check:**
- Hard refresh browser (Ctrl+Shift+R)
- Verify you're on `/workbench` page
- Check browser console for errors

### Issue: Chat interface not loading

**Check:**
- URL is `/workbench/agents` (not `/agents`)
- No TypeScript errors: `npm run build`
- Dev server is running

### Issue: Agents not responding

**Current behavior:**
- Agents use simulated responses (3 second delay)
- Real Azure OpenAI integration ready but not connected to chat yet

**To connect real AI:**
- Update `handleSend` function in `app/workbench/agents/page.tsx`
- Call Azure OpenAI API instead of setTimeout
- Use same pattern as hypothesis testing

## Future Enhancements

- [ ] Connect to real Azure OpenAI
- [ ] Persist chat history
- [ ] Multi-agent conversations
- [ ] File attachments
- [ ] Voice input/output
- [ ] Export conversations

---

**Status:** ✅ Accessible from workbench dashboard

**URL:** `/workbench/agents`

**Access:** Click "AI Agents" button in workbench header
