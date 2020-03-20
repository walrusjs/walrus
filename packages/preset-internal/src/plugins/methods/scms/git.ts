import { dirname, join } from 'path';
import { existsSync } from 'fs';
import findUp from 'find-up';
import { execa } from '@birman/utils';

export const name = 'git';

/**
 * 获取 .git 目录
 * @param directory
 */
export const detect = (directory: string) => {
  if (existsSync(join(directory, '.git'))) {
    return directory;
  }

  const gitDirectory = findUp.sync('.git', {
    cwd: directory,
    type: 'directory',
  });

  if (gitDirectory) {
    return dirname(gitDirectory);
  }
}

const getLines = (execaResult) => execaResult.stdout.split('\n');

const runGit = (directory, args) =>
  execa.sync('git', args, {
    cwd: directory,
  });

export const getSinceRevision = (directory, { staged, branch }) => {
  try {
    const revision = staged
      ? 'HEAD'
      : runGit(directory, [
          'merge-base',
          'HEAD',
          branch || 'master',
        ]).stdout.trim();
    return runGit(directory, ['rev-parse', '--short', revision]).stdout.trim();
  } catch (error) {
    if (
      /HEAD/.test(error.message) ||
      (staged && /Needed a single revision/.test(error.message))
    ) {
      return null;
    }
    throw error;
  }
};

export const getChangedFiles = (directory, revision, staged) => {
  return [
    ...getLines(
      runGit(
        directory,
        [
          'diff',
          '--name-only',
          staged ? '--cached' : null,
          '--diff-filter=ACMRTUB',
          revision,
        ].filter(Boolean),
      ),
    ),
    ...(staged
      ? []
      : getLines(
          runGit(directory, ['ls-files', '--others', '--exclude-standard']),
        )),
  ].filter(Boolean);
};

export const getUnstagedChangedFiles = directory => {
  return getChangedFiles(directory, null, false);
};

export const stageFile = (directory, file) => {
  runGit(directory, ['add', file]);
};
