# Architecture Documentation

## System Overview

Crowe Logic AI is a full-stack web application built with modern technologies and best practices. The architecture follows a modular, scalable design with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │    React     │  │  TypeScript  │      │
│  │  App Router  │  │  Components  │  │   + Tailwind │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API/Edge Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js API │  │ Edge Runtime │  │  Middleware  │      │
│  │    Routes    │  │   Functions  │  │     Auth     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  AI Models   │  │   Supabase   │  │    Stripe    │      │
│  │ GPT-4/Claude │  │  Auth + DB   │  │   Payments   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
│   ├── GlobalHeader
│   ├── SidebarNav
│   └── page content
│       └── Footer
│
├── page.tsx (Homepage)
│   ├── OrchestratedHero
│   ├── StreamingChatDemo
│   ├── Features
│   ├── Pricing
│   ├── ProofSection
│   └── TrustIndicators
│
├── chat/
│   └── page.tsx
│       ├── ChatInterface
│       ├── MessageList
│       ├── MessageInput
│       └── VisualAnalysis
│
├── dashboard/
│   └── page.tsx
│       ├── StatsOverview
│       ├── RecentProjects
│       └── QuickActions
│
└── [other routes...]
```

### State Management

#### Global State (React Context)
- **AuthContext**: User authentication state
- **ThemeContext**: Theme preferences (light/dark)
- **AccessibilityContext**: Accessibility preferences
- **ChatContext**: Active chat sessions

#### Local State (React Hooks)
- Component-specific state with useState
- Side effects with useEffect
- Memoization with useMemo/useCallback
- Custom hooks for reusable logic

#### Server State (React Query - Future)
- API data fetching and caching
- Optimistic updates
- Background refetching
- Mutation handling

### Routing Strategy

**App Router (Next.js 14)**
- File-based routing in `app/` directory
- Server Components by default
- Client Components with 'use client' directive
- Nested layouts for shared UI
- Route groups for organization

**Key Routes**:
```
/                    → Homepage
/chat                → AI Chat Interface
/chat/[id]           → Specific chat session
/dashboard           → User dashboard
/projects            → Project management
/projects/[id]       → Project details
/knowledge-base      → Article library
/knowledge-base/[slug] → Article detail
/forum               → Community forum
/forum/[id]          → Forum thread
/shop                → Product catalog
/shop/[id]           → Product detail
/checkout            → Checkout flow
/api/*               → API routes
```

## Backend Architecture

### API Routes

**Structure**:
```
app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── callback/route.ts
├── chat/
│   ├── route.ts              # Create/list chats
│   ├── [id]/route.ts         # Get/update/delete chat
│   └── [id]/messages/route.ts # Chat messages
├── analysis/
│   └── route.ts              # Visual analysis
├── projects/
│   ├── route.ts
│   └── [id]/route.ts
├── stripe/
│   ├── checkout/route.ts
│   └── webhook/route.ts
└── admin/
    └── [various admin routes]
```

**API Design Principles**:
- RESTful conventions
- Consistent error handling
- Request validation with Zod
- Rate limiting
- Authentication middleware
- CORS configuration

### Database Schema

**Supabase (PostgreSQL)**

```sql
-- Users (managed by Supabase Auth)
users
  - id (uuid, primary key)
  - email (text)
  - created_at (timestamp)
  - metadata (jsonb)

-- Profiles
profiles
  - id (uuid, primary key, foreign key to users)
  - display_name (text)
  - avatar_url (text)
  - bio (text)
  - experience_level (text)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Subscriptions
subscriptions
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - stripe_subscription_id (text)
  - tier (text: 'free', 'premium', 'professional')
  - status (text)
  - current_period_end (timestamp)
  - created_at (timestamp)

-- Chats
chats
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - title (text)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Messages
messages
  - id (uuid, primary key)
  - chat_id (uuid, foreign key to chats)
  - role (text: 'user', 'assistant')
  - content (text)
  - metadata (jsonb)
  - created_at (timestamp)

-- Projects
projects
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - name (text)
  - species (text)
  - substrate (text)
  - status (text)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Observations
observations
  - id (uuid, primary key)
  - project_id (uuid, foreign key to projects)
  - notes (text)
  - temperature (numeric)
  - humidity (numeric)
  - images (text[])
  - created_at (timestamp)

-- Knowledge Base Articles
articles
  - id (uuid, primary key)
  - slug (text, unique)
  - title (text)
  - content (text)
  - category (text)
  - tier (text: 'free', 'premium', 'professional')
  - created_at (timestamp)
  - updated_at (timestamp)

-- Forum Posts
forum_posts
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - title (text)
  - content (text)
  - category (text)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Forum Replies
forum_replies
  - id (uuid, primary key)
  - post_id (uuid, foreign key to forum_posts)
  - user_id (uuid, foreign key to users)
  - content (text)
  - created_at (timestamp)

-- AI Usage Tracking
ai_usage
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - model (text)
  - tokens_used (integer)
  - cost (numeric)
  - created_at (timestamp)
```

**Row Level Security (RLS)**:
- Users can only access their own data
- Public content (free articles, forum posts) accessible to all
- Admin users have elevated permissions
- Subscription tier enforcement at database level

### AI Integration

**Multi-Model Orchestration**:

```typescript
// lib/ai/orchestrator.ts
interface AIRequest {
  prompt: string
  context?: string
  images?: string[]
  model?: 'gpt-4' | 'claude' | 'auto'
}

async function orchestrateAIRequest(request: AIRequest) {
  // 1. Analyze request complexity
  const complexity = analyzeComplexity(request)
  
  // 2. Select optimal model
  const model = selectModel(complexity, request.model)
  
  // 3. Prepare context
  const context = await prepareContext(request)
  
  // 4. Execute request
  const response = await executeModel(model, context)
  
  // 5. Post-process and return
  return formatResponse(response)
}
```

**Model Selection Logic**:
- **GPT-4**: Complex reasoning, visual analysis, general queries
- **Claude**: Long-form content, detailed explanations
- **GPT-3.5**: Simple queries, fast responses
- **Specialized Models**: Species identification, contamination detection

**Context Management**:
- Retrieve relevant knowledge base articles
- Include user's project history
- Add conversation context
- Embed user preferences

### Payment Processing

**Stripe Integration**:

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Create checkout session
async function createCheckoutSession(userId: string, priceId: string) {
  return await stripe.checkout.sessions.create({
    customer: await getOrCreateCustomer(userId),
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  })
}

// Handle webhook events
async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionCancel(event.data.object)
      break
  }
}
```

**Subscription Tiers**:
- Free: Limited features, 10 messages/month
- Premium ($29/mo): Unlimited messages, full features
- Professional ($99/mo): API access, priority support

## Security Architecture

### Authentication Flow

```
1. User visits protected route
   ↓
2. Middleware checks for session
   ↓
3. If no session → redirect to /auth/login
   ↓
4. User authenticates with Supabase Auth
   ↓
5. Session cookie set (httpOnly, secure)
   ↓
6. User redirected to original route
   ↓
7. Subsequent requests include session cookie
```

### Authorization

**Role-Based Access Control (RBAC)**:
- **User**: Basic access to own data
- **Premium**: Access to premium features
- **Professional**: API access, advanced features
- **Admin**: Full platform access

**Implementation**:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession(request)
  
  if (!session) {
    return NextResponse.redirect('/auth/login')
  }
  
  // Check subscription tier for premium routes
  if (request.nextUrl.pathname.startsWith('/premium')) {
    const subscription = await getSubscription(session.user.id)
    if (subscription.tier === 'free') {
      return NextResponse.redirect('/pricing')
    }
  }
  
  return NextResponse.next()
}
```

### Data Protection

- **Encryption at Rest**: Supabase handles database encryption
- **Encryption in Transit**: HTTPS/TLS for all connections
- **API Keys**: Stored in environment variables, never in code
- **Sensitive Data**: PII encrypted before storage
- **File Uploads**: Scanned for malware, size limits enforced

## Performance Architecture

### Optimization Strategies

**1. Code Splitting**
```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
  ssr: false
})
```

**2. Image Optimization**
```tsx
// Next.js Image component
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

**3. Caching Strategy**
- **Static Pages**: Cached at CDN edge
- **Dynamic Pages**: ISR (Incremental Static Regeneration)
- **API Responses**: Cache-Control headers
- **Client-Side**: React Query for data caching

**4. Database Optimization**
- Indexed columns for common queries
- Connection pooling
- Query optimization
- Materialized views for complex queries

### Monitoring

**Vercel Analytics**:
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Error tracking
- Performance insights

**Custom Monitoring**:
```typescript
// lib/monitoring.ts
export function trackEvent(name: string, properties?: Record<string, any>) {
  // Send to analytics service
}

export function trackError(error: Error, context?: Record<string, any>) {
  // Send to error tracking service
}

export function trackPerformance(metric: Metric) {
  // Send to performance monitoring
}
```

## Deployment Architecture

### Vercel Platform

**Build Process**:
```
1. Git push to main branch
   ↓
2. Vercel webhook triggered
   ↓
3. Install dependencies (npm install)
   ↓
4. Run build (npm run build)
   ↓
5. Generate static pages
   ↓
6. Deploy to edge network
   ↓
7. Update DNS routing
   ↓
8. Deployment complete
```

**Environment Configuration**:
- **Development**: Local .env.local
- **Preview**: Vercel preview deployments
- **Production**: Vercel production environment

**Edge Network**:
- Global CDN distribution
- Automatic HTTPS
- DDoS protection
- Automatic scaling

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Scalability Considerations

### Horizontal Scaling
- Serverless functions auto-scale
- Database connection pooling
- CDN for static assets
- Load balancing at edge

### Vertical Scaling
- Database upgrades as needed
- Increased function memory/timeout
- Premium Vercel plan for higher limits

### Future Scaling Plans
- Microservices architecture for AI processing
- Dedicated AI inference servers
- Redis for caching layer
- Message queue for async processing

## Disaster Recovery

### Backup Strategy
- **Database**: Daily automated backups (Supabase)
- **Files**: Replicated across regions (Supabase Storage)
- **Code**: Git version control
- **Configuration**: Environment variables backed up

### Recovery Procedures
1. Database restore from backup
2. Redeploy from Git
3. Restore environment variables
4. Verify functionality
5. Update DNS if needed

### Monitoring & Alerts
- Uptime monitoring (24/7)
- Error rate alerts
- Performance degradation alerts
- Security incident alerts

---

**Last Updated**: December 2024
**Version**: 2.0.0
