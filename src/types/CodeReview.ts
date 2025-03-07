export interface CodeReviewComment {
    id: string;
    filePath: string;
    startLine: number;
    endLine: number;
    committer: string;
    content: string;
    createdAt: Date;
  }
  
  export interface CodeSelection {
    filePath: string;
    startLine: number;
    endLine: number;
    codeContent: string;
    committer: string;
  }