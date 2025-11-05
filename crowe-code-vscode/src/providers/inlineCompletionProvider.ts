import * as vscode from 'vscode';
import { CroweCodeAPI } from '../api/croweCodeAPI';

export class InlineCompletionProvider implements vscode.InlineCompletionItemProvider {
    private api: CroweCodeAPI;
    private debounceTimer: NodeJS.Timeout | null = null;

    constructor(api: CroweCodeAPI) {
        this.api = api;
    }

    async provideInlineCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.InlineCompletionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.InlineCompletionItem[] | vscode.InlineCompletionList | null | undefined> {
        // Clear any existing debounce timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Get configuration
        const config = vscode.workspace.getConfiguration('croweCode');
        const delay = config.get<number>('completionDelay') || 500;

        // Don't provide completions if disabled
        if (!config.get<boolean>('enableInlineCompletions')) {
            return null;
        }

        // Debounce to avoid too many API calls
        return new Promise((resolve) => {
            this.debounceTimer = setTimeout(async () => {
                try {
                    const code = document.getText();
                    const offset = document.offsetAt(position);
                    const language = document.languageId;

                    // Get completion from API
                    const completion = await this.api.getInlineCompletion(code, offset, language);

                    if (!completion || token.isCancellationRequested) {
                        resolve(null);
                        return;
                    }

                    // Create inline completion item
                    const item = new vscode.InlineCompletionItem(
                        completion,
                        new vscode.Range(position, position)
                    );

                    resolve([item]);
                } catch (error) {
                    console.error('Inline completion error:', error);
                    resolve(null);
                }
            }, delay);
        });
    }
}
