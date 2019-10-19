import { dirname } from 'path';
import * as findUp from 'find-up';
import * as execa from 'execa';

export const name = 'git';

/**
 * 检查指定目录下是否存在.git目录
 * @param directory
 */
export const detect = (directory) => {
  // 获取git目录
  const gitDirectory = findUp.sync('.git', {
    cwd: directory,
    type: 'directory'
  });
  if (gitDirectory) {
    return dirname(gitDirectory);
  }
};

const getLines = (execaResult) => execaResult.stdout.split('\n');

/**
 * 运行Git命令
 * @param directory
 * @param args
 */
const runGit = (directory: string, args) =>
  execa.sync('git', args, {
    cwd: directory
  });

export const getSinceRevision = (directory, { staged, branch }) => {
  try {
    const revision = staged
      ? 'HEAD'
      : runGit(directory, ['merge-base', 'HEAD', branch || 'master']).stdout.trim();
    return runGit(directory, ['rev-parse', '--short', revision]).stdout.trim();
  } catch (error) {
    if (/HEAD/.test(error.message) || (staged && /Needed a single revision/.test(error.message))) {
      return null;
    }
    throw error;
  }
};

export const getUnstagedChangedFiles = (directory) => {
  return getChangedFiles(directory, null, false);
};

/**
 * 获取修改的文件
 * @param directory
 * @param revision
 * @param staged
 */
export const getChangedFiles = (directory: string, revision, staged) => {
  return [
    ...getLines(
      runGit(
        directory,
        [
          'diff',
          '--name-only',
          staged ? '--cached' : null,
          '--diff-filter=ACMRTUB',
          revision
        ].filter(Boolean)
      )
    ),
    ...(staged ? [] : getLines(runGit(directory, ['ls-files', '--others', '--exclude-standard'])))
  ].filter(Boolean);
};

export const stageFile = (directory, file) => {
  runGit(directory, ['add', file]);
};
