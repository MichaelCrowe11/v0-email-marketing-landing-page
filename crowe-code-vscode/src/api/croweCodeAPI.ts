import * as vscode from 'vscode';
import axios, { AxiosInstance } from 'axios';

export class CroweCodeAPI {
    private client: AxiosInstance;
    private currentAgent: string = 'deepseek'; // Default to Crowe Code (fast)

    constructor() {
        const config = vscode.workspace.getConfiguration('croweCode');
        const apiEndpoint = config.get<string>('apiEndpoint') || 'https://crowelogic.ai/api';
        const apiKey = config.get<string>('apiKey') || '';

        this.client = axios.create({
            baseURL: apiEndpoint,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 30000
        });

        const defaultAgent = config.get<string>('defaultAgent');
        if (defaultAgent) {
            this.currentAgent = defaultAgent === 'croweCode' ? 'deepseek' : defaultAgent;
        }
    }

    setAgent(agent: string) {
        this.currentAgent = agent;
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        try {
            const response = await this.client.post('/chat', {
                messages: [
                    {
                        role: 'user',
                        content: `Generate ${language} code for: ${prompt}\n\nProvide only the code, no explanations.`
                    }
                ],
                agent: this.currentAgent,
                model: this.currentAgent
            });

            return this.extractCode(response.data);
        } catch (error) {
            throw new Error(`API Error: ${error}`);
        }
    }

    async explainCode(code: string, language: string): Promise<string> {
        try {
            const response = await this.client.post('/chat', {
                messages: [
                    {
                        role: 'user',
                        content: `Explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
                    }
                ],
                agent: 'deepparallel', // Use fast agent for explanations
                model: 'deepparallel'
            });

            return this.extractText(response.data);
        } catch (error) {
            throw new Error(`API Error: ${error}`);
        }
    }

    async refactorCode(code: string, language: string, refactorType: string): Promise<string> {
        try {
            const response = await this.client.post('/chat', {
                messages: [
                    {
                        role: 'user',
                        content: `Refactor this ${language} code to: ${refactorType}\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide only the refactored code.`
                    }
                ],
                agent: this.currentAgent,
                model: this.currentAgent
            });

            return this.extractCode(response.data);
        } catch (error) {
            throw new Error(`API Error: ${error}`);
        }
    }

    async fixBug(code: string, errorDescription: string, language: string): Promise<string> {
        try {
            const response = await this.client.post('/chat', {
                messages: [
                    {
                        role: 'user',
                        content: `Fix this bug in ${language} code:\n\nError: ${errorDescription}\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide the fixed code.`
                    }
                ],
                agent: 'o1', // Use reasoning model for bug fixes
                model: 'o1'
            });

            return this.extractCode(response.data);
        } catch (error) {
            throw new Error(`API Error: ${error}`);
        }
    }

    async getInlineCompletion(code: string, position: number, language: string): Promise<string | null> {
        try {
            const config = vscode.workspace.getConfiguration('croweCode');
            if (!config.get<boolean>('enableInlineCompletions')) {
                return null;
            }

            const beforeCursor = code.substring(0, position);
            const afterCursor = code.substring(position);

            const response = await this.client.post('/chat', {
                messages: [
                    {
                        role: 'user',
                        content: `Complete this ${language} code:\n\n\`\`\`${language}\n${beforeCursor}<CURSOR>${afterCursor}\n\`\`\`\n\nProvide only the completion for the <CURSOR> position.`
                    }
                ],
                agent: 'deepseek', // Always use fast Crowe Code for completions
                model: 'deepseek'
            });

            return this.extractCode(response.data);
        } catch (error) {
            console.error('Inline completion error:', error);
            return null;
        }
    }

    async chat(message: string): Promise<string> {
        try {
            const response = await this.client.post('/chat', {
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ],
                agent: this.currentAgent,
                model: this.currentAgent
            });

            return this.extractText(response.data);
        } catch (error) {
            throw new Error(`API Error: ${error}`);
        }
    }

    private extractCode(responseData: any): string {
        // Handle streaming response
        let content = '';

        if (typeof responseData === 'string') {
            content = responseData;
        } else if (responseData.choices && responseData.choices[0]) {
            content = responseData.choices[0].message?.content || responseData.choices[0].text || '';
        } else if (responseData.content) {
            content = responseData.content;
        }

        // Extract code from markdown code blocks
        const codeBlockMatch = content.match(/```[\w]*\n([\s\S]*?)```/);
        if (codeBlockMatch) {
            return codeBlockMatch[1].trim();
        }

        return content.trim();
    }

    private extractText(responseData: any): string {
        if (typeof responseData === 'string') {
            return responseData;
        } else if (responseData.choices && responseData.choices[0]) {
            return responseData.choices[0].message?.content || responseData.choices[0].text || '';
        } else if (responseData.content) {
            return responseData.content;
        }

        return '';
    }
}
