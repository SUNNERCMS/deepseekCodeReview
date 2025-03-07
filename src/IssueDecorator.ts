import * as vscode from 'vscode';
import * as path from 'path';
import type {CodeIssue} from './types/CodeIssue';
// 装饰器实现（代码高亮）
export class IssueDecorator {
  private decorationType = vscode.window.createTextEditorDecorationType({
    gutterIconPath: path.join(__filename, '..', 'media', 'issue-icon.svg'),
    backgroundColor: 'rgba(255,0,0,0.1)'
  });

  updateDecorations(editor: vscode.TextEditor, issues: CodeIssue[]) {
    const decorations = issues.map(issue => ({
      range: new vscode.Range(issue.lineNumber, 0, issue.lineNumber, 0),
      hoverMessage: `[${issue.severity}] ${issue.description}`
    }));
    editor.setDecorations(this.decorationType, decorations);
  }
}