import { IApi, IConfig } from '@walrus/types';
import { chalk } from '@walrus/shared-utils';
import prettier from './prettier';
import defaultConfig from './defaultConfig';

export default function(api: IApi, config: IConfig) {
  api.registerCommand(
    'prettier',
    {
      description: 'prettier source files',
      usage: 'walrus prettier [opts] [filename ...]',
      options: {
        '--staged':
          'Pre-commit mode. Under this flag only staged files will be formatted, and they will be re-staged after formatting.',
        '--no-restage': 'Use with the `--staged` flag to skip re-staging files after formatting.',
        '--branch':
          'When not in `staged` pre-commit mode, use this flag to compare changes with the specified branch. Defaults to `master` (git) / `default` (hg) branch.',
        '--pattern':
          'Filters the files for the given [minimatch](https://github.com/isaacs/minimatch) pattern.',
        '--verbose':
          `Outputs the name of each file right before it is proccessed. This can be useful if Prettier throws an error and you can't identify which file is causing the problem.`,
        '--bail': 'Prevent `git commit` if any files are fixed.',
        '--check':
          `Check that files are correctly formatted, but don't format them. This is useful on CI to verify that all changed files in the current branch were correctly formatted.`,
        '--config': 'Path to a prettier config file.'
      },
      details: 'For more options, see https://prettier.io/docs/en/options.html'
    },
    (args) => {
      const opts = config.pluginPrettier || {};
      const cwd = api.getCwd();
      const prettyQuickResult = prettier(
        cwd,
        Object.assign(defaultConfig, opts, args,
          {
            onFoundSinceRevision: (scm, revision) => {
              console.log(
                `🔍  Finding changed files since ${chalk.bold(scm)} revision ${chalk.bold(
                  revision
                )}.`
              );
            },
            onFoundChangedFiles: (changedFiles) => {
              console.log(
                `🎯  Found ${chalk.bold(changedFiles.length)} changed ${
                  changedFiles.length === 1 ? 'file' : 'files'
                }.`
              );
            },
            onPartiallyStagedFile: (file) => {
              console.log(`✗ Found ${chalk.bold('partially')} staged file ${file}.`);
            },
            onWriteFile: (file) => {
              console.log(`✍️  Fixing up ${chalk.bold(file)}.`);
            },
            onCheckFile: (file, isFormatted) => {
              if (!isFormatted) {
                console.log(`⛔️  Check failed: ${chalk.bold(file)}`);
              }
            },
            onExamineFile: (file) => {
              console.log(`🔍  Examining ${chalk.bold(file)}.`);
            }
          }
        )
      );

      if (prettyQuickResult.success) {
        console.log('✅  Everything is awesome!');
      } else {
        if (prettyQuickResult.errors.indexOf('PARTIALLY_STAGED_FILE') !== -1) {
          console.log(
            '✗ Partially staged files were fixed up.' +
              ` ${chalk.bold('Please update stage before committing')}.`
          );
        }
        if (prettyQuickResult.errors.indexOf('BAIL_ON_WRITE') !== -1) {
          console.log('✗ File had to be prettified and prettyQuick was set to bail mode.');
        }
        if (prettyQuickResult.errors.indexOf('CHECK_FAILED') !== -1) {
          console.log('✗ Code style issues found in the above file(s). Forgot to run Prettier?');
        }
        process.exit(1);
      }
    }
  );
}
