import * as path from 'path';
import * as fs from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';

export class GitHelper {
  // 获取文件所在目录的路径
  private static getDirectoryPath(filePath: string): string {
    return path.dirname(filePath);
  }

  private static async getGitRoot(git: SimpleGit): Promise<string> {
    try {
      const result = await git.revparse(['--show-toplevel']);
      return result.trim();
    } catch (error) {
      console.error('Error getting git root:', error);
      throw new Error('Not a git repository. Please initialize a git repository first.');
    }
  }

  static async isGitRepository(filePath: string): Promise<boolean> {
    try {
      console.log('=== Start isGitRepository ===');
      console.log(`Checking if path is in git repository: ${filePath}`);
      
      // 使用文件所在的目录
      const dirPath = this.getDirectoryPath(filePath);
      console.log(`Resolved directory path: ${dirPath}`);
      
      // 检查目录是否存在
      if (!fs.existsSync(dirPath)) {
        console.log(`Directory does not exist: ${dirPath}`);
        return false;
      }
      console.log(`Directory exists and is accessible`);

      const git = simpleGit(dirPath);
      console.log(`Initialized simple-git instance for ${dirPath}`);
      
      try {
        const isRepo = await git.checkIsRepo();
        console.log(`Git repository check result: ${isRepo}`);
        return isRepo;
      } catch (error) {
        console.error('Error in git.checkIsRepo():', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
        }
        return false;
      }
    } catch (error) {
      console.error('Error in isGitRepository:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      return false;
    } finally {
      console.log('=== End isGitRepository ===');
    }
  }

  static async getLineCommitter(filePath: string, line: number): Promise<string> {
    try {
      console.log('=== Start getLineCommitter ===');
      console.log(`Input - filePath: ${filePath}, line: ${line}`);
      
      // 使用文件所在的目录
      const dirPath = this.getDirectoryPath(filePath);
      console.log(`Resolved directory path: ${dirPath}`);

      // 检查目录是否存在
      if (!fs.existsSync(dirPath)) {
        console.log(`Directory does not exist: ${dirPath}`);
        return 'Unknown';
      }
      console.log(`Directory exists: ${dirPath}`);

      // 初始化 simple-git
      const git = simpleGit(dirPath);
      console.log('Initialized simple-git instance');

      // 检查是否是 Git 仓库
      const isGitRepo = await this.isGitRepository(filePath);
      console.log(`Is Git repository: ${isGitRepo}`);
      if (!isGitRepo) {
        console.log('Not a git repository, returning Unknown');
        return 'Unknown';
      }

      try {
        // 获取 Git 根目录
        const gitRoot = await this.getGitRoot(git);
        console.log(`Git root directory: ${gitRoot}`);

        // 获取相对路径
        const relativePath = path.relative(gitRoot, filePath).replace(/\\/g, '/');
        console.log(`Relative path to git root: ${relativePath}`);

        // 检查文件是否被 Git 追踪
        try {
          const status = await git.status(['--porcelain', relativePath]);
          console.log('Git status output:', status);
          
          if (status.files.length > 0) {
            const fileStatus = status.files[0];
            if (fileStatus.working_dir === '?' || fileStatus.working_dir === 'A') {
              console.log('File is untracked or newly added, returning Unknown');
              return 'Unknown';
            }
          }
        } catch (statusError) {
          console.error('Error checking file status:', statusError);
        }

        // 使用 simple-git 的 blame 方法
        console.log(`Executing git blame for line ${line}`);
        const blameResult = await git.raw([
          'blame',
          '-L', `${line},${line}`,
          '--porcelain',
          '--',  // 添加 -- 来明确指示后面的参数是文件路径
          relativePath
        ]);

        console.log('Git blame raw output:');
        console.log(blameResult);
        
        // 解析结果获取提交者
        const lines = blameResult.split('\n');
        let author = 'Unknown';
        
        // 遍历行查找 author 字段
        for (const line of lines) {
          if (line.startsWith('author ')) {
            author = line.substring('author '.length).trim();
            console.log(`Found author: ${author}`);
            break;
          }
        }
        
        if (author === 'Unknown') {
          console.log('No author found in blame output');
        }
        
        console.log(`Returning author: ${author}`);
        return author;
      } catch (error) {
        console.error('Error in git blame operation:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
        }
        // 如果是因为文件不在版本控制中导致的错误，返回特定消息
        if (error instanceof Error && error.message.includes('no such path')) {
          console.log('File is not in version control');
          return 'Untracked';
        }
        return 'Unknown';
      }
    } catch (error) {
      console.error('Error in getLineCommitter:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      return 'Unknown';
    } finally {
      console.log('=== End getLineCommitter ===');
    }
  }
}