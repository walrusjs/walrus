import { dirname } from 'path';
import * as findUp from 'find-up';
import * as execa from 'execa';

const detect = (directory) => {
  // 获取git目录
  const gitDirectory = findUp.sync('.git', {
    cwd: directory,
    type: 'directory'
  });
  if (gitDirectory) {
    return dirname(gitDirectory);
  }
};

const stageFile = (directory, file) => {
  runGit(directory, ['add', file]);
};

const runGit = (directory: string, args) =>
  execa.sync('git', args, {
    cwd: directory
  });

const getLines = (execaResult) => execaResult.stdout.split('\n');

const getSinceRevision = (directory, { staged, branch }) => {
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

/**
 * 获取修改的文件
 * @param directory
 * @param revision
 * @param staged
 */
const getChangedFiles = (directory: string, revision, staged) => {
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

const getUnstagedChangedFiles = (directory) => {
  return getChangedFiles(directory, null, false);
};

export default (directory) => {
  const rootDirectory = detect(directory);

  if (rootDirectory) {
    return {
      name: 'git',
      rootDirectory,
      stageFile,
      getChangedFiles,
      getSinceRevision,
      getUnstagedChangedFiles
    };
  }
};
