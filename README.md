# Crowe Logic AI Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/michael-9927s-projects/v0-email-marketing-landing-page)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## Overview

Crowe Logic AI is a comprehensive mycology platform combining advanced AI orchestration, visual analysis, and 20+ years of cultivation expertise from Southwest Mushrooms. Built with Next.js 14, React, TypeScript, and powered by GPT-4 and Claude AI models.

## Key Features

### 🤖 AI Chat Assistant
- Natural language conversations with expert mycology AI
- Visible Reasoning Summary (VRS) for transparent decision-making
- Multi-model orchestration (GPT-4, Claude, specialized models)
- Unlimited chat for Premium users

### 🔬 Visual Analysis
- Contamination detection with confidence levels
- Species identification from photos
- Growth stage assessment
- Annotated images with evidence ledgers

### 📚 Knowledge Base
- 50+ species profiles with detailed growing requirements
- Comprehensive cultivation guides and SOPs
- Contamination identification and remediation
- Searchable library with 500+ articles

### 📊 Project Management
- Track cultivation projects from start to harvest
- Log observations and environmental data
- Photo documentation with timestamps
- Progress tracking and yield metrics

### 👥 Community Forum
- Connect with cultivators worldwide
- Share experiences and troubleshoot together
- Species-specific discussions
- Commercial operations section (Professional tier)

### 🛍️ Integrated Shop
- Cultivation supplies and equipment
- Premium products (Crowe Logic Mini)
- Digital courses and certifications
- Secure checkout with Stripe

## Recent UI/UX Enhancements

### Navigation & Accessibility
- ✅ Enhanced sidebar navigation with grouped sections
- ✅ Comprehensive keyboard shortcuts (Ctrl/⌘ + K for search)
- ✅ WCAG 2.1 AA compliant accessibility
- ✅ Screen reader support with ARIA labels
- ✅ Reduced motion support for animations

### Visual Design
- ✅ Premium glass morphism effects throughout
- ✅ Consistent design system with CSS variables
- ✅ Smooth theme switching (light/dark mode)
- ✅ Animated code particles and AI visualizations
- ✅ Staggered reveal animations for content

### Mobile Optimization
- ✅ Fully responsive design for all screen sizes
- ✅ Touch-optimized controls (44x44px minimum)
- ✅ Swipe gestures for navigation
- ✅ iOS-specific fixes (zoom prevention, safe areas)
- ✅ Optimized performance on mobile networks

### Performance
- ✅ Core Web Vitals optimization (LCP < 2.5s)
- ✅ Next.js Image optimization with WebP/AVIF
- ✅ Code splitting and lazy loading
- ✅ GPU-accelerated animations
- ✅ Service worker for offline support

### Trust & Credibility
- ✅ Prominent display of expertise and credentials
- ✅ Testimonials and case studies
- ✅ Security badges and guarantees
- ✅ Transparent pricing and policies

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: React Context + Hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images
- **Payments**: Stripe
- **Email**: Resend

### AI Integration
- **Models**: OpenAI GPT-4, Anthropic Claude
- **Orchestration**: Custom multi-model routing
- **Image Analysis**: GPT-4 Vision
- **Embeddings**: OpenAI text-embedding-3

### Infrastructure
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics
- **Monitoring**: Vercel Speed Insights

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account and project
- OpenAI API key
- Anthropic API key
- Stripe account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/crowe-logic-ai.git
cd crowe-logic-ai

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and configuration

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Environment Variables

Required environment variables (see `.env.example` for complete list):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Resend
RESEND_API_KEY=your_resend_api_key
```

## Project Structure

```
crowe-logic-ai/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── chat/              # Chat interface
│   ├── dashboard/         # User dashboard
│   ├── knowledge-base/    # Knowledge base articles
│   └── ...
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── chat/             # Chat-specific components
│   └── ...
├── lib/                   # Utility libraries
│   ├── ai/               # AI integration
│   ├── supabase/         # Database utilities
│   └── ...
├── docs/                  # Documentation
│   └── user-guide/       # User documentation
├── tests/                 # Test suites
│   ├── accessibility/    # A11y tests
│   ├── mobile/           # Mobile tests
│   ├── performance/      # Performance tests
│   └── visual-regression/ # Visual tests
└── public/               # Static assets
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript checks

# Testing
npm run test            # Run all tests
npm run test:a11y       # Run accessibility tests
npm run test:mobile     # Run mobile tests
npm run test:perf       # Run performance tests
npm run test:visual     # Run visual regression tests

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database
npm run db:reset        # Reset database
```

### Component Development

Components follow a consistent pattern:

```typescript
// components/example-component.tsx
'use client'

import { useState } from 'react'

interface ExampleComponentProps {
  title: string
  onAction?: () => void
}

export function ExampleComponent({ title, onAction }: ExampleComponentProps) {
  const [state, setState] = useState(false)

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      {/* Component content */}
    </div>
  )
}
```

### Design System

The platform uses a comprehensive design system defined in `lib/design-system.ts`:

```typescript
import { designSystem } from '@/lib/design-system'

// Use design tokens
const styles = {
  color: designSystem.colors.primary,
  spacing: designSystem.spacing.md,
  borderRadius: designSystem.borderRadius.lg,
}
```

See [Design System Documentation](.kiro/specs/ui-ux-enhancement/DESIGN_SYSTEM.md) for details.

## Testing

### Accessibility Testing
```bash
npm run test:a11y
```
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast validation

### Mobile Testing
```bash
npm run test:mobile
```
- Responsive layouts
- Touch interactions
- iOS and Android specific tests
- Multiple device sizes

### Performance Testing
```bash
npm run test:perf
```
- Core Web Vitals
- Lighthouse audits
- Load time benchmarks
- Runtime performance

### Visual Regression Testing
```bash
npm run test:visual
```
- Screenshot comparison
- Cross-browser testing
- Theme variations
- Component states

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Documentation

- [User Guide](docs/user-guide/getting-started.md) - Getting started guide for users
- [Features Overview](docs/user-guide/features-overview.md) - Comprehensive feature documentation
- [Keyboard Shortcuts](docs/user-guide/keyboard-shortcuts.md) - All keyboard shortcuts
- [Design System](.kiro/specs/ui-ux-enhancement/DESIGN_SYSTEM.md) - Design tokens and guidelines
- [Component Library](.kiro/specs/ui-ux-enhancement/COMPONENT_LIBRARY.md) - Component documentation
- [API Documentation](docs/api/README.md) - API reference (Professional tier)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is proprietary software owned by Southwest Mushrooms / Crowe Logic AI.

## Support

- **Documentation**: [docs/user-guide](docs/user-guide)
- **Community Forum**: [forum.crowelogic.ai](https://forum.crowelogic.ai)
- **Email Support**: support@crowelogic.ai
- **Premium Support**: Available for Premium and Professional tier users

## Acknowledgments

- Built with expertise from 20+ years of mycology cultivation
- Powered by OpenAI GPT-4 and Anthropic Claude
- UI/UX inspired by modern AI platforms
- Community-driven feature development

---

**Crowe Logic AI** - Intelligent Mycology Assistance 🍄
