import * as vscode from 'vscode';
import { GitHelper } from './utils/gitUtils';
import { ReviewPanel } from './ReviewPanel';
import { ReviewStore } from './ReviewStore';
import { CodeSelection } from './types/CodeReview';

export class ReviewController {
  private store: ReviewStore;

  constructor(private context: vscode.ExtensionContext) {
    this.store = new ReviewStore(context);
  }

  async showReviewPanel() {
    console.log(`Git root: showReviewPanel`);
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const selection = editor.selection;

    let committer = 'Unknown';
    try {
      committer = await GitHelper.getLineCommitter(
        document.uri.fsPath,
        selection.start.line + 1
      );
    } catch (error) {
      console.error('Failed to get committer:', error);
      // 如果获取提交人失败，使用默认值
      committer = 'Unknown';
    }

    const codeSelection: CodeSelection = {
      filePath: document.uri.fsPath,
      startLine: selection.start.line + 1,
      endLine: selection.end.line + 1,
      codeContent: document.getText(selection),
      committer
    };

    // 获取所有评论
    const comments = this.store.getAllComments();

    ReviewPanel.show(this.context, codeSelection, comments);
  }
}