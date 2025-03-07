export interface CodeIssue {
    id: string;
    filePath: string;
    lineNumber: number;
    description: string;
    severity: 'low' | 'medium' | 'high';
    status: 'open' | 'closed';
    createdAt: Date;
    codeSnippet?: string;
  }
