import scms from './scms';

export default (currentDirectory: string): {
  // 仓库根目录
  rootDirectory: string;
  // 代码管理类型
  name: 'git' | 'hg',
  // 查找 .git、.hg 目录
  detect: (string) => string;
  // 获取最后的修订号
  getSinceRevision: (directory: string, opts: {  staged: boolean, branch: string }) => string;
  // 获取暂存的文件
  getChangedFiles: (directory: string, revision: string, staged: boolean) => string[];
  // 获取未暂存的文件
  getUnstagedChangedFiles: (directory: string) => string[];
  // 暂存文件
  stageFile: (directory: string, file: string) => void
} => {
  const scm = scms(currentDirectory);
  if (!scm) {
    throw new Error('Unable to detect a source control manager.');
  }
  return scm;
}
