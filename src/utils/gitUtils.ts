import * as child_process from 'child_process';
import * as util from 'util';
import * as path from 'path';
const exec = util.promisify(child_process.exec);

export class GitHelper {
  private static async getGitRoot(filePath: string): Promise<string> {
    try {
      const { stdout } = await exec('git rev-parse --show-toplevel');
      return stdout.trim();
    } catch (error) {
      console.error('Error getting git root:', error);
      throw error;
    }
  }

  static async getLineCommitter(filePath: string, line: number): Promise<string> {
    try {
      // Get git repository root
      const gitRoot = await this.getGitRoot(filePath);
      console.log(`Git root: ${gitRoot}`);

      // Convert file path to be relative to git root
      const relativePath = path.relative(gitRoot, filePath);
      console.log(`Relative path: ${relativePath}`);

      // Change to git root directory before executing git blame
      process.chdir(gitRoot);
      
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
    } catch (error) {
      console.error('Error in getLineCommitter:', error);
      return 'Unknown';
    }
  }
}