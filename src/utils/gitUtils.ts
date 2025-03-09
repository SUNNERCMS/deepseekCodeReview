import * as child_process from 'child_process';
import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';
const exec = util.promisify(child_process.exec);

export class GitHelper {
  // 保存原始工作目录
  private static originalCwd: string = process.cwd();

  // 获取工程目录列表
  private static async getProjectDirectories(rootPath: string): Promise<string[]> {
    try {
      const directories: string[] = [];
      const items = await fs.promises.readdir(rootPath, { withFileTypes: true });
      
      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('.')) {
          directories.push(item.name);
        }
      }
      
      console.log('Project directories:', directories);
      return directories;
    } catch (error) {
      console.error('Error getting project directories:', error);
      return [];
    }
  }

  // 设置工作目录到Git根目录
  private static async setGitRootAsWorkingDirectory(filePath: string): Promise<string> {
    try {
      const gitRoot = await this.getGitRoot(filePath);
      const originalDir = process.cwd();
      process.chdir(gitRoot);
      console.log(`Changed working directory from ${originalDir} to ${gitRoot}`);
      return gitRoot;
    } catch (error) {
      console.error('Error setting git root as working directory:', error);
      throw error;
    }
  }

  // 恢复原始工作目录
  private static restoreWorkingDirectory(): void {
    try {
      process.chdir(this.originalCwd);
      console.log(`Restored working directory to ${this.originalCwd}`);
    } catch (error) {
      console.error('Error restoring working directory:', error);
    }
  }

  private static async getGitRoot(filePath: string): Promise<string> {
    try {
      const { stdout } = await exec('git rev-parse --show-toplevel');
      return stdout.trim();
    } catch (error) {
      console.error('Error getting git root:', error);
      throw new Error('Not a git repository. Please initialize a git repository first.');
    }
  }

  // static async isGitRepository(filePath: string): Promise<boolean> {
  //   try {
  //     await exec('git rev-parse --is-inside-work-tree');
  //     console.log(`isGitRepo: isGitRepo-00000`, filePath);

  //     return true;
  //   } catch (error) {
  //     console.log(`isGitRepo: isGitRepo-11111`, filePath);

  //     return false;
  //   }
  // }

  static async isGitRepository(filePath: string): Promise<boolean> {
    try {
      // 从当前目录向上查找 .git 目录
      console.log(`isGitRepo: isGitRepo-00000`, filePath);

      const gitDir = await exec('git rev-parse --git-dir', { cwd: filePath });
      console.log(`isGitRepo: isGitRepo-00000---111`, gitDir);
      return !!gitDir;
    } catch (error) {
      return false;
    }
}

  static async getLineCommitter(filePath: string, line: number): Promise<string> {
    try {
      // Check if we're in a git repository first
      const isGitRepo = await this.isGitRepository(filePath);
      console.log(`isGitRepo: isGitRepo33`, isGitRepo);
      if (!isGitRepo) {
        throw new Error('Not a git repository. Please initialize a git repository first.');
      }

      // 获取Git根目录并切换工作目录
      const gitRoot = await this.setGitRootAsWorkingDirectory(filePath);

      // 获取项目目录列表
      const projectDirs = await this.getProjectDirectories(gitRoot);
      console.log('Working with project directories:', projectDirs);

      // Convert file path to be relative to git root
      const relativePath = path.relative(gitRoot, filePath);
      console.log(`Relative path: ${relativePath}`);
      
      try {
        const command = `git blame -L ${line},${line} --porcelain "${relativePath}"`;
        console.log(`Executing command: ${command}`);
        
        const { stdout, stderr } = await exec(command);
        console.log(`Git blame output: ${stdout}`);
        if (stderr) {
          console.error(`Git blame error: ${stderr}`);
        }
        
        const result = stdout.split('\n')[0].split(' ')[1];
        console.log(`Extracted committer: ${result}`);
        return result;
      } finally {
        // 恢复原始工作目录
        this.restoreWorkingDirectory();
      }
    } catch (error) {
      console.error('Error in getLineCommitter:', error);
      return 'Unknown';
    }
  }
}