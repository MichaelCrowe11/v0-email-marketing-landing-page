# Crowe Code VS Code Extension - Installation Guide

Complete step-by-step installation and deployment instructions for the Crowe Code VS Code extension.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Setup](#development-setup)
3. [Testing the Extension](#testing-the-extension)
4. [Building for Production](#building-for-production)
5. [Installation Methods](#installation-methods)
6. [Publishing to VS Code Marketplace](#publishing-to-vs-code-marketplace)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **VS Code** >= 1.85.0
- **TypeScript** knowledge (for development)

### Install Dependencies

```bash
cd crowe-code-vscode-extension
npm install
```

### Compile TypeScript

```bash
npm run compile
```

### Launch Extension Development Host

Press **F5** in VS Code or run:

```bash
code --extensionDevelopmentPath=$(pwd)
```

---

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MichaelCrowe11/v0-email-marketing-landing-page
cd v0-email-marketing-landing-page/crowe-code-vscode-extension
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure VS Code

The `.vscode/` directory contains pre-configured files:
- `launch.json` - Debugging configuration
- `tasks.json` - Build tasks

### 4. Build the Extension

**One-time build:**
```bash
npm run compile
```

**Watch mode (recommended for development):**
```bash
npm run watch
```

This will automatically recompile on file changes.

---

## Testing the Extension

### Method 1: Press F5 (Recommended)

1. Open the extension folder in VS Code
2. Press **F5** to launch Extension Development Host
3. A new VS Code window opens with the extension loaded
4. Test all features:
   - Open chat panel: `Ctrl+Shift+C`
   - Generate code: `Ctrl+Shift+G`
   - Explain code: Select text + `Ctrl+Shift+E`
   - Context menu: Right-click selected code

### Method 2: Command Line

```bash
code --extensionDevelopmentPath=/workspaces/v0-email-marketing-landing-page/crowe-code-vscode-extension
```

### Method 3: Install Locally (for testing)

```bash
# Package the extension
npm run package

# Install in VS Code
code --install-extension crowe-code-1.0.0.vsix
```

### Testing Checklist

- [ ] Extension activates on VS Code startup
- [ ] Chat panel opens in sidebar
- [ ] Streaming responses work correctly
- [ ] Code generation command works
- [ ] Code explanation command works
- [ ] Context menu items appear on selected code
- [ ] Status bar shows usage quota
- [ ] Sign in/out flow works
- [ ] Code insertion at cursor works
- [ ] Copy to clipboard works
- [ ] Chat history persists across sessions

---

## Building for Production

### 1. Clean Build

```bash
# Remove old build artifacts
rm -rf dist node_modules

# Fresh install
npm install

# Compile
npm run compile
```

### 2. Verify Compilation

```bash
# Check that all files compiled
ls -lh dist/

# Should see:
# - extension.js
# - api/CroweCodeAPI.js
# - panels/ChatPanel.js
# - commands/index.js
# - statusBar.js
# - utils/getNonce.js
```

### 3. Update Version (if needed)

Edit `package.json`:
```json
{
  "version": "1.0.1"
}
```

### 4. Package the Extension

```bash
npm run package
```

This creates `crowe-code-1.0.0.vsix` in the root directory.

### 5. Verify Package Contents

```bash
# List contents of VSIX
unzip -l crowe-code-1.0.0.vsix
```

Expected structure:
```
extension/
├── dist/          # Compiled JavaScript
├── assets/        # Icons and images
├── package.json   # Manifest
├── README.md      # Documentation
└── CHANGELOG.md   # Release notes
```

---

## Installation Methods

### Method 1: Install from VSIX (End Users)

**For Windows:**
```powershell
code --install-extension crowe-code-1.0.0.vsix
```

**For macOS/Linux:**
```bash
code --install-extension crowe-code-1.0.0.vsix
```

**Via VS Code UI:**
1. Open VS Code
2. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
3. Type "Install from VSIX"
4. Select `crowe-code-1.0.0.vsix`

### Method 2: Install from Marketplace (Once Published)

1. Open VS Code
2. Click Extensions icon (left sidebar)
3. Search for "Crowe Code"
4. Click "Install"

### Method 3: Manual Installation

1. Copy VSIX to VS Code extensions directory:

**Windows:**
```powershell
copy crowe-code-1.0.0.vsix %USERPROFILE%\.vscode\extensions\
```

**macOS:**
```bash
cp crowe-code-1.0.0.vsix ~/.vscode/extensions/
```

**Linux:**
```bash
cp crowe-code-1.0.0.vsix ~/.vscode/extensions/
```

2. Reload VS Code: `Ctrl+R` or `Cmd+R`

---

## Publishing to VS Code Marketplace

### Prerequisites

1. **Create Publisher Account**
   - Go to https://marketplace.visualstudio.com
   - Click "Publish extensions"
   - Sign in with Microsoft/GitHub account

2. **Create Personal Access Token (PAT)**
   - Go to https://dev.azure.com
   - Navigate to: User Settings → Personal Access Tokens
   - Click "New Token"
   - **Name**: "VS Code Extensions"
   - **Organization**: All accessible organizations
   - **Scopes**: Select "Marketplace" → "Manage"
   - **Expiration**: 1 year
   - Copy the token (you won't see it again!)

3. **Login with vsce**
   ```bash
   npx vsce login <publisher-name>
   # Paste your PAT when prompted
   ```

### Publishing Steps

1. **Update package.json**
   ```json
   {
     "publisher": "crowe-logic",
     "repository": {
       "type": "git",
       "url": "https://github.com/crowe-logic/crowe-code"
     }
   }
   ```

2. **Add Icon (required)**
   - Create 128x128 PNG icon
   - Save as `assets/icon.png`
   - Update package.json:
     ```json
     {
       "icon": "assets/icon.png"
     }
     ```

3. **Test Package Locally**
   ```bash
   npm run package
   code --install-extension crowe-code-1.0.0.vsix
   ```

4. **Publish**
   ```bash
   npx vsce publish
   ```

   Or publish specific version:
   ```bash
   npx vsce publish 1.0.1
   ```

   Or publish minor/major update:
   ```bash
   npx vsce publish minor  # 1.0.0 → 1.1.0
   npx vsce publish major  # 1.0.0 → 2.0.0
   ```

5. **Verify Publication**
   - Check marketplace: https://marketplace.visualstudio.com/items?itemName=crowe-logic.crowe-code
   - Wait 5-10 minutes for indexing
   - Search in VS Code Extensions panel

### Update Published Extension

1. Make changes to code
2. Update version in `package.json`
3. Update `CHANGELOG.md`
4. Commit changes
5. Run `npx vsce publish`

### Unpublish Extension

```bash
npx vsce unpublish <publisher-name>.<extension-name>
```

**Warning**: This permanently removes the extension from the marketplace!

---

## Troubleshooting

### Extension Not Activating

**Problem**: Extension doesn't load after installation

**Solutions**:
1. Check VS Code version: Must be >= 1.85.0
   ```bash
   code --version
   ```

2. Reload window:
   - Press `Ctrl+Shift+P` → "Reload Window"

3. Check extension logs:
   - Open Developer Tools: `Help → Toggle Developer Tools`
   - Check Console for errors

4. Verify installation:
   ```bash
   code --list-extensions | grep crowe-code
   ```

### Compilation Errors

**Problem**: TypeScript compilation fails

**Solutions**:
1. Clean and rebuild:
   ```bash
   rm -rf dist node_modules
   npm install
   npm run compile
   ```

2. Check TypeScript version:
   ```bash
   npx tsc --version
   # Should be >= 5.2.2
   ```

3. Verify tsconfig.json is correct

### Streaming Not Working

**Problem**: AI responses don't stream or appear broken

**Solutions**:
1. Check API endpoint in settings:
   - `File → Preferences → Settings`
   - Search "Crowe Code"
   - Verify `croweCode.apiEndpoint` is correct

2. Check network:
   - Open browser DevTools
   - Check Network tab for failed requests
   - Verify CORS headers on API

3. Sign out and sign in again:
   - `Ctrl+Shift+P` → "Crowe Code: Sign Out"
   - `Ctrl+Shift+P` → "Crowe Code: Sign In"

### Package Size Too Large

**Problem**: VSIX file is larger than 50MB

**Solutions**:
1. Check .vscodeignore:
   ```
   node_modules/**
   src/**
   **/*.ts
   **/*.map
   .vscode-test/**
   ```

2. Remove source maps from production:
   - In tsconfig.json, set `"sourceMap": false`

3. Minify JavaScript (optional):
   ```bash
   npm install --save-dev terser
   # Add minification script
   ```

### Commands Not Appearing

**Problem**: Commands missing from Command Palette

**Solutions**:
1. Check package.json → "contributes" → "commands"
2. Verify command registration in extension.ts
3. Check keybindings aren't conflicting:
   - `File → Preferences → Keyboard Shortcuts`
4. Reload window: `Ctrl+R`

### API Authentication Errors

**Problem**: 401 Unauthorized errors

**Solutions**:
1. Sign in again:
   ```
   Ctrl+Shift+P → "Crowe Code: Sign In"
   ```

2. Check token expiration:
   - Tokens may expire after 30 days
   - Re-authenticate via browser

3. Verify API endpoint:
   - Check `croweCode.apiEndpoint` setting
   - Ensure HTTPS is used

---

## Additional Resources

- **VS Code Extension API**: https://code.visualstudio.com/api
- **Publishing Guide**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **Extension Manifest**: https://code.visualstudio.com/api/references/extension-manifest
- **Crowe Code Docs**: https://crowelogic.com/docs
- **GitHub Issues**: https://github.com/crowe-logic/crowe-code/issues

---

## Quick Reference

### Common Commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Compile once | `npm run compile` |
| Watch mode | `npm run watch` |
| Package VSIX | `npm run package` |
| Install locally | `code --install-extension crowe-code-1.0.0.vsix` |
| Uninstall | `code --uninstall-extension crowe-logic.crowe-code` |
| Publish | `npx vsce publish` |
| Launch dev mode | `F5` or `code --extensionDevelopmentPath=$(pwd)` |

### File Locations

| File | Purpose |
|------|---------|
| `package.json` | Extension manifest |
| `src/extension.ts` | Main entry point |
| `dist/` | Compiled JavaScript |
| `.vscodeignore` | Files excluded from VSIX |
| `README.md` | User documentation |
| `CHANGELOG.md` | Version history |

---

**Last Updated**: November 8, 2025
**Version**: 1.0.0
**Maintainer**: Crowe Logic
