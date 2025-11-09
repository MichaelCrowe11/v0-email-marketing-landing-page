# Crowe Code - VS Code Extension

**Autonomous AI Developer for Biological Systems & Agricultural Data Science**

Crowe Code is an intelligent VS Code extension powered by Claude 4.5 Sonnet, designed specifically for agricultural data scientists, biologists, and researchers working with cultivation data, environmental sensors, and biological systems.

## Features

### 🤖 AI Chat Panel
- Real-time streaming conversations with Claude 4.5
- Context-aware code generation
- Persistent chat history
- Beautiful, native VS Code UI

### ⌨️ Quick Commands
- **Generate Code** (`Ctrl+Shift+G` / `Cmd+Shift+G`): Generate code from natural language
- **Explain Code** (`Ctrl+Shift+E` / `Cmd+Shift+E`): Get detailed explanations of selected code
- **Refactor**: Improve code structure and readability
- **Optimize**: Enhance performance and efficiency
- **Add Comments**: Generate comprehensive documentation
- **Fix Bug**: Describe a bug and get AI-powered fixes

### 📊 Context Menu Integration
Right-click on selected code to access:
- Explain Selected Code
- Refactor Code
- Optimize Code
- Add Documentation Comments

### 📈 Status Bar Integration
- Real-time usage quota display
- Visual indicators for remaining requests
- Quick access to chat panel

## Installation

### From VSIX (Recommended)
1. Download `crowe-code-1.0.0.vsix`
2. Open VS Code
3. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
4. Type "Install from VSIX"
5. Select the downloaded file

### From Source
```bash
cd crowe-code-vscode-extension
npm install
npm run compile
```

Press `F5` to launch extension development host.

## Getting Started

1. **Sign In**
   - Click the status bar item "Crowe Code"
   - Or run command: "Crowe Code: Sign In"
   - Authenticate via browser
   - Paste access token when prompted

2. **Open Chat Panel**
   - Click the Crowe Code icon in the activity bar
   - Or press `Ctrl+Shift+C` / `Cmd+Shift+C`
   - Start chatting with your AI assistant!

3. **Generate Code**
   - Press `Ctrl+Shift+G` / `Cmd+Shift+G`
   - Describe what you want to build
   - Code will be inserted at cursor position

4. **Explain Code**
   - Select code in editor
   - Press `Ctrl+Shift+E` / `Cmd+Shift+E`
   - Get detailed explanation in chat panel

## Configuration

Access settings via `File > Preferences > Settings > Crowe Code`

| Setting | Default | Description |
|---------|---------|-------------|
| `croweCode.apiEndpoint` | `https://crowelogic.com` | API endpoint URL |
| `croweCode.autoComplete` | `true` | Enable AI code completion |
| `croweCode.temperature` | `0.7` | AI creativity (0-1) |
| `croweCode.maxTokens` | `2000` | Max tokens per response |

## Use Cases

### Agricultural Data Analysis
```
Generate a function to analyze soil contamination patterns across multiple test sites
```

### Yield Forecasting
```
Create a yield forecasting model using historical harvest data and environmental readings
```

### Environmental Monitoring
```
Optimize this temperature and humidity monitoring query for real-time dashboard
```

### Database Optimization
```
Refactor this Supabase query to improve performance with large cultivation datasets
```

## Commands Reference

| Command | Keybinding | Description |
|---------|-----------|-------------|
| Open Chat Panel | `Ctrl+Shift+C` | Open AI chat sidebar |
| Generate Code | `Ctrl+Shift+G` | Generate code from prompt |
| Explain Code | `Ctrl+Shift+E` | Explain selected code |
| Refactor | Context menu | Improve code structure |
| Optimize | Context menu | Enhance performance |
| Add Comments | Context menu | Generate documentation |
| Sign In | Command palette | Authenticate with Crowe Code |
| Sign Out | Command palette | Sign out |

## Architecture

```
Extension Structure:
├── src/
│   ├── extension.ts          # Main entry point
│   ├── api/
│   │   └── CroweCodeAPI.ts   # API client with streaming
│   ├── panels/
│   │   └── ChatPanel.ts      # Chat webview provider
│   ├── commands/
│   │   └── index.ts          # Command handlers
│   ├── statusBar.ts          # Status bar manager
│   └── utils/
│       └── getNonce.ts       # Security utilities
├── assets/                    # Icons and images
├── package.json              # Extension manifest
└── tsconfig.json             # TypeScript config
```

## API Integration

Crowe Code connects to your Crowe Logic platform backend:

**Streaming Chat Endpoint**: `POST /api/crowe-code/stream`
```typescript
{
  "prompt": "Generate a contamination analysis function",
  "context": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Usage Quota Endpoint**: `GET /api/usage/quota`
```typescript
{
  "used": 5,
  "remaining": 5,
  "quota": 10
}
```

## Development

### Building
```bash
npm run compile
```

### Watching
```bash
npm run watch
```

### Packaging
```bash
npm run package
```

This creates `crowe-code-1.0.0.vsix` for distribution.

### Testing
```bash
# Press F5 in VS Code to launch Extension Development Host
```

## Tech Stack

- **TypeScript** - Type-safe development
- **VS Code Extension API** - Native integration
- **Webview API** - Custom UI panels
- **AI SDK v5** - Streaming AI responses
- **Claude 4.5 Sonnet** - Code generation model

## Troubleshooting

### Extension not activating
- Check VS Code version >= 1.85.0
- Reload window: `Ctrl+Shift+P` > "Reload Window"

### Streaming not working
- Verify API endpoint in settings
- Check network connectivity
- Sign out and sign in again

### Commands not appearing
- Reload window
- Check for extension conflicts
- Verify keybinding conflicts in `File > Preferences > Keyboard Shortcuts`

## Privacy & Security

- Access tokens stored securely using VS Code Secrets API (encrypted storage)
- All requests use HTTPS
- No code is stored on servers (streaming only)
- Chat history stored locally in extension state
- Full input validation on all webview messages
- Content Security Policy enforced with nonce-based scripts

## Support

- **Issues**: [GitHub Issues](https://github.com/crowe-logic/crowe-code/issues)
- **Docs**: [crowelogic.com/docs](https://crowelogic.com/docs)
- **Email**: support@crowelogic.com

## License

Proprietary - Crowe Logic © 2025

## Changelog

### 1.0.0 (2025-11-08)
- Initial release
- AI chat panel with streaming
- Context menu commands
- Status bar integration
- OAuth authentication
- Usage quota tracking
