import * as vscode from 'vscode';
import { CroweCodeAPI } from './api/CroweCodeAPI';
import { logger } from './utils/logger';

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private api: CroweCodeAPI;

  constructor(api: CroweCodeAPI) {
    this.api = api;

    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );

    this.statusBarItem.command = 'croweCode.openChat';
    this.statusBarItem.show();

    this.updateQuota();
  }

  public async updateQuota() {
    try {
      const quota = await this.api.getUsageQuota();

      if (quota) {
        const percentage = Math.round((quota.remaining / quota.quota) * 100);
        const icon = this.getIconForPercentage(percentage);

        this.statusBarItem.text = `$(${icon}) Crowe: ${quota.remaining}/${quota.quota}`;
        this.statusBarItem.tooltip = `Crowe Code\nDaily requests remaining: ${quota.remaining} of ${quota.quota}\n\nClick to open chat`;

        // Change color based on quota
        if (percentage < 20) {
          this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        } else if (percentage < 50) {
          this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
          this.statusBarItem.backgroundColor = undefined;
        }
      } else {
        // Not signed in or error
        this.statusBarItem.text = '$(account) Crowe Code';
        this.statusBarItem.tooltip = 'Click to sign in to Crowe Code';
        this.statusBarItem.backgroundColor = undefined;
      }
    } catch (error) {
      logger.error('Failed to update quota:', error);
      this.statusBarItem.text = '$(warning) Crowe Code';
      this.statusBarItem.tooltip = 'Failed to connect to Crowe Code';
    }
  }

  private getIconForPercentage(percentage: number): string {
    if (percentage >= 75) return 'zap';
    if (percentage >= 50) return 'lightbulb';
    if (percentage >= 25) return 'flame';
    return 'alert';
  }

  public dispose() {
    this.statusBarItem.dispose();
  }
}
