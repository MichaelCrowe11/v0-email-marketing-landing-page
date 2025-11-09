import * as vscode from 'vscode';
import { CroweCodeAPI, Message } from '../api/CroweCodeAPI';
import { getNonce } from '../utils/getNonce';
import { logger } from '../utils/logger';

export class ChatPanel {
  private context: vscode.ExtensionContext;
  private webviewView: vscode.WebviewView;
  private api: CroweCodeAPI;
  private messages: Message[] = [];

  constructor(
    context: vscode.ExtensionContext,
    webviewView: vscode.WebviewView,
    api: CroweCodeAPI
  ) {
    this.context = context;
    this.webviewView = webviewView;
    this.api = api;

    // Load messages from state
    this.messages = context.globalState.get('chatMessages', []);

    // Set up webview
    this.webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [context.extensionUri]
    };

    this.webviewView.webview.html = this.getWebviewContent();

    // Handle messages from webview
    this.webviewView.webview.onDidReceiveMessage(
      async (message) => {
        // Validate message structure
        if (!message || typeof message !== 'object' || !message.type) {
          logger.error('Invalid message received from webview:', message);
          return;
        }

        switch (message.type) {
          case 'sendMessage':
            if (typeof message.text !== 'string' || !message.text.trim()) {
              logger.error('Invalid sendMessage: text must be a non-empty string');
              return;
            }
            await this.handleSendMessage(message.text);
            break;
          case 'clearChat':
            this.handleClearChat();
            break;
          case 'insertCode':
            if (typeof message.code !== 'string') {
              logger.error('Invalid insertCode: code must be a string');
              return;
            }
            this.handleInsertCode(message.code);
            break;
          case 'copyCode':
            if (typeof message.code !== 'string') {
              logger.error('Invalid copyCode: code must be a string');
              return;
            }
            vscode.env.clipboard.writeText(message.code);
            vscode.window.showInformationMessage('Code copied to clipboard');
            break;
          default:
            logger.error('Unknown message type received from webview:', message.type);
        }
      }
    );

