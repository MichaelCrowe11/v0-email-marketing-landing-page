import * as vscode from 'vscode';
import { ChatPanel } from './panels/ChatPanel';
import { CroweCodeAPI } from './api/CroweCodeAPI';
import { StatusBarManager } from './statusBar';
import * as commands from './commands';

let chatPanel: ChatPanel | undefined;
let statusBarManager: StatusBarManager;

export async function activate(context: vscode.ExtensionContext) {
  console.log('Crowe Code extension is now active');

  // Initialize API client
  const api = new CroweCodeAPI(context);

  // Initialize status bar
  statusBarManager = new StatusBarManager(api);
  context.subscriptions.push(statusBarManager);

  // Register chat panel provider
  const chatPanelProvider = vscode.window.registerWebviewViewProvider(
    'croweCode.chatView',
    {
      resolveWebviewView: (webviewView) => {
        chatPanel = new ChatPanel(context, webviewView, api);
      }
    },
    {
      webviewOptions: {
        retainContextWhenHidden: true
      }
    }
  );

  // Register commands
  const openChatCommand = vscode.commands.registerCommand('croweCode.openChat', () => {
    vscode.commands.executeCommand('croweCode.chatView.focus');
  });

  const generateCommand = vscode.commands.registerCommand('croweCode.generate', async () => {
    await commands.handleGenerate(context, api);
  });

  const explainCommand = vscode.commands.registerCommand('croweCode.explain', async () => {
    await commands.handleExplain(context, api);
  });

  const refactorCommand = vscode.commands.registerCommand('croweCode.refactor', async () => {
    await commands.handleRefactor(context, api);
  });

  const optimizeCommand = vscode.commands.registerCommand('croweCode.optimize', async () => {
    await commands.handleOptimize(context, api);
  });

  const addCommentsCommand = vscode.commands.registerCommand('croweCode.addComments', async () => {
    await commands.handleAddComments(context, api);
  });

  const fixBugCommand = vscode.commands.registerCommand('croweCode.fixBug', async () => {
    await commands.handleFixBug(context, api);
  });

  const signInCommand = vscode.commands.registerCommand('croweCode.signIn', async () => {
    await commands.handleSignIn(context, api);
  });

  const signOutCommand = vscode.commands.registerCommand('croweCode.signOut', async () => {
    await commands.handleSignOut(context, api);
  });

  // Add all to subscriptions
  context.subscriptions.push(
    chatPanelProvider,
    openChatCommand,
    generateCommand,
    explainCommand,
    refactorCommand,
    optimizeCommand,
    addCommentsCommand,
    fixBugCommand,
    signInCommand,
    signOutCommand
  );

  // Update status bar on activation
  await statusBarManager.updateQuota();

  // Show welcome message
  const hasSeenWelcome = context.globalState.get('hasSeenWelcome', false);
  if (!hasSeenWelcome) {
    const selection = await vscode.window.showInformationMessage(
      'Welcome to Crowe Code! Your AI-powered agricultural data science assistant.',
      'Open Chat',
      'Sign In',
      'Dismiss'
    );

    if (selection === 'Open Chat') {
      vscode.commands.executeCommand('croweCode.openChat');
    } else if (selection === 'Sign In') {
      vscode.commands.executeCommand('croweCode.signIn');
    }

    context.globalState.update('hasSeenWelcome', true);
  }
}

export function deactivate() {
  console.log('Crowe Code extension is now deactivated');
}
