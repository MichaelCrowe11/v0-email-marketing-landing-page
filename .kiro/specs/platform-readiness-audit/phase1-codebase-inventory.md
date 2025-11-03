# Phase 1: Codebase Inventory

## App Routes and Pages

### Public Routes
- `/` - Landing page (app/page.tsx)
- `/pricing` - Pricing page
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/thanks` - Thank you page

### Authentication Routes
- `/auth/login` - Login page
- `/auth/sign-up` - Sign up page
- `/auth/sign-up-success` - Sign up success page
- `/auth/error` - Auth error page

### Feature Routes (Protected)
- `/chat` - AI chat interface
- `/crowe-vision` - Image analysis feature
- `/video-studio` - Video generation feature
- `/workbench` - ML workbench interface
- `/workbench/agents` - Agent management
- `/dashboard` - User dashboard
- `/profile` - User profile management
- `/avatar-demo` - Avatar demonstration
- `/workspace-demo` - Workspace demonstration

### Content Routes (Premium)
- `/knowledge-base` - Knowledge base articles
- `/species-library` - Mushroom species library
- `/sops` - Standard Operating Procedures
- `/contamination-guide` - Contamination identification guide
- `/docs` - Documentation hub
- `/docs/overview` - Documentation overview
- `/docs/agents` - Agent documentation
- `/docs/quality` - Quality documentation
- `/docs/schemas` - Schema documentation

### Community Routes
- `/forum` - Forum listing
- `/forum/[id]` - Forum post detail
- `/forum/new` - Create new forum post
- `/documents` - Document library
- `/documents/[id]` - Document detail
- `/documents/new` - Create new document

### E-commerce Routes
- `/shop` - Product shop
- `/shop/[productId]` - Product detail
- `/checkout` - Checkout page
- `/consultations` - Consultation booking
- `/gpts` - GPT products

### Project Management Routes
- `/projects/[id]` - Project detail page
- `/upload` - File upload interface

### Admin Routes
- `/admin/stripe-links` - Stripe admin links
- `/analytics` - Analytics dashboard

### Utility Routes
- `/search` - Search functionality

## API Endpoints

### AI & Chat Endpoints
- `POST /api/chat` - Main chat endpoint
- `POST /api/ai/stream` - Streaming AI responses
- `GET /api/ai/knowledge` - Knowledge base queries
- `GET /api/conversations` - List conversations
- `GET /api/conversations/[id]` - Get conversation
- `DELETE /api/conversations/[id]` - Delete conversation
- `GET /api/conversations/[id]/messages` - Get conversation messages

### Crowe Vision Endpoints
- `POST /api/crowe-vision/analyze` - Image analysis
- `POST /api/analyze-image` - Alternative image analysis

### Video Studio Endpoints
- `POST /api/video/generate` - Generate video

### Workbench Endpoints
- `/api/workbench/ml-dataset` - ML dataset management (no route file found)

### Research & Tools Endpoints
- `POST /api/research/browser` - Browser research
- `POST /api/execute-code` - Code execution
- `GET /api/weather` - Weather data

### Authentication Endpoints
- `POST /api/auth/welcome-email` - Send welcome email

### Payment & Subscription Endpoints
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `GET /api/subscription/check-azure-access` - Check Azure access

### Utility Endpoints
- `POST /api/contact` - Contact form submission
- `POST /api/upload` - File upload

## React Components

### Core Components (63 files)
- accessibility-provider.tsx
- accessibility-settings.tsx
- advanced-terminal.tsx
- ai-avatar-swirl-advanced.tsx
- ai-avatar-ultimate.tsx
- ai-avatar.tsx
- ai-generated-intro.tsx
- ai-mention-badge.tsx
- ai-reply-trigger.tsx
- ai-showcase.tsx
- animated-crowe-avatar.tsx
- animated-product-card.tsx
- aria-live-announcer.tsx
- benefits-band.tsx
- brand-family-banner.tsx
- canvas.tsx
- chain-of-thought.tsx
- chat-demo.tsx
- checkout.tsx
- code-generation-intro.tsx
- docs-sidebar.tsx
- document-form.tsx
- empty-state.tsx
- enhanced-hero.tsx
- error-boundary.tsx
- faq.tsx
- feature-gate.tsx
- features-simplified.tsx
- features.tsx
- floating-code-swirl.tsx
- footer.tsx
- forum-post-form.tsx
- forum-search.tsx
- global-header.tsx
- global-keyboard-handler.tsx
- hero.tsx
- interactive-showcase.tsx
- keyboard-shortcuts-dialog.tsx
- like-button.tsx
- live-code-generator.tsx
- loading-skeleton.tsx
- mushroom-dataset-uploader.tsx
- onboarding-tooltip.tsx
- optimized-image.tsx
- orchestrated-hero.tsx
- organic-hero.tsx
- page-header.tsx
- performance-optimized-card.tsx
- premium-nav.tsx
- pricing.tsx
- profile-picture-upload.tsx
- proof-section.tsx
- reply-form.tsx
- scroll-reveal.tsx
- sidebar-nav.tsx
- sign-out-button.tsx
- skip-link.tsx
- stat-card.tsx
- sticky-bar.tsx
- streaming-chat-demo.tsx
- tech-showcase.tsx
- theme-provider.tsx
- theme-toggle.tsx
- trust-indicators.tsx
- user-menu.tsx
- virtualized-data-grid.tsx
- web-vitals.tsx

### Chat Components (24 files)
- agent-switcher.tsx
- ai-avatar-swirl.tsx
- ai-avatar.tsx
- browser-research-panel.tsx
- canvas.tsx
- chain-of-thought.tsx
- chat-canvas.tsx
- chat-container.tsx
- chat-meter.tsx
- chat-workspace-mockup.tsx
- code-editor.tsx
- conversation-history.tsx
- debug-panel.tsx
- environment-monitor.tsx
- integrations-panel.tsx
- model-selector.tsx
- multimodal-input.tsx
- reasoning-trace.tsx
- strain-database.tsx
- streaming-text-animation.tsx
- substrate-calculator.tsx
- voice-chat-button.tsx
- voice-input.tsx
- workflow-terminal.tsx
- yield-calculator.tsx

### Crowe Vision Components (1 file)
- crowe-vision-content.tsx

### UI Components (19 files)
- alert.tsx
- avatar.tsx
- badge.tsx
- button.tsx
- card.tsx
- dropdown-menu.tsx
- input.tsx
- label.tsx
- progress.tsx
- scroll-area.tsx
- select.tsx
- separator.tsx
- spinner.tsx
- tabs.tsx
- textarea.tsx

### Workbench Components (4 files)
- create-session-dialog.tsx
- deep-parallel-avatar.tsx
- session-card.tsx
- session-manager.tsx

**Total Components: 111 files**

## Library Files

### Core Library Files (19 files)
- accessibility.ts - Accessibility utilities
- admin-check.ts - Admin permission checking
- ai-models.ts - AI model configurations
- animation-utils.ts - Animation utilities
- chat-metering.ts - Chat usage metering
- design-system.ts - Design system utilities
- dynamic-import.ts - Dynamic import utilities
- email-templates.tsx - Email template components
- keyboard-shortcuts.ts - Keyboard shortcut definitions
- mycology-ai.ts - Mycology AI utilities
- performance.ts - Performance monitoring
- premium-products.ts - Premium product definitions
- products.ts - Product definitions
- resend.ts - Resend email service configuration
- stripe.ts - Stripe payment configuration
- subscription.ts - Subscription management utilities
- utils.ts - General utilities
- voice-chat.ts - Voice chat utilities

### Hooks (1 file)
- use-accessibility-preferences.ts

### Stores (2 files)
- data-store.ts - Data state management
- session-store.ts - Session state management

### Supabase (4 files)
- chat-queries.ts - Chat database queries
- client.ts - Supabase client configuration
- middleware.ts - Supabase middleware
- server.ts - Supabase server-side utilities

### Types (1 file)
- workbench.ts - Workbench type definitions

**Total Library Files: 27 files**

## Server Actions (4 files)
- consultation-checkout.ts - Consultation checkout logic
- profile.ts - Profile management actions
- stripe.ts - Stripe actions
- subscription-stripe.ts - Subscription Stripe actions

## Summary Statistics

- **Total Routes**: 45+ pages
- **Total API Endpoints**: 20+ endpoints
- **Total Components**: 111 components
- **Total Library Files**: 27 files
- **Total Server Actions**: 4 files

## Key Observations

1. **Comprehensive Feature Set**: Platform includes chat, vision, video, workbench, forum, documents, shop, and more
2. **Well-Organized Structure**: Clear separation between routes, components, and library code
3. **Premium Content Protection**: Multiple premium content routes (SOPs, species library, knowledge base)
4. **E-commerce Integration**: Shop, checkout, and consultation booking functionality
5. **Community Features**: Forum and document library for user collaboration
6. **AI Capabilities**: Multiple AI endpoints for chat, vision, and research
7. **Admin Functionality**: Analytics and Stripe admin tools
8. **Accessibility Focus**: Dedicated accessibility components and utilities
