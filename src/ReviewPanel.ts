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
          try {
            const store = new ReviewStore(context);
            await store.addComment({
              filePath: message.filePath,
              startLine: message.startLine,
              endLine: message.endLine,
              committer: message.committer,
              content: message.content
            });
            // 显示成功消息
            vscode.window.showInformationMessage('评论已添加');
            // 确保面板被正确关闭
            if (ReviewPanel.currentPanel) {
              ReviewPanel.currentPanel.panel.dispose();
              ReviewPanel.currentPanel = undefined;
            }
          } catch (error: any) {
            vscode.window.showErrorMessage('添加评论失败: ' + (error.message || '未知错误'));
          }
        } else if (message.command === 'confirmClear') {
          // 显示 VSCode 的确认对话框
          const result = await vscode.window.showWarningMessage(
            '确定要清空所有评论吗？此操作不可撤销。',
            { modal: true },
            '确定',
            '取消'
          );

          if (result === '确定') {
            try {
              const store = new ReviewStore(context);
              // 先通知前端更新 UI
              this.panel.webview.postMessage({ command: 'commentsCleared' });
              // 然后清空存储
              await store.clearAllComments();
              // 显示成功消息并立即关闭面板
              vscode.window.showInformationMessage('所有评论已清空');
              this.panel.dispose();
            } catch (error: any) {
              vscode.window.showErrorMessage('清空评论失败: ' + (error.message || '未知错误'));
            }
          }
        } else if (message.command === 'copyToClipboard') {
          await vscode.env.clipboard.writeText(message.text);
          vscode.window.showInformationMessage('评论已复制到剪贴板');
        }
      });
    }
  
    private getWebviewContent(
      selection: CodeSelection,
      comments: CodeReviewComment[]
    ): string {
        // 初始评论人列表
        const committerList = ["启涵", "鹏飞", "昕一", "赵祥"];
        // 对代码内容进行转义，确保HTML正确显示
        const escapedCodeContent = selection.codeContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/`/g, '&#96;');

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
            .button-group {
              margin-top: 20px;
              display: flex;
              gap: 10px;
            }
            .button-group button {
              padding: 5px 15px;
              cursor: pointer;
            }
            .danger-button {
              background-color: #dc3545;
              color: white;
              border: none;
              border-radius: 3px;
            }
            .copy-button {
              background-color: #28a745;
              color: white;
              border: none;
              border-radius: 3px;
            }
            .committer-buttons {
              display: flex;
              gap: 10px;
              margin-top: 10px;
              flex-wrap: wrap;
            }
            .committer-button {
              position: relative;
               cursor: pointer;
              background-color: #007acc;
              display: flex;
              padding: 4px 8px;
               border: none;
                border-radius: 3px;
              align-items: center;
              justify-content: center;
            }
                .committer-button:hover {
              background-color:rgb(60, 161, 233);
            }
            .remove-committer {
              background: transparent;
              color: #dc3545;
              border: none;
              border-radius: 50%;
              width: 18px;
              height: 18px;
              margin-left: 4px;
              font-size: 16px;
              line-height: 18px;
              cursor: pointer;
              display: inline-block;
              transition: background 0.2s;
            }
            .committer-manage-mode .remove-committer:hover {
              background: #ffeaea;
            }
            #addCommitterBox {
              margin-top: 10px;
              display: none;
              gap: 6px;
            }
            .committer-manage-mode #addCommitterBox {
              display: flex;
            }
            #addCommitterInput {
              padding: 5px;
              font-size: 14px;
              border: 1px solid #ccc;
              border-radius: 3px;
            }
            #addCommitterBtn {
              padding: 5px 10px;
              font-size: 14px;
              background: #28a745;
              color: #fff;
              border: none;
              border-radius: 3px;
              cursor: pointer;
            }
            #manageCommitterBtn {
              margin-top: 10px;
              padding: 5px 10px;
              font-size: 14px;
              background: #ffc107;
              color: #333;
              border: none;
              border-radius: 3px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h3>Reviewing ${selection.filePath}</h3>
          <p>Lines: ${selection.startLine}-${selection.endLine}</p>
          <p>Committer: ${selection.committer}</p>
          
          <div>
            <textarea id="commentInput" rows="6" cols="50" placeholder="Enter your review comment...">${escapedCodeContent}</textarea>
            <div class="committer-buttons" id="committerButtons"></div>
            <div id="addCommitterBox">
              <input id="addCommitterInput" type="text" placeholder="添加评论人" />
              <button id="addCommitterBtn">添加</button>
            </div>
            <button id="manageCommitterBtn">管理评论人</button>
          </div>
  
          <div class="comment-list">
            <h4>Previous Comments (${comments.length}):</h4>
            <div class="button-group">
              <button class="danger-button" onclick="clearComments()">清空</button>
              <button class="copy-button" onclick="copyComments()">复制</button>
            </div>
            <div id="commentsList">
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
          </div>
  
          <script>
            const vscode = acquireVsCodeApi();
            
            // 初始评论人列表
            let committerList = ${JSON.stringify(committerList)};
            let committerListBak = [...committerList];
            let manageMode = false;
            function renderCommitterButtons() {
              const container = document.getElementById('committerButtons');
              container.innerHTML = '';
              container.className = 'committer-buttons' + (manageMode ? ' committer-manage-mode' : '');
              committerList.forEach(function(name, idx) {
                const btn = document.createElement('button');
                btn.className = 'committer-button';
                btn.type = 'button';
                // 按钮内容：名字和X
                btn.innerHTML = '<span class="committer-name">' + name + '</span><span class="remove-committer" style="' + (manageMode ? '' : 'display:none;') + '">×</span>';
                btn.onclick = function(e) {
                  var target = e.target;
                  if (manageMode && target.classList && target.classList.contains('remove-committer')) {
                    e.stopPropagation();
                    committerList.splice(idx, 1);
                    renderCommitterButtons();
                  } else if (!manageMode) {
                    submitComment(name);
                  }
                };
                container.appendChild(btn);
              });
            }
            function setManageMode(on) {
              manageMode = on;
              document.getElementById('addCommitterBox').style.display = on ? 'flex' : 'none';
              renderCommitterButtons();
              const btn = document.getElementById('manageCommitterBtn');
              btn.textContent = on ? '保存评论人' : '管理评论人';
            }
            document.getElementById('manageCommitterBtn').onclick = () => {
              if (!manageMode) {
                committerListBak = [...committerList];
                setManageMode(true);
              } else {
                setManageMode(false);
              }
            };
            document.getElementById('addCommitterBtn').onclick = () => {
              const input = document.getElementById('addCommitterInput');
              const name = input.value.trim();
              if (name && !committerList.includes(name)) {
                committerList.push(name);
                input.value = '';
                renderCommitterButtons();
              }
            };
            document.getElementById('addCommitterInput').onkeydown = (e) => {
              if (e.key === 'Enter') {
                document.getElementById('addCommitterBtn').click();
              }
            };
            renderCommitterButtons();
            setManageMode(false);

            // 监听来自扩展的消息
            window.addEventListener('message', event => {
              const message = event.data;
              if (message.command === 'commentsCleared') {
                // 立即清空评论列表
                const commentsList = document.getElementById('commentsList');
                commentsList.innerHTML = '';
                document.querySelector('h4').textContent = 'Previous Comments (0)';
              }
            });

            // 在页面加载完成后，将光标移动到文本区域的末尾
            window.addEventListener('load', () => {
              const textarea = document.getElementById('commentInput');
              textarea.focus();
              textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            });

            function submitComment(committer) {
              if (manageMode) return;
              const input = document.getElementById('commentInput');
              if (!input.value.trim()) {
                return; // 不提交空评论
              }
              vscode.postMessage({
                command: 'submitComment',
                content: input.value,
                filePath: "${selection.filePath}",
                startLine: ${selection.startLine},
                endLine: ${selection.endLine},
                committer: committer
              });
            }

            function clearComments() {
              // 发送确认请求到扩展
              vscode.postMessage({
                command: 'confirmClear'
              });
            }

            function copyComments() {
              const comments = Array.from(document.querySelectorAll('.comment-item')).map((item, index) => {
                const committer = item.querySelector('strong').textContent;
                const filePath = item.querySelector('.file-path').textContent;
                const content = item.querySelector('.comment-content').textContent;
                
                // 获取文件路径的后三级
                const pathParts = filePath.split('/');
                const lastThreeParts = pathParts.slice(-3).join('/');
                
                // 返回带序号的新格式 (序号从1开始)
                return \`\${index + 1}. \${lastThreeParts} \${content} -- \${committer}\`;
              }).join('\\n');

              // 使用 VSCode API 复制到剪贴板
              vscode.postMessage({
                command: 'copyToClipboard',
                text: comments
              });
            }
          </script>
        </body>
        </html>
      `;
    }
  }