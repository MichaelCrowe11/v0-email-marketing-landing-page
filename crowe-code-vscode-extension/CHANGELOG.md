# Changelog

All notable changes to the Crowe Code VS Code extension will be documented in this file.

## [1.0.0] - 2025-11-08

### Added
- 🚀 Initial release of Crowe Code for VS Code
- 💬 AI-powered chat panel with real-time streaming responses
- ⌨️ Quick commands for code generation, explanation, refactoring, and optimization
- 📊 Context menu integration for selected code actions
- 📈 Status bar with usage quota tracking
- 🔐 OAuth authentication with Crowe Logic platform
- 🎨 Beautiful webview UI matching VS Code theme
- 📝 Comprehensive documentation and code comments
- ⚡ Support for all major programming languages (Python, JavaScript, TypeScript, etc.)
- 🧬 Specialized for agricultural data science and biological systems

### Features
- **Chat Panel**: Persistent sidebar panel for AI conversations
- **Streaming**: Real-time token-by-token response streaming
- **Code Generation**: Natural language to code with `Ctrl+Shift+G`
- **Code Explanation**: Explain selected code with `Ctrl+Shift+E`
- **Code Refactoring**: Improve code structure via context menu
- **Code Optimization**: Enhance performance and efficiency
- **Documentation**: Auto-generate comments and docstrings
- **Bug Fixing**: AI-assisted debugging and fixes
- **Usage Tracking**: Real-time quota display in status bar

### Technical
- Built with TypeScript and VS Code Extension API
- AI SDK v5 integration for streaming
- Claude 4.5 Sonnet model
- Webview-based chat UI
- Event-source parser for SSE streams
- Secure token storage in VS Code global state

### Security
- HTTPS-only API communication
- No code stored on servers
- Local chat history storage
- Token-based authentication
