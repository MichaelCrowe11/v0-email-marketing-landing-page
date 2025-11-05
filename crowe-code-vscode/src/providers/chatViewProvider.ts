import * as vscode from 'vscode';
import { CroweCodeAPI } from '../api/croweCodeAPI';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    private extensionUri: vscode.Uri;
    private api: CroweCodeAPI;
    private view?: vscode.WebviewView;

    constructor(extensionUri: vscode.Uri, api: CroweCodeAPI) {
        this.extensionUri = extensionUri;
        this.api = api;
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        this.view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'sendMessage':
                    try {
                        const response = await this.api.chat(message.text);
                        webviewView.webview.postMessage({
                            type: 'response',
                            text: response
                        });
                    } catch (error) {
                        webviewView.webview.postMessage({
                            type: 'error',
                            text: `Error: ${error}`
                        });
                    }
                    break;
            }
        });
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Crowe Code Chat</title>
            <style>
                body {
                    padding: 10px;
                    color: var(--vscode-foreground);
                    font-family: var(--vscode-font-family);
                }
                #messages {
                    height: calc(100vh - 120px);
                    overflow-y: auto;
                    margin-bottom: 10px;
                    padding: 10px;
                    background: var(--vscode-editor-background);
                    border-radius: 4px;
                }
                .message {
                    margin: 10px 0;
                    padding: 8px;
                    border-radius: 4px;
                }
                .user-message {
                    background: var(--vscode-input-background);
                }
                .assistant-message {
                    background: var(--vscode-editor-inactiveSelectionBackground);
                }
                #input-container {
                    display: flex;
                    gap: 5px;
                }
                #messageInput {
                    flex: 1;
                    padding: 8px;
                    background: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 4px;
                }
                #sendButton {
                    padding: 8px 16px;
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #sendButton:hover {
                    background: var(--vscode-button-hoverBackground);
                }
                pre {
                    background: var(--vscode-textBlockQuote-background);
                    padding: 10px;
                    border-radius: 4px;
                    overflow-x: auto;
                }
            </style>
        </head>
        <body>
            <div id="messages"></div>
            <div id="input-container">
                <input type="text" id="messageInput" placeholder="Ask Crowe Code anything...">
                <button id="sendButton">Send</button>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                const messagesDiv = document.getElementById('messages');
                const messageInput = document.getElementById('messageInput');
                const sendButton = document.getElementById('sendButton');

                function addMessage(text, isUser) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = isUser ? 'message user-message' : 'message assistant-message';
                    messageDiv.innerHTML = text.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
                    messagesDiv.appendChild(messageDiv);
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }

                function sendMessage() {
                    const text = messageInput.value.trim();
                    if (!text) return;

                    addMessage(text, true);
                    messageInput.value = '';

                    vscode.postMessage({
                        type: 'sendMessage',
                        text: text
                    });
                }

                sendButton.addEventListener('click', sendMessage);
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });

                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'response':
                            addMessage(message.text, false);
                            break;
                        case 'error':
                            addMessage('⚠️ ' + message.text, false);
                            break;
                    }
                });
            </script>
        </body>
        </html>`;
    }
}
