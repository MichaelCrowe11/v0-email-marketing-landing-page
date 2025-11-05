import * as vscode from 'vscode';
import { CroweCodeAPI } from '../api/croweCodeAPI';

export class AgentViewProvider implements vscode.WebviewViewProvider {
    private extensionUri: vscode.Uri;
    private api: CroweCodeAPI;

    constructor(extensionUri: vscode.Uri, api: CroweCodeAPI) {
        this.extensionUri = extensionUri;
        this.api = api;
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.type === 'selectAgent') {
                this.api.setAgent(message.agent);
                vscode.window.showInformationMessage(`Switched to ${message.agentName}`);
            }
        });
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        const agents = [
            { id: 'deepseek', name: 'Crowe Code', icon: '⚡', description: 'Lightning-fast code generation' },
            { id: 'crowelogic', name: 'Crowe Logic', icon: '🔧', description: 'Production-grade coding' },
            { id: 'o1', name: 'Crowe Logic Reasoning', icon: '🧠', description: 'Complex problem-solving' },
            { id: 'deepparallel', name: 'DeepParallel', icon: '⚡', description: 'Fast tactical reasoning' },
            { id: 'deepthought', name: 'DeepThought', icon: '🤔', description: 'Deep analysis' }
        ];

        const agentCards = agents.map(agent => `
            <div class="agent-card" onclick="selectAgent('${agent.id}', '${agent.name}')">
                <div class="agent-icon">${agent.icon}</div>
                <div class="agent-info">
                    <div class="agent-name">${agent.name}</div>
                    <div class="agent-description">${agent.description}</div>
                </div>
            </div>
        `).join('');

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Agents</title>
            <style>
                body {
                    padding: 10px;
                    color: var(--vscode-foreground);
                }
                .agent-card {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    margin: 8px 0;
                    background: var(--vscode-editor-background);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .agent-card:hover {
                    background: var(--vscode-list-hoverBackground);
                }
                .agent-icon {
                    font-size: 24px;
                    margin-right: 12px;
                }
                .agent-name {
                    font-weight: bold;
                    margin-bottom: 4px;
                }
                .agent-description {
                    font-size: 12px;
                    opacity: 0.8;
                }
            </style>
        </head>
        <body>
            <h3>Select AI Agent</h3>
            ${agentCards}

            <script>
                const vscode = acquireVsCodeApi();
                function selectAgent(agentId, agentName) {
                    vscode.postMessage({
                        type: 'selectAgent',
                        agent: agentId,
                        agentName: agentName
                    });
                }
            </script>
        </body>
        </html>`;
    }
}
