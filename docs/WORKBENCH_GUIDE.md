# Mycological Workbench - Developer Guide

## Overview

The Mycological Workbench is a DeepParallel AgBiotech Reasoning Engine designed for mycological research. It provides AI-powered tools for contamination analysis, substrate optimization, yield prediction, and species identification.

## Architecture

### Core Components

#### 1. Session Management (`/app/workbench`)
- **Dashboard** (`page.tsx`) - Main workbench interface with session grid/list view
- **Session Workspace** (`[id]/page.tsx`) - Individual session workspace with tabs
- **Session Store** (`lib/stores/session-store.ts`) - Zustand state management

#### 2. API Routes (`/app/api/workbench`)
- `GET /api/workbench/sessions` - Fetch all sessions
- `POST /api/workbench/sessions` - Create new session
- `GET /api/workbench/sessions/[id]` - Fetch single session
- `PATCH /api/workbench/sessions/[id]` - Update session
- `DELETE /api/workbench/sessions/[id]` - Delete session

#### 3. Components (`/components/workbench`)
- **SessionCard** - Display session in grid or list view
- **CreateSessionDialog** - Multi-step session creation wizard
- **DeepParallelAvatar** - Animated agent avatar with quantum field visualization

### Data Flow

```
User Action → Component → Store → API Route → Database (mock) → Store → Component → UI Update
```

## Session Types

### 1. Contamination Analysis 🔬
- Identify and analyze contamination patterns
- AI-powered vision and reasoning
- Color: Red to Orange gradient

### 2. Substrate Optimization 🧪
- Optimize substrate formulas
- Maximum yield and efficiency
- Color: Green to Emerald gradient

### 3. Yield Prediction 📊
- Build predictive models
- Environmental factor analysis
- Color: Blue to Cyan gradient

### 4. Species Identification 🍄
- Identify mushroom species
- Computer vision + mycological knowledge
- Color: Purple to Pink gradient

## Session Lifecycle

### States
- **Active** - Session is currently being worked on
- **Paused** - Session is temporarily paused
- **Completed** - Session is archived/finished

### Actions
- **Create** - Initialize new research session
- **Pause/Resume** - Toggle session status
- **Archive** - Mark session as completed
- **Delete** - Remove session (with confirmation)

## Features Implemented

### ✅ Phase 1: Core Session Functionality
- [x] Session API routes (CRUD operations)
- [x] Session store with Zustand
- [x] Session workspace page with tabs
- [x] Real session persistence via API
- [x] Loading states and error handling

### ✅ Session Dashboard
- [x] Grid and list view modes
- [x] Search functionality
- [x] Session statistics
- [x] Quick actions menu
- [x] Status indicators

### ✅ Session Creation
- [x] Multi-step wizard
- [x] Session type selection
- [x] Title and description
- [x] Automatic navigation to new session

### ✅ Session Workspace
- [x] Overview tab with progress and stats
- [x] Data tab (placeholder for data import)
- [x] Experiments tab (placeholder for pipelines)
- [x] Hypotheses tab (placeholder for hypothesis testing)
- [x] Insights tab (placeholder for AI insights)

## Next Steps

### Priority 2: Data Import System
- [ ] File upload component with drag-and-drop
- [ ] Enhanced parsers (CSV, JSON, FASTA, GenBank)
- [ ] Data preview interface
- [ ] Data management UI

### Priority 3: DeepParallel Reasoning Engine
- [ ] Hypothesis builder interface
- [ ] Agent orchestration system
- [ ] Reasoning trace visualization
- [ ] Evidence aggregation

### Priority 4: Experiment Pipeline Builder
- [ ] React Flow integration
- [ ] Node library (stats, ML, sequence analysis)
- [ ] Pipeline execution engine
- [ ] Results visualization

## Development

### Running the Workbench

```bash
npm run dev
```

Navigate to `http://localhost:3000/workbench`

### Creating a New Session

1. Click "New Research Session"
2. Select session type
3. Enter title and description
4. Click "Create Session"
5. Automatically navigated to session workspace

### Testing API Routes

```bash
# Fetch all sessions
curl http://localhost:3000/api/workbench/sessions

# Create session
curl -X POST http://localhost:3000/api/workbench/sessions \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Session","type":"contamination-analysis","description":"Test"}'

# Update session
curl -X PATCH http://localhost:3000/api/workbench/sessions/[id] \
  -H "Content-Type: application/json" \
  -d '{"status":"paused"}'

# Delete session
curl -X DELETE http://localhost:3000/api/workbench/sessions/[id]
```

## Database Integration

Currently using in-memory mock data. To integrate with a real database:

1. **Update API routes** (`app/api/workbench/sessions/*.ts`)
   - Replace mock `sessions` array with database queries
   - Add authentication checks
   - Implement proper error handling

2. **Add database schema** (Supabase/PostgreSQL)
   ```sql
   CREATE TABLE research_sessions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id),
     title TEXT NOT NULL,
     description TEXT,
     type TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'active',
     progress INTEGER DEFAULT 0,
     datasets INTEGER DEFAULT 0,
     hypotheses INTEGER DEFAULT 0,
     insights INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Add authentication**
   - Implement NextAuth.js or Supabase Auth
   - Protect API routes
   - Add user context to session store

## Styling

The workbench uses a scientific theme with:
- Glass morphism effects (`glass-card` class)
- Gradient accents (cyan, purple, pink)
- Smooth animations with Framer Motion
- Responsive design (mobile-first)

## Performance Considerations

- Sessions are fetched once on mount
- Optimistic UI updates for better UX
- Lazy loading for session workspace tabs
- Virtual scrolling for large session lists (TODO)

## Troubleshooting

### Sessions not loading
- Check API route is running
- Verify fetch URL is correct
- Check browser console for errors

### Session creation fails
- Verify all required fields are filled
- Check API route logs
- Ensure session type is valid

### State not updating
- Check Zustand store actions
- Verify API responses
- Check React DevTools for state changes