    // Send initial messages
    this.updateMessages();
  }

  private async handleSendMessage(text: string) {
    // Add user message
    const userMessage: Message = { role: 'user', content: text };
    this.messages.push(userMessage);
    this.updateMessages();
    this.saveMessages();

    // Add placeholder for assistant message
    const assistantMessage: Message = { role: 'assistant', content: '' };
    this.messages.push(assistantMessage);
    this.updateMessages();

    let fullResponse = '';

    // Show progress indicator while streaming
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Crowe Code is thinking...',
        cancellable: false
      },
      async () => {
        await this.api.streamChat(
          text,
          this.messages.slice(0, -1), // Don't include the empty assistant message
          (chunk) => {
            // On chunk received
            fullResponse += chunk;
            this.messages[this.messages.length - 1].content = fullResponse;
            this.updateMessages(true); // streaming = true
          },
          () => {
            // On complete
            this.messages[this.messages.length - 1].content = fullResponse;
            this.updateMessages(false); // streaming = false
            this.saveMessages();

            // Update quota in status bar
            vscode.commands.executeCommand('croweCode.updateQuota');
          },
          (error) => {
            // On error
            this.messages[this.messages.length - 1].content = `⚠️ Error: ${error}`;
            this.updateMessages(false);
            vscode.window.showErrorMessage(`Crowe Code: ${error}`);
          }
        );
      }
    );
  }

  private handleClearChat() {
    this.messages = [];
    this.updateMessages();
    this.saveMessages();
  }

  private handleInsertCode(code: string) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, code);
      });
      vscode.window.showInformationMessage('Code inserted at cursor');
    }
  }

  private updateMessages(streaming: boolean = false) {
    this.webviewView.webview.postMessage({
      type: 'updateMessages',
      messages: this.messages,
      streaming
    });
  }

  private saveMessages() {
    this.context.globalState.update('chatMessages', this.messages);
  }

  public addMessageFromCommand(text: string) {
    this.handleSendMessage(text);
  }

  private getWebviewContent(): string {
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
  <title>Crowe Code</title>
  <style nonce="${nonce}">
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
      --spacing-1: 4px;
      --spacing-2: 8px;
      --spacing-3: 12px;
      --spacing-4: 16px;
      --spacing-5: 20px;
      --spacing-6: 24px;
      --spacing-8: 32px;
      --radius-sm: 3px;
      --radius-md: 6px;
      --transition-fast: 120ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    body {
      font-family: var(--font-sans);
      font-size: 13px;
      line-height: 1.5;
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    #messages {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--spacing-4) var(--spacing-4) var(--spacing-6);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    #messages::-webkit-scrollbar {
      width: 8px;
    }

    #messages::-webkit-scrollbar-track {
      background: transparent;
    }

    #messages::-webkit-scrollbar-thumb {
      background: var(--vscode-scrollbarSlider-background);
      border-radius: 4px;
    }

    #messages::-webkit-scrollbar-thumb:hover {
      background: var(--vscode-scrollbarSlider-hoverBackground);
    }

    .message {
      display: grid;
      grid-template-columns: 24px 1fr;
      gap: var(--spacing-3);
      opacity: 0;
      animation: fadeIn var(--transition-normal) forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .avatar {
      width: 24px;
      height: 24px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: -0.02em;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .user-avatar {
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border);
      color: var(--vscode-foreground);
      opacity: 0.8;
    }

    .assistant-avatar {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-focusBorder);
      color: var(--vscode-focusBorder);
    }

    .message-body {
      min-width: 0;
    }

    .message-author {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.01em;
      margin-bottom: var(--spacing-2);
      opacity: 0.6;
      text-transform: uppercase;
    }

    .message-content {
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: var(--vscode-foreground);
    }

    .assistant-message .message-content {
      font-weight: 400;
    }

    .code-block {
      margin-top: var(--spacing-3);
      border: 1px solid var(--vscode-panel-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--vscode-textCodeBlock-background);
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-2) var(--spacing-3);
      background: var(--vscode-editor-background);
      border-bottom: 1px solid var(--vscode-panel-border);
    }

    .code-language {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      opacity: 0.5;
    }

    .code-actions {
      display: flex;
      gap: var(--spacing-1);
    }

    .code-button {
      background: transparent;
      border: 1px solid transparent;
      color: var(--vscode-foreground);
      cursor: pointer;
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 500;
      opacity: 0.5;
      transition: all var(--transition-fast);
    }

    .code-button:hover {
      opacity: 1;
      background: var(--vscode-button-hoverBackground);
      border-color: var(--vscode-input-border);
    }

    .code-button:active {
      transform: scale(0.98);
    }

    pre {
      margin: 0;
      padding: var(--spacing-3);
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.5;
    }

    pre::-webkit-scrollbar {
      height: 6px;
    }

    pre::-webkit-scrollbar-track {
      background: transparent;
    }

    pre::-webkit-scrollbar-thumb {
      background: var(--vscode-scrollbarSlider-background);
      border-radius: 3px;
    }

    code {
      color: var(--vscode-textPreformat-foreground);
    }

    #empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);
      text-align: center;
      gap: var(--spacing-6);
    }

    #empty-state.hidden {
      display: none;
    }

    .logo {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: var(--vscode-editor-background);
      border: 1.5px solid var(--vscode-focusBorder);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: var(--vscode-focusBorder);
    }

    .welcome-text h3 {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: -0.01em;
      margin-bottom: var(--spacing-1);
    }

    .welcome-text p {
      font-size: 12px;
      font-weight: 400;
      opacity: 0.5;
      letter-spacing: 0;
    }

    .suggestions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      width: 100%;
      max-width: 320px;
    }

    .suggestion-button {
      background: var(--vscode-editor-background);
      color: var(--vscode-foreground);
      border: 1px solid var(--vscode-input-border);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      transition: all var(--transition-fast);
      position: relative;
    }

    .suggestion-button:hover {
      border-color: var(--vscode-focusBorder);
      transform: translateY(-1px);
    }

    .suggestion-button:active {
      transform: translateY(0);
    }

    #input-area {
      padding: var(--spacing-3);
      background: var(--vscode-editor-background);
      border-top: 1px solid var(--vscode-panel-border);
    }

    #input-container {
      display: flex;
      gap: var(--spacing-2);
      align-items: flex-end;
    }

    #message-input {
      flex: 1;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: var(--radius-md);
      padding: var(--spacing-2) var(--spacing-3);
      font-family: var(--font-sans);
      font-size: 13px;
      line-height: 1.5;
      resize: none;
      min-height: 36px;
      max-height: 120px;
      transition: border-color var(--transition-fast);
    }

    #message-input:focus {
      outline: none;
      border-color: var(--vscode-focusBorder);
    }

    #message-input::placeholder {
      color: var(--vscode-input-placeholderForeground);
      opacity: 0.5;
    }

    #send-button {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      white-space: nowrap;
      transition: all var(--transition-fast);
      height: 36px;
    }

    #send-button:hover:not(:disabled) {
      background: var(--vscode-button-hoverBackground);
    }

    #send-button:active:not(:disabled) {
      transform: scale(0.98);
    }

    #send-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .hint {
      font-size: 10px;
      opacity: 0.4;
      margin-top: var(--spacing-2);
      letter-spacing: 0.01em;
    }

    .streaming-cursor {
      display: inline-block;
      width: 2px;
      height: 16px;
      background: var(--vscode-editorCursor-foreground);
      animation: blink 1s steps(2, start) infinite;
      margin-left: 2px;
      vertical-align: text-bottom;
    }

    @keyframes blink {
      50% { opacity: 0; }
    }

    /* Accessibility */
    .vscode-reduce-motion .streaming-cursor {
      animation: none;
      opacity: 1;
    }

    .vscode-reduce-motion * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }

    .vscode-using-screen-reader .streaming-cursor {
      display: none;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  </style>
</head>
<body>
  <div id="messages" role="log" aria-live="polite" aria-label="Chat messages"></div>

  <div id="empty-state" role="region" aria-label="Welcome screen">
    <div class="logo" aria-hidden="true">CC</div>
    <div class="welcome-text">
      <h3>Crowe Code</h3>
      <p>Autonomous AI developer for biological systems</p>
    </div>
    <div class="suggestions">
      <button class="suggestion-button" onclick="sendSuggestion('Generate a function to analyze contamination patterns across multiple test sites')">
        Analyze contamination patterns
      </button>
      <button class="suggestion-button" onclick="sendSuggestion('Create a yield forecasting model using historical harvest data')">
        Create yield forecasting model
      </button>
      <button class="suggestion-button" onclick="sendSuggestion('Optimize database query performance for large cultivation datasets')">
        Optimize database queries
      </button>
    </div>
  </div>

  <div id="input-area" role="form" aria-label="Chat input form">
    <div id="input-container">
      <textarea
        id="message-input"
        placeholder="Message Crowe Code"
        rows="1"
        aria-label="Message input"
      ></textarea>
      <button id="send-button" aria-label="Send message">Send</button>
    </div>
    <div class="hint" role="status">Enter to send • Shift+Enter for new line</div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    let messages = [];
    let isStreaming = false;

    const messagesContainer = document.getElementById('messages');
    const emptyState = document.getElementById('empty-state');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    window.addEventListener('message', event => {
      const message = event.data;
      if (message.type === 'updateMessages') {
        messages = message.messages;
        isStreaming = message.streaming;
        renderMessages();
      }
    });

    function renderMessages() {
      if (messages.length === 0) {
        emptyState.classList.remove('hidden');
        messagesContainer.innerHTML = '';
        return;
      }

      emptyState.classList.add('hidden');

      messagesContainer.innerHTML = messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const isLast = idx === messages.length - 1;

        const codeBlockRegex = /\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g;
        let content = msg.content;
        const codeBlocks = [];
        let match;

        while ((match = codeBlockRegex.exec(msg.content)) !== null) {
          codeBlocks.push({
            language: match[1] || 'code',
            code: match[2]
          });
        }

        content = content.replace(codeBlockRegex, '').trim();

        return \`
          <div class="message \${isUser ? 'user-message' : 'assistant-message'}" style="animation-delay: \${idx * 50}ms">
            <div class="avatar \${isUser ? 'user-avatar' : 'assistant-avatar'}">
              \${isUser ? 'U' : 'CC'}
            </div>
            <div class="message-body">
              <div class="message-author">\${isUser ? 'You' : 'Crowe Code'}</div>
              <div class="message-content">
                \${content}\${isLast && isStreaming ? '<span class="streaming-cursor"></span>' : ''}
              </div>
              \${codeBlocks.map((block, blockIdx) => \`
                <div class="code-block">
                  <div class="code-header">
                    <span class="code-language">\${block.language}</span>
                    <div class="code-actions">
                      <button class="code-button" onclick="copyCodeByIndex(\${idx}, \${blockIdx})">
                        Copy
                      </button>
                      <button class="code-button" onclick="insertCodeByIndex(\${idx}, \${blockIdx})">
                        Insert
                      </button>
                    </div>
                  </div>
                  <pre><code>\${escapeHtml(block.code)}</code></pre>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      }).join('');

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function sendMessage() {
      const text = messageInput.value.trim();
      if (!text || isStreaming) return;

      vscode.postMessage({
        type: 'sendMessage',
        text
      });

      messageInput.value = '';
      messageInput.style.height = 'auto';
      sendButton.disabled = true;
    }

    function sendSuggestion(text) {
      messageInput.value = text;
      sendMessage();
    }

    function copyCodeByIndex(msgIdx, blockIdx) {
      const msg = messages[msgIdx];
      if (!msg) return;

      const codeBlockRegex = /\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g;
      const blocks = [];
      let match;

      while ((match = codeBlockRegex.exec(msg.content)) !== null) {
        blocks.push(match[2]);
      }

      if (blocks[blockIdx]) {
        vscode.postMessage({
          type: 'copyCode',
          code: blocks[blockIdx]
        });
      }
    }

    function insertCodeByIndex(msgIdx, blockIdx) {
      const msg = messages[msgIdx];
      if (!msg) return;

      const codeBlockRegex = /\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g;
      const blocks = [];
      let match;

      while ((match = codeBlockRegex.exec(msg.content)) !== null) {
        blocks.push(match[2]);
      }

      if (blocks[blockIdx]) {
        vscode.postMessage({
          type: 'insertCode',
          code: blocks[blockIdx]
        });
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('input', (e) => {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
      sendButton.disabled = !e.target.value.trim() || isStreaming;
    });

    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    messageInput.focus();
  </script>
</body>
</html>`;
  }
}
