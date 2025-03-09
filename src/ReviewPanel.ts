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
        <head>
          <style>
            .comment-list {
              margin-top: 20px;
            }
            .comment-item {
              border-bottom: 1px solid #ccc;
              padding: 10px 0;
            }
            .comment-header {
              display: flex;
              justify-content: space-between;
              color: #666;
              font-size: 0.9em;
            }
            .comment-content {
              margin-top: 5px;
              white-space: pre-wrap;
            }
            .file-path {
              color: #0066cc;
              font-size: 0.9em;
            }
            .comment-lines {
              color: #666;
            }
          </style>
        </head>
        <body>
          <h3>Reviewing ${selection.filePath}</h3>
          <p>Lines: ${selection.startLine}-${selection.endLine}</p>
          <p>Committer: ${selection.committer}</p>
          
          <div>
            <textarea id="commentInput" rows="4" cols="50" placeholder="Enter your review comment..."></textarea>
            <button onclick="submitComment()">Submit</button>
          </div>
  
          <div class="comment-list">
            <h4>Previous Comments (${comments.length}):</h4>
            ${comments.map(c => `
              <div class="comment-item">
                <div class="comment-header">
                  <strong>${c.committer}</strong>
                  <span>${new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <div class="file-path">${c.filePath}</div>
                <span class="comment-lines">Lines: ${c.startLine}-${c.endLine}</span>
                <div class="comment-content">${c.content}</div>
              </div>
            `).join('')}
          </div>
  
          <script>
            const vscode = acquireVsCodeApi();
            
            // 存储代码选择信息
            const selection = {
              filePath: "${selection.filePath}",
              startLine: ${selection.startLine},
              endLine: ${selection.endLine},
              committer: "${selection.committer}"
            };

            function submitComment() {
              const input = document.getElementById('commentInput');
              if (!input.value.trim()) {
                return; // 不提交空评论
              }
              vscode.postMessage({
                command: 'submitComment',
                content: input.value,
                filePath: selection.filePath,
                startLine: selection.startLine,
                endLine: selection.endLine,
                committer: selection.committer
              });
            }
          </script>
        </body>
        </html>
      `;
    }
  }