import * as vscode from 'vscode';
import { CroweCodeAPI } from './api/croweCodeAPI';
import { InlineCompletionProvider } from './providers/inlineCompletionProvider';
import { ChatViewProvider } from './providers/chatViewProvider';
import { AgentViewProvider } from './providers/agentViewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Crowe Code extension is now active!');

    // Initialize API client
    const api = new CroweCodeAPI();

    // Register inline completion provider (like Copilot)
    const inlineProvider = new InlineCompletionProvider(api);
    context.subscriptions.push(
        vscode.languages.registerInlineCompletionItemProvider(
            { pattern: '**' },
            inlineProvider
        )
    );

    // Register chat view provider
    const chatProvider = new ChatViewProvider(context.extensionUri, api);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'croweCodeChat',
            chatProvider
        )
    );

    // Register agent selector view
    const agentProvider = new AgentViewProvider(context.extensionUri, api);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'croweCodeAgents',
            agentProvider
        )
    );

    // Command: Generate Code
    context.subscriptions.push(
        vscode.commands.registerCommand('croweCode.generateCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const prompt = await vscode.window.showInputBox({
                prompt: 'What code would you like to generate?',
                placeHolder: 'e.g., Create a React component for a user profile card'
            });

            if (!prompt) return;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Crowe Code is generating...',
                cancellable: false
            }, async () => {
                try {
                    const code = await api.generateCode(prompt, editor.document.languageId);
                    const position = editor.selection.active;
                    await editor.edit(editBuilder => {
                        editBuilder.insert(position, code);
                    });
                    vscode.window.showInformationMessage('Code generated successfully!');
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to generate code: ${error}`);
                }
            });
        })
    );

    // Command: Explain Code
    context.subscriptions.push(
        vscode.commands.registerCommand('croweCode.explainCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const selection = editor.document.getText(editor.selection);
            if (!selection) {
                vscode.window.showErrorMessage('Please select some code to explain');
                return;
            }

            try {
                const explanation = await api.explainCode(selection, editor.document.languageId);

                const panel = vscode.window.createWebviewPanel(
                    'croweCodeExplanation',
                    'Code Explanation',
                    vscode.ViewColumn.Beside,
                    {}
                );

                panel.webview.html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                                padding: 20px;
                                line-height: 1.6;
                            }
                            h1 { color: #ff6b35; }
                            pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
                            code { font-family: 'Courier New', monospace; }
                        </style>
                    </head>
                    <body>
                        <h1>🤖 Crowe Code Explanation</h1>
                        <div>${explanation}</div>
                    </body>
                    </html>
                `;
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to explain code: ${error}`);
            }
        })
    );

    // Command: Refactor Code
    context.subscriptions.push(
        vscode.commands.registerCommand('croweCode.refactorCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const selection = editor.document.getText(editor.selection);
            if (!selection) {
                vscode.window.showErrorMessage('Please select some code to refactor');
                return;
            }

            const refactorType = await vscode.window.showQuickPick([
                'Improve performance',
                'Improve readability',
                'Add error handling',
                'Modernize code',
                'Extract functions',
                'Add TypeScript types'
            ], {
                placeHolder: 'How would you like to refactor this code?'
            });

            if (!refactorType) return;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Refactoring code...',
                cancellable: false
            }, async () => {
                try {
                    const refactored = await api.refactorCode(
                        selection,
                        editor.document.languageId,
                        refactorType
                    );

                    await editor.edit(editBuilder => {
                        editBuilder.replace(editor.selection, refactored);
                    });

                    vscode.window.showInformationMessage('Code refactored successfully!');
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to refactor: ${error}`);
                }
            });
        })
    );

    // Command: Fix Bug
    context.subscriptions.push(
        vscode.commands.registerCommand('croweCode.fixBug', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const selection = editor.document.getText(editor.selection);
            const errorDescription = await vscode.window.showInputBox({
                prompt: 'Describe the bug or paste the error message',
                placeHolder: 'e.g., TypeError: Cannot read property of undefined'
            });

            if (!errorDescription) return;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Analyzing and fixing bug...',
                cancellable: false
            }, async () => {
                try {
                    const fixed = await api.fixBug(
                        selection || editor.document.getText(),
                        errorDescription,
                        editor.document.languageId
                    );

                    if (selection) {
                        await editor.edit(editBuilder => {
                            editBuilder.replace(editor.selection, fixed);
                        });
                    } else {
                        const document = await vscode.workspace.openTextDocument({
                            content: fixed,
                            language: editor.document.languageId
                        });
                        await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
                    }

                    vscode.window.showInformationMessage('Bug fix suggested!');
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to fix bug: ${error}`);
                }
            });
        })
    );

    // Command: Open Chat
    context.subscriptions.push(
        vscode.commands.registerCommand('croweCode.openChat', () => {
            vscode.commands.executeCommand('workbench.view.extension.crowe-code');
        })
    );

    // Command: Switch Agent
    context.subscriptions.push(
        vscode.commands.registerCommand('croweCode.switchAgent', async () => {
            const agent = await vscode.window.showQuickPick([
                { label: '⚡ Crowe Code', description: 'Lightning-fast code generation', value: 'deepseek' },
                { label: '🔧 Crowe Logic', description: 'Production-grade coding assistant', value: 'crowelogic' },
                { label: '🧠 Crowe Logic Reasoning', description: 'Complex problem-solving (O1)', value: 'o1' },
                { label: '⚡ DeepParallel', description: 'Fast tactical reasoning', value: 'deepparallel' },
                { label: '🤔 DeepThought', description: 'Deep philosophical analysis', value: 'deepthought' }
            ], {
                placeHolder: 'Select an AI agent'
            });

            if (agent) {
                api.setAgent(agent.value);
                vscode.window.showInformationMessage(`Switched to ${agent.label}`);
            }
        })
    );

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(zap) Crowe Code';
    statusBarItem.tooltip = 'Click to open Crowe Code';
    statusBarItem.command = 'croweCode.openChat';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    vscode.window.showInformationMessage('🚀 Crowe Code is ready! Press Ctrl+Shift+G to generate code.');
}

export function deactivate() {
    console.log('Crowe Code extension deactivated');
}
