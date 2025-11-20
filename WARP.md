# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Install deps
  - npm install
- Dev server
  - npm run dev
- Build / Start
  - npm run build
  - npm run start
- Lint
  - npm run lint
- Type-check (no script defined)
  - npx tsc -p tsconfig.json --noEmit
- Bundle analysis (PowerShell)
  - $env:ANALYZE="true"; npm run build
- Azure OpenAI connectivity check
  - npm run test:azure

### Tests (Playwright)
First-time setup (dev dependencies not in package.json):
- npm i -D @playwright/test @axe-core/playwright lighthouse chrome-launcher playwright-lighthouse
- npx playwright install

Run tests
- All: npx playwright test
- Visual only: npx playwright test tests/visual-regression
- Accessibility only: npx playwright test tests/accessibility
- Mobile only: npx playwright test tests/mobile
- Performance only: npx playwright test tests/performance

Targeted runs
- Single file: npx playwright test tests/accessibility/a11y.spec.ts
- Single test by name: npx playwright test -g "Button hover states"
- Specific device project: npx playwright test --project="iPhone 12" tests/mobile

Reports
- npx playwright show-report (HTML written to test-results/html via config)

Notes
- Playwright config starts a dev server automatically (webServer command: npm run dev, baseURL http://localhost:3000).

## Architecture (big picture)

- Next.js App Router (app/)
  - app/layout.tsx wires global fonts, ThemeProvider, AccessibilityProvider, SidebarNav, GlobalHeader, WebVitals. Most pages are server components; client components use 'use client'.
  - Middleware (middleware.ts → lib/supabase/middleware.ts) refreshes Supabase sessions and protects authenticated routes (e.g., /dashboard, /profile, /projects, /docs). Unauthed users are redirected to /auth/login.

- API/Edge layer (app/api/*)
  - Chat streaming: app/api/chat/route.ts
    - Normalizes messages, selects model, and streams SSE from either Azure OpenAI (if AZURE_* env set) or OpenAI (OPENAI_API_KEY). Provider selection is based on the model string (openai/*, anthropic/*, google/*, xai/*, crowelogic/*).
    - System prompts vary by agent (deepparallel, deepthought, deepvision); optional reasoning traces included in-stream.
  - Stripe
    - app/actions/stripe.ts server action creates embedded checkout sessions using lib/stripe.ts.
    - app/api/stripe/checkout/route.ts creates subscription checkout sessions (uses NEXT_PUBLIC_APP_URL for return URLs).
    - app/api/webhooks/stripe/route.ts handles subscription lifecycle (creates user_subscriptions rows, updates users table, and sends emails via Resend).
  - Workbench (multi-agent research)
    - app/api/workbench/* endpoints back the research workflow (sessions, hypotheses, agents) used by pages under app/workbench/.

- Services & domain logic (lib/)
  - Supabase SSR clients: lib/supabase/{client,server,middleware}.ts
  - Payments/products: lib/{stripe,products,premium-products,subscription}.ts
    - lib/subscription.ts defines tier features and gates Azure AI access (expert/master).
  - AI catalog and pricing: lib/ai-models.ts (multi-provider model registry and cost calculation).
  - Usage limits and metering: lib/usage-tracking.ts (tiers, daily limits, basic cost math).
  - Design system tokens: lib/design-system.ts (colors/typography/spacing/glass/animations, used across components).

- UI composition (components/)
  - Chat experience is composed from components/chat/* (agent switcher, multimodal input, conversation history, reasoning trace, code editor). ChatContainer coordinates SSE streaming, message persistence via /api/conversations, image attachments, and optional reasoning trace parsing.
  - Shared UI primitives live in components/ui/* (Radix-based controls) and app-level navigation/header/footer components.

- Styling
  - Tailwind CSS v4 with global styles in app/globals.css and mobile-specific overrides (app/mobile-optimizations.css, app/mobile-performance.css). Font stacks and fallbacks are tuned in app/layout.tsx to minimize layout shift.

- Quality & testing
  - Playwright config (playwright.config.ts) defines multi-project runs across desktop/mobile (Chromium, Firefox, WebKit) with reporters to test-results/{html,json}. Suites:
    - tests/visual-regression (light/dark themes across viewports)
    - tests/accessibility (axe-core WCAG A/AA checks, keyboard nav, ARIA)
    - tests/mobile (responsive/layout/touch targets)
    - tests/performance (Lighthouse desktop/mobile thresholds and Web Vitals probes)

## Environment & operations

- See README.md for prerequisites and full env var list. Locally, create .env.local from .env.example and set:
  - Supabase: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - OpenAI or AI Gateway: OPENAI_API_KEY (or gateway key)
  - Optional Azure routing: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_NAME
  - Stripe: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
  - Resend: RESEND_API_KEY

- Deployment: Vercel recommended (README has exact steps). Next.js build ignores type and ESLint errors at build time, so run manual type-check and lint locally before shipping.

## References

- README.md: stack overview, feature highlights, and basic workflow.
- docs/technical/ARCHITECTURE.md: end-to-end system, routing map, DB schema, and AI orchestration concepts.
- AI_PROVIDER_ROUTING.md and AI_MODEL_CONFIGURATION.md: model strings, routing rules, and defaults (e.g., openai/gpt-4o-mini).
- tests/*/README.md: deeper guidance for each suite and CI examples.
