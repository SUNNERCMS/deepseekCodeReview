import * as vscode from 'vscode';
import type {CodeIssue} from './types/CodeIssue';
  
  // Webview面板实现（问题列表）
  export class IssuePanel {
    static show(context: vscode.ExtensionContext, issues: CodeIssue[]) {
      const panel = vscode.window.createWebviewPanel(
        'codeReviewIssues',
        'Code Issues',
        vscode.ViewColumn.Two,
        { enableScripts: true }
      );
  
      panel.webview.html = `
        <html>
        <body>
          <div id="issues">
            ${issues.map(issue => `
              <div class="issue" data-id="${issue.id}">
                <h3>${issue.filePath}:${issue.lineNumber}</h3>
                <p>${issue.description}</p>
                <span class="severity ${issue.severity}">${issue.severity}</span>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `;
    }
  }