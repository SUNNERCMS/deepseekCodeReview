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
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const selection = editor.selection;

    const committer = await GitHelper.getLineCommitter(
      document.uri.fsPath,
      selection.start.line + 1
    );

    const codeSelection: CodeSelection = {
      filePath: document.uri.fsPath,
      startLine: selection.start.line + 1,
      endLine: selection.end.line + 1,
      codeContent: document.getText(selection),
      committer
    };

    const comments = this.store.getCommentsByFile(document.uri.fsPath)
      .filter(c => 
        c.startLine === codeSelection.startLine &&
        c.endLine === codeSelection.endLine
      );

    ReviewPanel.show(this.context, codeSelection, comments);
  }
}