import * as vscode from 'vscode';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface UsageQuota {
  used: number;
  remaining: number;
  quota: number;
}

export class CroweCodeAPI {
  private context: vscode.ExtensionContext;
  private accessToken: string | undefined;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.accessToken = context.globalState.get('accessToken');
  }

  private getApiEndpoint(): string {
    const config = vscode.workspace.getConfiguration('croweCode');
    return config.get('apiEndpoint', 'https://crowelogic.com');
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
    this.context.globalState.update('accessToken', token);
  }

  public clearAccessToken() {
    this.accessToken = undefined;
    this.context.globalState.update('accessToken', undefined);
  }

  public hasAccessToken(): boolean {
    return !!this.accessToken;
  }

  public async streamChat(
    prompt: string,
    context: Message[],
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    const endpoint = `${this.getApiEndpoint()}/api/crowe-code/stream`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.accessToken ? { 'Authorization': `Bearer ${this.accessToken}` } : {})
        },
        body: JSON.stringify({ prompt, context })
      });

      if (response.status === 401) {
        onError('Unauthorized. Please sign in.');
        return;
      }

      if (response.status === 429) {
        onError('Daily quota exceeded. Upgrade your plan or wait until tomorrow.');
        return;
      }

      if (!response.ok) {
        onError(`Request failed: ${response.statusText}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onError('Failed to read response stream');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          // AI SDK data stream format
          const line = event.data;

          if (line.startsWith('0:')) {
            // Text chunk
            try {
              const textChunk = JSON.parse(line.slice(2));
              onChunk(textChunk);
            } catch (e) {
              console.error('Failed to parse text chunk:', e);
            }
          } else if (line.startsWith('3:')) {
            // Error chunk
            try {
              const errorData = JSON.parse(line.slice(2));
              onError(errorData.message || 'Stream error');
            } catch (e) {
              console.error('Failed to parse error chunk:', e);
            }
          } else if (line.startsWith('d:')) {
            // Metadata/finish chunk
            onComplete();
          }
        }
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            // Process AI SDK format directly
            if (line.startsWith('0:')) {
              try {
                const textChunk = JSON.parse(line.slice(2));
                onChunk(textChunk);
              } catch (e) {
                console.error('Failed to parse text chunk:', e);
              }
            } else if (line.startsWith('3:')) {
              try {
                const errorData = JSON.parse(line.slice(2));
                onError(errorData.message || 'Stream error');
              } catch (e) {
                console.error('Failed to parse error chunk:', e);
              }
            } else if (line.startsWith('d:')) {
              // Finish chunk
              continue;
            } else if (line.startsWith('data: ')) {
              // SSE format fallback
              parser.feed(line);
            }
          }
        }
      }

      onComplete();
    } catch (error: any) {
      onError(`Network error: ${error.message}`);
    }
  }

  public async getUsageQuota(): Promise<UsageQuota | null> {
    const endpoint = `${this.getApiEndpoint()}/api/usage/quota`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          ...(this.accessToken ? { 'Authorization': `Bearer ${this.accessToken}` } : {})
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as UsageQuota;
      return data;
    } catch (error) {
      console.error('Failed to fetch usage quota:', error);
      return null;
    }
  }

  public async generateCode(prompt: string, context: Message[]): Promise<any> {
    const endpoint = `${this.getApiEndpoint()}/api/crowe-code/generate`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.accessToken ? { 'Authorization': `Bearer ${this.accessToken}` } : {})
        },
        body: JSON.stringify({ prompt, context })
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to generate code: ${error.message}`);
    }
  }
}
