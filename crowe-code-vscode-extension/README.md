# Crowe Code

> Autonomous AI developer for biological systems and agricultural data science

[![Version](https://img.shields.io/badge/version-1.0.0-000000.svg?style=flat-square)](https://github.com/MichaelCrowe11/v0-email-marketing-landing-page)
[![TypeScript](https://img.shields.io/badge/typescript-5.2.2-000000.svg?style=flat-square)](https://www.typescriptlang.org/)
[![VS Code](https://img.shields.io/badge/vscode-1.85.0+-000000.svg?style=flat-square)](https://code.visualstudio.com/)

---

## Overview

Crowe Code is an intelligent VS Code extension designed for agricultural data scientists, biologists, and researchers working with cultivation data, environmental sensors, and biological systems. Powered by Claude 4.5 Sonnet, it provides context-aware code generation, real-time AI assistance, and specialized tools for agricultural data analysis.

### Key Capabilities

**AI-Powered Code Generation**
Transform natural language descriptions into production-ready code tailored for agricultural and biological systems.

**Real-Time Streaming Assistance**
Interactive chat interface with Claude 4.5 Sonnet that maintains conversation context for iterative development.

**Contextual Code Operations**
Refactor, optimize, explain, and document code with AI understanding of agricultural data patterns.

**Usage Intelligence**
Built-in quota tracking and optimization for efficient API usage across your development workflow.

---

## Installation

### Install from VSIX

```
1. Download crowe-code-1.0.0.vsix
2. Open VS Code Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Select "Extensions: Install from VSIX..."
4. Choose the downloaded .vsix file
5. Reload VS Code
```

### Install from Source

```bash
cd crowe-code-vscode-extension
npm install
npm run compile
```

Press `F5` in VS Code to launch the Extension Development Host.

---

## Quick Start

### Authentication

```
Status Bar → Crowe Code → Sign In
```

Your browser will open for OAuth authentication. Copy the provided access token and paste it into VS Code when prompted.

### Open Chat Interface

| Method | Action |
|--------|--------|
| Keyboard | `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac) |
| Activity Bar | Click Crowe Code icon in left sidebar |
| Command Palette | Type "Crowe Code: Open Chat Panel" |

### Example Prompts

```
Generate a function to analyze soil contamination patterns across multiple test sites
```

```
Create a yield forecasting model using historical harvest data and environmental readings
```

```
Optimize this query for real-time sensor data processing with proper indexing
```

---

## Commands

### Global Commands

| Command | Binding | Context |
|---------|---------|---------|
| Open Chat Panel | `Ctrl+Shift+C` / `Cmd+Shift+C` | Always available |
| Generate Code | `Ctrl+Shift+G` / `Cmd+Shift+G` | Always available |
| Explain Selected Code | `Ctrl+Shift+E` / `Cmd+Shift+E` | Text selected |
| Sign In | Command Palette | Always available |
| Sign Out | Command Palette | Always available |

### Context Menu Operations

Available when text is selected:

- **Refactor Code** — Improve structure and readability
- **Optimize Code** — Enhance performance and efficiency
- **Add Documentation** — Generate comprehensive comments
- **Fix Bug** — AI-powered debugging assistance

---

## Configuration

Access extension settings via `Settings → Extensions → Crowe Code`

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `croweCode.apiEndpoint` | string | `https://crowelogic.com` | Backend API endpoint |
| `croweCode.autoComplete` | boolean | `true` | Enable AI code completion |
| `croweCode.temperature` | number | `0.7` | Model creativity (0.0 - 1.0) |
| `croweCode.maxTokens` | number | `2000` | Maximum response length |

### Configuration Example

```json
{
  "croweCode.apiEndpoint": "https://crowelogic.com",
  "croweCode.temperature": 0.7,
  "croweCode.maxTokens": 2000
}
```

---

## Use Cases

### Agricultural Data Analysis

**Input**
"Generate a function to analyze soil contamination patterns across multiple test sites"

**Output**
Specialized code for multi-site analysis with statistical validation and contamination threshold detection.

### Yield Forecasting

**Input**
"Create a yield forecasting model using historical harvest data and environmental readings"

**Output**
Time-series prediction model with environmental factor integration and confidence intervals.

### Environmental Monitoring

**Input**
"Optimize this temperature and humidity monitoring query for real-time dashboard"

**Output**
Performant query with proper indexing, caching strategies, and aggregation pipelines.

### Database Optimization

**Input**
"Refactor this Supabase query to improve performance with large cultivation datasets"

**Output**
Optimized query with pagination, selective field loading, and connection pooling.

---

## Architecture

```
crowe-code-vscode-extension/
├── src/
│   ├── extension.ts              Extension activation & lifecycle
│   ├── api/
│   │   └── CroweCodeAPI.ts       HTTP client with streaming support
│   ├── panels/
│   │   └── ChatPanel.ts          Webview chat interface
│   ├── commands/
│   │   └── index.ts              Command handlers & execution
│   ├── statusBar.ts              Usage quota management
│   └── utils/
│       ├── getNonce.ts           Security utilities
│       └── logger.ts             Centralized logging
├── assets/
│   ├── icon.png                  Extension icon (128x128)
│   └── sidebar-icon.svg          Activity bar icon
└── dist/                         Compiled JavaScript output
```

---

## API Reference

### Streaming Chat Endpoint

```
POST /api/crowe-code/stream
```

**Request Body**
```typescript
{
  "prompt": string,
  "context": Array<{
    role: "user" | "assistant",
    content: string
  }>
}
```

**Response**
Server-Sent Events (SSE) stream with AI SDK v5 format. Tokens streamed in real-time.

### Usage Quota Endpoint

```
GET /api/usage/quota
```

**Response**
```typescript
{
  "used": number,
  "remaining": number,
  "quota": number
}
```

---

## Development

### Build Commands

```bash
npm run compile       # Compile TypeScript
npm run watch         # Watch mode (auto-compile)
npm run lint          # Run ESLint
npm run package       # Create .vsix package
```

### Testing

1. Open extension directory in VS Code
2. Press `F5` to launch Extension Development Host
3. Test features in development window
4. View logs in Debug Console

### Packaging

```bash
npm run package
```

Generates `crowe-code-1.0.0.vsix` for distribution or marketplace publishing.

---

## Troubleshooting

### Extension Not Activating

**Symptoms:** Commands missing, icon not visible in Activity Bar

**Resolution:**
- Verify VS Code version is 1.85.0 or higher
- Reload window: Command Palette → "Developer: Reload Window"
- Check Output panel: View → Output → Select "Crowe Code"

### Streaming Failures

**Symptoms:** No response, connection errors, timeout issues

**Resolution:**
- Verify `croweCode.apiEndpoint` in settings
- Check network connectivity to crowelogic.com
- Re-authenticate: Sign out and sign in again
- Verify firewall/proxy allows HTTPS to API endpoint

### Command Visibility Issues

**Symptoms:** Context menu items missing, shortcuts not working

**Resolution:**
- Reload VS Code window
- Check for extension conflicts (disable other AI extensions)
- Verify keybinding conflicts: File → Preferences → Keyboard Shortcuts
- Ensure text is selected for selection-based commands

### Authentication Errors

**Symptoms:** "Unauthorized" errors, sign-in failures

**Resolution:**
- Sign out completely to clear credentials
- Re-authenticate using "Crowe Code: Sign In"
- Verify access token validity
- Contact support if issues persist

---

## Security

Crowe Code implements enterprise-grade security practices:

**Encrypted Credential Storage**
Access tokens stored using VS Code Secrets API with OS-level encryption.

**Transport Security**
All API requests use TLS 1.2+ with certificate validation.

**Local Data Storage**
Chat history and extension state stored locally. No cloud synchronization.

**Input Validation**
Comprehensive validation on all webview messages to prevent injection attacks.

**Content Security Policy**
Strict CSP enforced with nonce-based script execution.

**Zero Telemetry**
No tracking, analytics, or usage data collection.

**Code Privacy**
Source code never persisted on servers. Streaming responses only.

---

## Technology

| Component | Version | Purpose |
|-----------|---------|---------|
| TypeScript | 5.2.2 | Type-safe development |
| VS Code Extension API | 1.85.0+ | Native editor integration |
| Webview API | Native | Custom UI panels |
| AI SDK | 1.1.2 | Response streaming |
| Claude 4.5 Sonnet | Latest | Code generation |
| eventsource-parser | 1.1.2 | SSE parsing |

---

## Support

**Issue Tracking**
[github.com/crowe-logic/crowe-code/issues](https://github.com/crowe-logic/crowe-code/issues)

**Documentation**
[crowelogic.com/docs](https://crowelogic.com/docs)

**Email**
[support@crowelogic.com](mailto:support@crowelogic.com)

---

## License

Proprietary License — Crowe Logic © 2025

All rights reserved. This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## Changelog

### Version 1.0.0 — November 8, 2025

**Initial Release**

*Features*
- AI chat panel with real-time streaming
- Context menu integration for code operations
- Status bar usage quota tracking
- OAuth authentication flow
- Keyboard shortcuts for common operations
- Persistent chat history
- Code insertion and explanation

*Security*
- VS Code Secrets API for encrypted token storage
- Content Security Policy enforcement
- Input validation on all webview messages

*Developer Experience*
- Centralized logging with OutputChannel
- Configuration change watchers
- Progress indicators for async operations
- TypeScript strict mode

*Accessibility*
- ARIA labels and semantic HTML
- Screen reader support
- Reduced motion preferences

---

<p align="center">
  <sub>Built by <a href="https://crowelogic.com">Crowe Logic</a> • Powered by <a href="https://www.anthropic.com/claude">Claude 4.5 Sonnet</a></sub>
</p>
