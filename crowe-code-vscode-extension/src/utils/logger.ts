import * as vscode from 'vscode';

/**
 * Centralized logger for Crowe Code extension using VS Code OutputChannel
 */
class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel;

  private constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Crowe Code');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage('INFO', message, args);
    this.outputChannel.appendLine(formattedMessage);
  }

  public warn(message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage('WARN', message, args);
    this.outputChannel.appendLine(formattedMessage);
  }

  public error(message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage('ERROR', message, args);
    this.outputChannel.appendLine(formattedMessage);
  }

  public debug(message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage('DEBUG', message, args);
    this.outputChannel.appendLine(formattedMessage);
  }

  public show(): void {
    this.outputChannel.show();
  }

  public dispose(): void {
    this.outputChannel.dispose();
  }

  private formatMessage(level: string, message: string, args: any[]): string {
    const timestamp = new Date().toISOString();
    const argsString = args.length > 0 ? ' ' + args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ') : '';
    return `[${timestamp}] [${level}] ${message}${argsString}`;
  }
}

export const logger = Logger.getInstance();
