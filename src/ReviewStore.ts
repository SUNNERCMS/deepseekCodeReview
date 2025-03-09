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
      createdAt: new Date().toISOString()
    };
    await this.context.workspaceState.update(this.key, [...comments, newComment]);
    return newComment;
  }

  getCommentsByFile(filePath: string): CodeReviewComment[] {
    return this.getAllComments().filter(c => c.filePath === filePath);
  }

  getAllComments(): CodeReviewComment[] {
    const comments = this.context.workspaceState.get<CodeReviewComment[]>(this.key) || [];
    return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async clearAllComments() {
    await this.context.workspaceState.update(this.key, []);
  }
}