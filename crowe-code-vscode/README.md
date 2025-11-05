# Crowe Code - VS Code Extension

**AI-powered code generation at the speed of thought.**

Crowe Code brings the power of Crowe Logic's Research IDE directly into your VS Code editor. Generate code, fix bugs, refactor, and chat with 6 specialized AI agents—all without leaving your IDE.

## Features

### ⚡ **Lightning-Fast Code Generation**
- Inline completions powered by DeepSeek-V3.1 (Crowe Code agent)
- 90% cost reduction vs GPT-4 with comparable quality
- Works across all programming languages

### 🤖 **6 Specialized AI Agents**
Choose the right AI for the job:
- **Crowe Code** - Lightning-fast code generation
- **Crowe Logic** - Production-grade coding assistant
- **Crowe Logic Reasoning** - Complex problem-solving (O1)
- **DeepParallel** - Fast tactical reasoning
- **DeepThought** - Deep philosophical analysis
- **DeepVision** - Visual analysis (coming soon)

### 🔧 **Powerful Commands**
- `Ctrl+Shift+G` - Generate code from description
- `Ctrl+Shift+C` - Open chat panel
- Right-click → **Crowe Code: Explain Code**
- Right-click → **Crowe Code: Refactor Code**
- Right-click → **Crowe Code: Fix Bug**

### 💬 **Built-in Chat**
Full Research IDE chat experience in VS Code sidebar:
- Context-aware conversations
- Code-focused responses
- Multi-turn dialogue
- Markdown & syntax highlighting

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Crowe Code"
4. Click Install

### From VSIX File
```bash
code --install-extension crowe-code-0.1.0.vsix
```

## Setup

1. **Get API Key**
   - Sign up at [crowelogic.ai](https://crowelogic.ai)
   - Navigate to Settings → API Keys
   - Copy your API key

2. **Configure Extension**
   - Open VS Code Settings (Ctrl+,)
   - Search for "Crowe Code"
   - Paste your API key in `croweCode.apiKey`

3. **Start Coding!**
   - Press `Ctrl+Shift+G` to generate code
   - Type a description and watch Crowe Code create it

## Usage Examples

### Generate a React Component
1. Open a `.tsx` file
2. Press `Ctrl+Shift+G`
3. Type: "Create a user profile card component with avatar, name, and bio"
4. Code appears instantly!

### Fix a Bug
1. Select buggy code
2. Right-click → **Crowe Code: Fix Bug**
3. Describe the error or paste error message
4. Get fixed code with explanation

### Refactor for Performance
1. Select code to refactor
2. Right-click → **Crowe Code: Refactor Code**
3. Choose "Improve performance"
4. Get optimized code

### Chat with AI
1. Press `Ctrl+Shift+C` to open chat
2. Ask questions like:
   - "How do I implement authentication in Next.js?"
   - "Explain the difference between useEffect and useLayoutEffect"
   - "Write a Python script to parse CSV files"

## Configuration

### API Settings
```json
{
  "croweCode.apiEndpoint": "https://crowelogic.ai/api",
  "croweCode.apiKey": "your-api-key-here"
}
```

### Agent Settings
```json
{
  "croweCode.defaultAgent": "croweCode",  // or "croweLogic", "o1", etc.
}
```

### Completion Settings
```json
{
  "croweCode.enableInlineCompletions": true,
  "croweCode.completionDelay": 500  // milliseconds
}
```

## Keyboard Shortcuts

| Command | Windows/Linux | macOS |
|---------|---------------|-------|
| Generate Code | `Ctrl+Shift+G` | `Cmd+Shift+G` |
| Open Chat | `Ctrl+Shift+C` | `Cmd+Shift+C` |

## Pricing

- **Free**: 10 generations/day with Crowe Code agent
- **Pro** ($29/mo): Unlimited with all agents except O1
- **Enterprise** ($99/mo): Everything + O1 reasoning model

[Sign up at crowelogic.ai](https://crowelogic.ai)

## Requirements

- VS Code 1.85.0 or higher
- Active internet connection
- Crowe Logic API key

## Extension Settings

This extension contributes the following settings:

* `croweCode.apiEndpoint`: API endpoint for Crowe Logic Research IDE
* `croweCode.apiKey`: Your Crowe Logic API key
* `croweCode.defaultAgent`: Default AI agent for code generation
* `croweCode.enableInlineCompletions`: Enable/disable inline completions
* `croweCode.completionDelay`: Delay before triggering completions (ms)

## Known Issues

- Inline completions may not work in all file types
- Chat history is not persisted between sessions (coming soon)
- Streaming responses not yet supported in chat view

## Roadmap

- [ ] Streaming chat responses
- [ ] Persistent chat history
- [ ] Multi-file context awareness
- [ ] Workspace-wide refactoring
- [ ] Team collaboration features
- [ ] Custom agent training

## Support

- [Documentation](https://docs.crowelogic.ai)
- [Discord Community](https://discord.gg/crowelogic)
- [GitHub Issues](https://github.com/crowelogic/crowe-code-vscode/issues)
- Email: support@crowelogic.com

## Privacy

Crowe Code sends your code snippets to our secure API for processing. We:
- ✅ Encrypt all data in transit (TLS 1.3)
- ✅ Never store your code permanently
- ✅ Never train on your code without permission
- ✅ GDPR & SOC 2 compliant

[Read full Privacy Policy](https://crowelogic.ai/privacy)

## Release Notes

### 0.1.0 (2025-01-05)
- Initial release
- Inline code completions
- Code generation, explanation, refactoring
- Bug fixing with O1 reasoning
- 6 AI agents
- Built-in chat panel
- Agent switcher

---

**Enjoy coding at the speed of thought!** ⚡

*Made with ❤️ by Crowe Logic*
