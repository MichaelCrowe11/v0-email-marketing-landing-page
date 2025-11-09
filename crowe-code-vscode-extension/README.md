# Crowe Code

<div align="center">

**Autonomous AI Developer for Biological Systems & Agricultural Data Science**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/MichaelCrowe11/v0-email-marketing-landing-page)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85.0+-0098FF.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)

*Intelligent code generation powered by Claude 4.5 Sonnet*

[Features](#-features) • [Installation](#-installation) • [Getting Started](#-getting-started) • [Commands](#-commands-reference) • [Support](#-support)

</div>

---

## 📖 Overview

Crowe Code is an intelligent VS Code extension designed specifically for agricultural data scientists, biologists, and researchers working with cultivation data, environmental sensors, and biological systems. Powered by Claude 4.5 Sonnet, it provides context-aware code generation, real-time AI assistance, and specialized tools for agricultural data analysis.

## ✨ Features

### 🤖 AI Chat Panel

- **Real-time Streaming**: Watch responses generate token-by-token with Claude 4.5
- **Context-Aware**: Maintains conversation history for better code generation
- **Persistent History**: Your chat sessions are saved locally
- **Native UI**: Beautiful, VS Code-themed interface

### ⚡ Quick Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| **Generate Code** | `Ctrl+Shift+G` / `Cmd+Shift+G` | Create code from natural language descriptions |
| **Explain Code** | `Ctrl+Shift+E` / `Cmd+Shift+E` | Get detailed explanations of selected code |
| **Refactor** | Context Menu | Improve code structure and readability |
| **Optimize** | Context Menu | Enhance performance and efficiency |
| **Add Comments** | Context Menu | Generate comprehensive documentation |
| **Fix Bug** | Command Palette | AI-powered debugging assistance |

### 🎯 Smart Integrations

**Context Menu**: Right-click on selected code to instantly:
- Explain complex algorithms
- Refactor for best practices
- Optimize for performance
- Add professional documentation

**Status Bar**: Real-time usage tracking with:
- Visual quota indicators
- Quick access to chat panel
- Color-coded alerts for usage limits

## 📦 Installation

### Option 1: From VSIX (Recommended)

1. Download the latest `crowe-code-1.0.0.vsix` release
2. Open VS Code
3. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
4. Type **"Extensions: Install from VSIX..."**
5. Select the downloaded `.vsix` file
6. Reload VS Code when prompted

### Option 2: From Source

For development or customization:

```bash
# Clone and navigate to extension directory
cd crowe-code-vscode-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Launch Extension Development Host
# Press F5 in VS Code
```

## 🚀 Getting Started

### Step 1: Authentication

1. Click the **Crowe Code** icon in the status bar (bottom-right)
2. Or use Command Palette: `Crowe Code: Sign In`
3. Your browser will open for authentication
4. Copy the access token provided
5. Paste it into the VS Code prompt

### Step 2: Open Chat Panel

**Method 1**: Click the Crowe Code icon in the Activity Bar (left sidebar)

**Method 2**: Use keyboard shortcut
- Windows/Linux: `Ctrl+Shift+C`
- Mac: `Cmd+Shift+C`

**Method 3**: Command Palette → `Crowe Code: Open Chat Panel`

### Step 3: Start Coding!

Try these example prompts:

```text
Generate a function to analyze soil contamination patterns
```

```text
Create a yield forecasting model using historical data
```

```text
Optimize this query for real-time sensor data processing
```

## ⚙️ Configuration

Access settings: `File > Preferences > Settings > Extensions > Crowe Code`

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `croweCode.apiEndpoint` | `string` | `https://crowelogic.com` | Backend API endpoint URL |
| `croweCode.autoComplete` | `boolean` | `true` | Enable AI-powered code completion |
| `croweCode.temperature` | `number` | `0.7` | AI creativity level (0.0 - 1.0) |
| `croweCode.maxTokens` | `number` | `2000` | Maximum tokens per AI response |

### Configuration Example

```json
{
  "croweCode.apiEndpoint": "https://crowelogic.com",
  "croweCode.temperature": 0.7,
  "croweCode.maxTokens": 2000
}
```

## 💡 Use Cases

### Agricultural Data Analysis

**Prompt**: "Generate a function to analyze soil contamination patterns across multiple test sites"

**Result**: Specialized code for multi-site analysis with statistical validation

### Yield Forecasting

**Prompt**: "Create a yield forecasting model using historical harvest data and environmental readings"

**Result**: Time-series prediction model with environmental factor integration

### Environmental Monitoring

**Prompt**: "Optimize this temperature and humidity monitoring query for real-time dashboard"

**Result**: Performant query with proper indexing and caching strategies

### Database Optimization

**Prompt**: "Refactor this Supabase query to improve performance with large cultivation datasets"

**Result**: Optimized query with proper pagination and selective field loading

## 📋 Commands Reference

### Global Commands

| Command | Keybinding | Context | Description |
|---------|-----------|---------|-------------|
| `Crowe Code: Open Chat Panel` | `Ctrl+Shift+C` / `Cmd+Shift+C` | Always | Open AI chat sidebar |
| `Crowe Code: Generate Code` | `Ctrl+Shift+G` / `Cmd+Shift+G` | Always | Generate code from prompt |
| `Crowe Code: Explain Selected Code` | `Ctrl+Shift+E` / `Cmd+Shift+E` | Text Selected | Explain code in chat |
| `Crowe Code: Sign In` | — | Always | Authenticate with Crowe Code |
| `Crowe Code: Sign Out` | — | Always | Sign out from Crowe Code |

### Context Menu Commands

| Command | When Available | Action |
|---------|---------------|--------|
| `Crowe Code: Refactor Code` | Text Selected | Improve code structure |
| `Crowe Code: Optimize Code` | Text Selected | Enhance performance |
| `Crowe Code: Add Documentation Comments` | Text Selected | Generate docstrings |
| `Crowe Code: Fix Bug` | Always | AI-powered debugging |

## 🏗️ Architecture

```text
crowe-code-vscode-extension/
├── src/
│   ├── extension.ts              # Extension entry point & activation
│   ├── api/
│   │   └── CroweCodeAPI.ts       # API client with streaming support
│   ├── panels/
│   │   └── ChatPanel.ts          # Webview-based chat interface
│   ├── commands/
│   │   └── index.ts              # Command handlers & logic
│   ├── statusBar.ts              # Status bar quota manager
│   └── utils/
│       ├── getNonce.ts           # Security nonce generation
│       └── logger.ts             # Centralized logging system
├── assets/
│   ├── icon.png                  # Extension icon (128x128)
│   └── sidebar-icon.svg          # Activity bar icon
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🔌 API Integration

Crowe Code connects to the Crowe Logic platform backend using the following endpoints:

### Streaming Chat Endpoint

**POST** `/api/crowe-code/stream`

```typescript
// Request
{
  "prompt": "Generate a contamination analysis function",
  "context": [
    { "role": "user", "content": "Previous message..." },
    { "role": "assistant", "content": "Previous response..." }
  ]
}

// Response: Server-Sent Events (SSE) stream
// AI SDK v5 format with real-time token streaming
```

### Usage Quota Endpoint

**GET** `/api/usage/quota`

```typescript
// Response
{
  "used": 5,
  "remaining": 5,
  "quota": 10
}
```

## 🛠️ Development

### Build Commands

```bash
# Compile TypeScript
npm run compile

# Watch mode (auto-compile on changes)
npm run watch

# Lint code
npm run lint

# Package extension
npm run package
```

### Testing

1. Open the extension project in VS Code
2. Press `F5` to launch Extension Development Host
3. Test features in the development window
4. View logs in Debug Console

### Packaging for Distribution

```bash
npm run package
```

This creates `crowe-code-1.0.0.vsix` ready for distribution or marketplace publishing.

## 🔧 Troubleshooting

### Extension Not Activating

**Symptoms**: Commands not appearing, icon missing from Activity Bar

**Solutions**:
- ✅ Verify VS Code version is `1.85.0` or higher
- ✅ Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
- ✅ Check Output panel: "View" → "Output" → Select "Crowe Code"

### Streaming Not Working

**Symptoms**: Responses not appearing, connection errors

**Solutions**:
- ✅ Verify API endpoint in settings (`croweCode.apiEndpoint`)
- ✅ Check network connectivity to `crowelogic.com`
- ✅ Sign out and sign in again to refresh token
- ✅ Check firewall/proxy settings for HTTPS connections

### Commands Not Appearing

**Symptoms**: Context menu items missing, keyboard shortcuts not working

**Solutions**:
- ✅ Reload VS Code window
- ✅ Check for extension conflicts (disable other AI extensions temporarily)
- ✅ Verify keybinding conflicts: `File > Preferences > Keyboard Shortcuts`
- ✅ Ensure text is selected for selection-based commands

### Authentication Issues

**Symptoms**: "Unauthorized" errors, sign-in failures

**Solutions**:
- ✅ Clear stored credentials: Sign out completely
- ✅ Re-authenticate using `Crowe Code: Sign In`
- ✅ Verify access token hasn't expired
- ✅ Contact support if issues persist

## 🔐 Privacy & Security

Crowe Code is built with security and privacy as top priorities:

- 🔒 **Encrypted Token Storage**: Access tokens stored using VS Code Secrets API (encrypted)
- 🔒 **HTTPS Only**: All API requests use secure HTTPS connections
- 🔒 **No Cloud Storage**: Code is never stored on servers (streaming only)
- 🔒 **Local History**: Chat history stored locally in VS Code extension state
- 🔒 **Input Validation**: Full validation on all webview messages to prevent XSS
- 🔒 **Content Security Policy**: Strict CSP with nonce-based script execution
- 🔒 **No Telemetry**: No tracking, analytics, or data collection

## 🧰 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **TypeScript** | Type-safe development | 5.2.2 |
| **VS Code Extension API** | Native VS Code integration | 1.85.0+ |
| **Webview API** | Custom chat UI panels | — |
| **AI SDK v5** | Streaming AI responses | 1.1.2 |
| **Claude 4.5 Sonnet** | Code generation model | Latest |
| **eventsource-parser** | SSE stream parsing | 1.1.2 |

## 📞 Support

We're here to help! Reach out through any of these channels:

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/crowe-logic/crowe-code/issues)
- 📚 **Documentation**: [crowelogic.com/docs](https://crowelogic.com/docs)
- 📧 **Email Support**: [support@crowelogic.com](mailto:support@crowelogic.com)
- 💬 **Community**: Join our Discord server (coming soon)

## 📄 License

**Proprietary License** - Crowe Logic © 2025

All rights reserved. This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited.

## 📝 Changelog

### Version 1.0.0 (November 8, 2025)

**🎉 Initial Release**

#### Features
- ✨ AI chat panel with real-time streaming responses
- ✨ Context menu integration for code operations
- ✨ Status bar with usage quota tracking
- ✨ OAuth authentication flow
- ✨ Keyboard shortcuts for common operations
- ✨ Persistent chat history
- ✨ Code insertion and explanation features

#### Security
- 🔒 VS Code Secrets API for encrypted token storage
- 🔒 Content Security Policy enforcement
- 🔒 Input validation on all webview messages

#### Developer Experience
- 🛠️ Centralized logging with OutputChannel
- 🛠️ Configuration change watchers
- 🛠️ Progress indicators for async operations
- 🛠️ TypeScript strict mode enabled

#### Accessibility
- ♿ ARIA labels and semantic HTML
- ♿ Screen reader support
- ♿ Reduced motion preferences respected

---

<div align="center">

**Made with ❤️ for Agricultural Data Scientists**

Built by [Crowe Logic](https://crowelogic.com) • Powered by [Claude 4.5 Sonnet](https://www.anthropic.com/claude)

</div>
