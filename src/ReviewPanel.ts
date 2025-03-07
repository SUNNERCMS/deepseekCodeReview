import * as vscode from 'vscode';
import { CodeSelection, CodeReviewComment } from './types/CodeReview';
import {ReviewStore} from './ReviewStore';

export class ReviewPanel {
    public panel: vscode.WebviewPanel;
    public static currentPanel: ReviewPanel | undefined;
  
    private constructor(
      context: vscode.ExtensionContext,
      panel: vscode.WebviewPanel,
      selection: CodeSelection,
      comments: CodeReviewComment[]
    ) {
      this.panel = panel;
      this.panel.webview.html = this.getWebviewContent(selection, comments);
      this.setupMessageHandler(context);
      
      panel.onDidDispose(() => {
        ReviewPanel.currentPanel = undefined;
      });
    }
  
    static show(
      context: vscode.ExtensionContext,
      selection: CodeSelection,
      comments: CodeReviewComment[]
    ) {
      if (ReviewPanel.currentPanel) {
        ReviewPanel.currentPanel.panel.reveal();
        return;
      }
  
      const panel = vscode.window.createWebviewPanel(
        'codeReview',
        'Code Review',
        vscode.ViewColumn.Two,
        { enableScripts: true }
      );
  
      ReviewPanel.currentPanel = new ReviewPanel(
        context,
        panel,
        selection,
        comments
      );
    }
  
    private setupMessageHandler(context: vscode.ExtensionContext) {
      this.panel.webview.onDidReceiveMessage(async message => {
        if (message.command === 'submitComment') {
          const store = new ReviewStore(context);
          await store.addComment({
            filePath: message.filePath,
            startLine: message.startLine,
            endLine: message.endLine,
            committer: message.committer,
            content: message.content
          });
          this.panel.dispose();
        }
      });
    }
  
    private getWebviewContent(
      selection: CodeSelection,
      comments: CodeReviewComment[]
    ): string {
        return `
        <html>
        <body>
          <h3>Reviewing ${selection.filePath}</h3>
          <p>Lines: ${selection.startLine}-${selection.endLine}</p>
          <p>Committer: ${selection.committer}</p>
          
          <div>
            <textarea id="commentInput" rows="4" cols="50"></textarea>
            <button onclick="submitComment()">Submit</button>
          </div>
  
          <h4>Previous Comments (${comments.length}):</h4>
          <ul>
            ${comments.map(c => `
              <li>
                <strong>${c.committer}</strong> (${new Date(c.createdAt).toLocaleString()}):
                <p>${c.content}</p>
              </li>
            `).join('')}
          </ul>
  
          <script>
            const vscode = acquireVsCodeApi();
            function submitComment() {
              const input = document.getElementById('commentInput');
              vscode.postMessage({
                command: 'submitComment',
                content: input.value
              });
            }
          </script>
        </body>
        </html>
      `;
    }
  }