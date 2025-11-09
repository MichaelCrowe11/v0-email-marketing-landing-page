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

    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    #messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 12px;
      opacity: 0.8;
    }

    .avatar {
      width: 18px;
      height: 18px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .user-avatar {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-input-border);
      color: var(--vscode-foreground);
    }

    .assistant-avatar {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-focusBorder);
      color: var(--vscode-focusBorder);
    }

    .message-content {
      padding: 12px 0;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .user-message .message-content {
      color: var(--vscode-foreground);
    }

    .assistant-message .message-content {
      color: var(--vscode-foreground);
      opacity: 0.95;
    }

    .code-block {
      margin-top: 12px;
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      overflow: hidden;
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: var(--vscode-editor-background);
      border-bottom: 1px solid var(--vscode-panel-border);
      font-size: 11px;
      opacity: 0.8;
    }

    .code-actions {
      display: flex;
      gap: 8px;
    }

    .code-button {
      background: none;
      border: none;
      color: var(--vscode-foreground);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 11px;
      opacity: 0.7;
    }

    .code-button:hover {
      opacity: 1;
      background: var(--vscode-button-hoverBackground);
    }

    pre {
      margin: 0;
      padding: 12px;
      background: var(--vscode-textCodeBlock-background);
      overflow-x: auto;
      font-family: var(--vscode-editor-font-family);
      font-size: 13px;
      line-height: 1.5;
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
      padding: 32px;
      text-align: center;
      gap: 16px;
    }

    #empty-state.hidden {
      display: none;
    }

    .logo {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-focusBorder);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.5px;
      color: var(--vscode-focusBorder);
    }

    .suggestions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      max-width: 300px;
    }

    .suggestion-button {
      background: var(--vscode-editor-background);
      color: var(--vscode-foreground);
      border: 1px solid var(--vscode-input-border);
      padding: 12px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      text-align: left;
      transition: border-color 0.15s ease;
    }

    .suggestion-button:hover {
      border-color: var(--vscode-focusBorder);
      background: var(--vscode-editor-background);
    }

    #input-area {
      padding: 12px;
      background: var(--vscode-editor-background);
      border-top: 1px solid var(--vscode-panel-border);
    }

    #input-container {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }

    #message-input {
      flex: 1;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 4px;
      padding: 10px 12px;
      font-family: var(--vscode-font-family);
      font-size: 13px;
      resize: none;
      min-height: 38px;
      max-height: 120px;
      transition: border-color 0.15s ease;
    }

    #message-input:focus {
      outline: none;
      border-color: var(--vscode-focusBorder);
    }

    #send-button {
      background: var(--vscode-editor-background);
      color: var(--vscode-foreground);
      border: 1px solid var(--vscode-input-border);
      padding: 10px 18px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      white-space: nowrap;
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }

    #send-button:hover:not(:disabled) {
      border-color: var(--vscode-focusBorder);
      background: var(--vscode-input-background);
    }

    #send-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .streaming-cursor {
      display: inline-block;
      width: 8px;
      height: 16px;
      background: var(--vscode-editorCursor-foreground);
      animation: blink 1s infinite;
      margin-left: 2px;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .hint {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 4px;
    }

    /* Accessibility: Disable animations for users with reduced motion preference */
    .vscode-reduce-motion .streaming-cursor {
      animation: none;
      opacity: 1;
    }

    .vscode-reduce-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    /* Accessibility: Hide streaming cursor for screen readers */
    .vscode-using-screen-reader .streaming-cursor {
      display: none;
    }

    /* Accessibility: Screen reader only text */
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
    <div>
      <h3 style="font-weight: 600; font-size: 14px;">Crowe Code</h3>
      <p style="opacity: 0.6; margin-top: 6px; font-size: 11px; font-weight: 400;">
        Autonomous AI developer for biological systems
      </p>
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
        placeholder="Message Crowe Code..."
        rows="1"
        aria-label="Message input"
      ></textarea>
      <button id="send-button" aria-label="Send message">Send</button>
    </div>
    <div class="hint" role="status" aria-label="Keyboard shortcuts hint">Press Enter to send, Shift+Enter for new line</div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    let messages = [];
    let isStreaming = false;

    const messagesContainer = document.getElementById('messages');
    const emptyState = document.getElementById('empty-state');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Handle messages from extension
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

        // Extract code blocks
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

        // Remove code blocks from content
        content = content.replace(codeBlockRegex, '').trim();

        return \`
          <div class="message \${isUser ? 'user-message' : 'assistant-message'}">
            <div class="message-header">
              <div class="avatar \${isUser ? 'user-avatar' : 'assistant-avatar'}">
                \${isUser ? 'U' : 'CC'}
              </div>
              <span>\${isUser ? 'You' : 'Crowe Code'}</span>
            </div>
            <div class="message-content">
              \${content}\${isLast && isStreaming ? '<span class="streaming-cursor"></span>' : ''}
            </div>
            \${codeBlocks.map((block, blockIdx) => \`
              <div class="code-block">
                <div class="code-header">
                  <span>\${block.language}</span>
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
        \`;
      }).join('');

      // Scroll to bottom
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

    // Event listeners
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

    // Auto-focus input
    messageInput.focus();
  </script>
</body>
</html>`;
  }
}
