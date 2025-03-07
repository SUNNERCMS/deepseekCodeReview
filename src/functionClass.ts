import * as vscode from 'vscode';
import * as path from 'path';
import { stringify as csvStringify } from 'csv-stringify';
import { v4 as uuidv4 } from 'uuid';
interface CodeIssue {
    id: string;
    filePath: string;
    lineNumber: number;
    description: string;
    severity: 'low' | 'medium' | 'high';
    status: 'open' | 'closed';
    createdAt: Date;
    codeSnippet?: string;
  }

  // 存储管理类设计
  class IssueStore {
    private readonly key = 'codeReviewIssues';
    
    constructor(private context: vscode.ExtensionContext) {}
  
    async addIssue(issue: Omit<CodeIssue, 'id' | 'createdAt'>) {
      const issues = this.getAllIssues();
      const newIssue: CodeIssue = {
        ...issue,
        id: uuidv4(),
        createdAt: new Date()
      };
      await this.context.workspaceState.update(this.key, [...issues, newIssue]);
      return newIssue;
    }
  
    getAllIssues(): CodeIssue[] {
      return this.context.workspaceState.get<CodeIssue[]>(this.key) || [];
    }
  }

  // 装饰器实现（代码高亮）
  class IssueDecorator {
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

  // Webview面板实现（问题列表）
  class IssuePanel {
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
  // 导出功能实现
  class IssueExporter {
    static async exportAsCSV(issues: CodeIssue[]) {
        const csv = await new Promise<string>((resolve, reject) => {
          csvStringify(issues, {
            header: true,
            columns: [
              { key: 'id', header: 'ID' },
              { key: 'filePath', header: 'File' },
              { key: 'lineNumber', header: 'Line' },
              { key: 'description', header: 'Description' },
              { key: 'severity', header: 'Severity' },
              { key: 'status', header: 'Status' }
            ]
          }, (err, output) => {
            err ? reject(err) : resolve(output);
          });
        });
        
        await this.saveFile(csv, 'Code Issues.csv');
      }
  
    private static async saveFile(content: string, defaultName: string) {
      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(defaultName)
      });
      if (uri) {
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
      }
    }
  }



  