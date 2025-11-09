import * as vscode from 'vscode';
import { CroweCodeAPI } from '../api/CroweCodeAPI';

export async function handleGenerate(context: vscode.ExtensionContext, api: CroweCodeAPI) {
  const prompt = await vscode.window.showInputBox({
    prompt: 'What would you like Crowe Code to generate?',
    placeHolder: 'e.g., A function to analyze contamination patterns'
  });

  if (!prompt) return;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Crowe Code is generating...',
      cancellable: false
    },
    async () => {
      try {
        const result = await api.generateCode(prompt, []);

        const editor = vscode.window.activeTextEditor;
        if (editor) {
          await editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.active, result.code);
          });

          if (result.explanation) {
            vscode.window.showInformationMessage(result.explanation);
          }
        } else {
          // No editor open - create new file
          const doc = await vscode.workspace.openTextDocument({
            content: result.code,
            language: result.language || 'python'
          });
          await vscode.window.showTextDocument(doc);
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(`Crowe Code: ${error.message}`);
      }
    }
  );
}

export async function handleExplain(context: vscode.ExtensionContext, api: CroweCodeAPI) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No code selected');
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showWarningMessage('No code selected');
    return;
  }

  // Open chat panel and send explanation request
  await vscode.commands.executeCommand('croweCode.openChat');

  // Wait a bit for panel to open
  await new Promise(resolve => setTimeout(resolve, 300));

  // Send message to chat
  const prompt = `Explain this code:\n\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;

  // Post message to webview
  vscode.commands.executeCommand('croweCode.sendToChat', prompt);
}

export async function handleRefactor(context: vscode.ExtensionContext, api: CroweCodeAPI) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showWarningMessage('No code selected');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Refactoring code...',
      cancellable: false
    },
    async () => {
      try {
        const prompt = `Refactor this code to improve readability, maintainability, and follow best practices:\n\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;
        const result = await api.generateCode(prompt, []);

        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, result.code);
        });

        vscode.window.showInformationMessage('Code refactored successfully');
      } catch (error: any) {
        vscode.window.showErrorMessage(`Crowe Code: ${error.message}`);
      }
    }
  );
}

export async function handleOptimize(context: vscode.ExtensionContext, api: CroweCodeAPI) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showWarningMessage('No code selected');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Optimizing code...',
      cancellable: false
    },
    async () => {
      try {
        const prompt = `Optimize this code for better performance, memory usage, and efficiency:\n\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;
        const result = await api.generateCode(prompt, []);

        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, result.code);
        });

        vscode.window.showInformationMessage('Code optimized successfully');
      } catch (error: any) {
        vscode.window.showErrorMessage(`Crowe Code: ${error.message}`);
      }
    }
  );
}

export async function handleAddComments(context: vscode.ExtensionContext, api: CroweCodeAPI) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showWarningMessage('No code selected');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Adding documentation...',
      cancellable: false
    },
    async () => {
      try {
        const prompt = `Add comprehensive documentation comments to this code. Include docstrings, inline comments for complex logic, and type hints where applicable:\n\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;
        const result = await api.generateCode(prompt, []);

        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, result.code);
        });

        vscode.window.showInformationMessage('Documentation added successfully');
      } catch (error: any) {
        vscode.window.showErrorMessage(`Crowe Code: ${error.message}`);
      }
    }
  );
}

export async function handleFixBug(context: vscode.ExtensionContext, api: CroweCodeAPI) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (!selectedText) {
    vscode.window.showWarningMessage('No code selected');
    return;
  }

  const bugDescription = await vscode.window.showInputBox({
    prompt: 'Describe the bug or issue',
    placeHolder: 'e.g., Function returns incorrect results when input is negative'
  });

  if (!bugDescription) return;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Fixing bug...',
      cancellable: false
    },
    async () => {
      try {
        const prompt = `Fix this bug: ${bugDescription}\n\nCode:\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``;
        const result = await api.generateCode(prompt, []);

        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, result.code);
        });

        vscode.window.showInformationMessage('Bug fix applied');
      } catch (error: any) {
        vscode.window.showErrorMessage(`Crowe Code: ${error.message}`);
      }
    }
  );
}

export async function handleSignIn(context: vscode.ExtensionContext, api: CroweCodeAPI) {
  const config = vscode.workspace.getConfiguration('croweCode');
  const apiEndpoint = config.get('apiEndpoint', 'https://crowelogic.com');

  // Open browser for OAuth
  const authUrl = `${apiEndpoint}/auth/vscode`;
  await vscode.env.openExternal(vscode.Uri.parse(authUrl));

  const token = await vscode.window.showInputBox({
    prompt: 'Paste your access token from the browser',
    password: true,
    placeHolder: 'Access token'
  });

  if (token) {
    await api.setAccessToken(token);
    vscode.window.showInformationMessage('Successfully signed in to Crowe Code!');

    // Update status bar
    vscode.commands.executeCommand('croweCode.updateQuota');
  }
}

export async function handleSignOut(context: vscode.ExtensionContext, api: CroweCodeAPI) {
  const confirm = await vscode.window.showWarningMessage(
    'Are you sure you want to sign out?',
    'Sign Out',
    'Cancel'
  );

  if (confirm === 'Sign Out') {
    await api.clearAccessToken();
    vscode.window.showInformationMessage('Signed out from Crowe Code');

    // Update status bar
    vscode.commands.executeCommand('croweCode.updateQuota');
  }
}
