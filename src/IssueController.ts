// src/IssueController.ts
import * as vscode from 'vscode';
import { IssueStore } from './IssueStore';
import { IssueDecorator } from './IssueDecorator';
import { IssuePanel } from './IssuePanel';

export class IssueController {
  private readonly store: IssueStore;
  private readonly decorator: IssueDecorator;
  
  constructor(private context: vscode.ExtensionContext) {
    this.store = new IssueStore(context);
    this.decorator = new IssueDecorator();
    
    // 注册事件监听
    this.registerEventHandlers();
  }

  // 核心命令实现
  addIssue = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active text editor');
      return;
    }

    const lineNumber = editor.selection.active.line + 1;
    const description = await vscode.window.showInputBox({
      prompt: 'Enter issue description'
    });

    if (description) {
      const newIssue = await this.store.addIssue({
        filePath: editor.document.uri.fsPath,
        lineNumber,
        description,
        severity: 'medium',
        status: 'open'
      });
      
      this.updateDecorations();
    }
  };

  showIssuePanel = () => {
    IssuePanel.show(this.context, this.store.getAllIssues());
  };

  toggleDecorations = () => {
    const visible = this.context.workspaceState.get('decorationsVisible', true);
    this.context.workspaceState.update('decorationsVisible', !visible);
    this.updateDecorations();
  };

  // 私有方法
  private registerEventHandlers() {
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) this.updateDecorations(editor);
    });
  }

  private updateDecorations(editor = vscode.window.activeTextEditor) {
    if (editor && this.context.workspaceState.get('decorationsVisible', true)) {
      const issues = this.store.getAllIssues().filter(
        issue => issue.filePath === editor.document.uri.fsPath
      );
      this.decorator.updateDecorations(editor, issues);
    }
  }
}