import { v4 as uuidv4 } from 'uuid';
import type {CodeIssue} from './types/CodeIssue';
import * as vscode from 'vscode';
  
  // 存储管理类设计
  export class IssueStore {
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

// import * as vscode from 'vscode';
// import { CodeReviewComment } from './types/CodeReview';

// export class ReviewStore {
//   private readonly key = 'codeReviewComments';

//   constructor(private context: vscode.ExtensionContext) {}

//   async addComment(comment: Omit<CodeReviewComment, 'id' | 'createdAt'>) {
//     const comments = this.getAllComments();
//     const newComment = {
//       ...comment,
//       id: crypto.randomUUID(),
//       createdAt: new Date()
//     };
//     await this.context.workspaceState.update(this.key, [...comments, newComment]);
//     return newComment;
//   }

//   getCommentsByFile(filePath: string): CodeReviewComment[] {
//     return this.getAllComments().filter(c => c.filePath === filePath);
//   }

//   private getAllComments(): CodeReviewComment[] {
//     return this.context.workspaceState.get<CodeReviewComment[]>(this.key) || [];
//   }
// }