import * as vscode from 'vscode';
import { CodeReviewComment } from './types/CodeReview';

export class ReviewStore {
  private readonly key = 'codeReviewComments';

  constructor(private context: vscode.ExtensionContext) {}

  async addComment(comment: Omit<CodeReviewComment, 'id' | 'createdAt'>) {
    const comments = this.getAllComments();
    const newComment = {
      ...comment,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    await this.context.workspaceState.update(this.key, [...comments, newComment]);
    return newComment;
  }

  getCommentsByFile(filePath: string): CodeReviewComment[] {
    return this.getAllComments().filter(c => c.filePath === filePath);
  }

  private getAllComments(): CodeReviewComment[] {
    return this.context.workspaceState.get<CodeReviewComment[]>(this.key) || [];
  }
}