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
      // 使用文件所在的目录
      const dirPath = this.getDirectoryPath(filePath);
      console.log(`Checking directory: ${dirPath}`);
      
      // 检查目录是否存在
      if (!fs.existsSync(dirPath)) {
        console.log(`Directory does not exist: ${dirPath}`);
        return false;
      }

      const git = simpleGit(dirPath);
      const isRepo = await git.checkIsRepo();
      console.log(`Checking if ${dirPath} is a git repository:`, isRepo);
      return isRepo;
    } catch (error) {
      console.log(`Error checking if ${filePath} is a git repository:`, error);
      return false;
    }
  }

  static async getLineCommitter(filePath: string, line: number): Promise<string> {
    try {
      // 使用文件所在的目录
      const dirPath = this.getDirectoryPath(filePath);
      console.log(`Using directory: ${dirPath}`);

      // 检查目录是否存在
      if (!fs.existsSync(dirPath)) {
        console.log(`Directory does not exist: ${dirPath}`);
        return 'Unknown';
      }

      // 初始化 simple-git
      const git = simpleGit(dirPath);

      // 检查是否是 Git 仓库
      const isGitRepo = await this.isGitRepository(filePath);
      console.log(`Is Git repository:`, isGitRepo);
      if (!isGitRepo) {
        throw new Error('Not a git repository. Please initialize a git repository first.');
      }

      // 获取 Git 根目录
      const gitRoot = await this.getGitRoot(git);
      console.log(`Git root:`, gitRoot);

      // 获取相对路径
      const relativePath = path.relative(gitRoot, filePath);
      console.log(`Relative path: ${relativePath}`);

      try {
        // 使用 simple-git 的 blame 方法
        const blameResult = await git.raw([
          'blame',
          '-L', `${line},${line}`,
          '--porcelain',
          relativePath
        ]);

        console.log(`Git blame output:`, blameResult);
        
        // 解析结果获取提交者
        const lines = blameResult.split('\n');
        let author = 'Unknown';
        
        // 遍历行查找 author 字段
        for (const line of lines) {
          if (line.startsWith('author ')) {
            author = line.substring('author '.length).trim();
            break;
          }
        }
        
        console.log(`Extracted author:`, author);
        return author;
      } catch (error) {
        console.error('Error getting blame info:', error);
        return 'Unknown';
      }
    } catch (error) {
      console.error('Error in getLineCommitter:', error);
      return 'Unknown';
    }
  }
}