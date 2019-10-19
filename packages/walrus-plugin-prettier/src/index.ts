import { join } from 'path';
import { IApi } from '@walrus/types';
import { chalk } from '@walrus/shared-utils';
import prettier from './prettier';

const prettierConfig = join(__dirname, 'prettier.config.js');

export default function(api: IApi) {
  api.registerCommand(
    'prettier',
    {
      description: 'prettier source files',
      usage: 'walrus prettier [opts] [filename ...]',
      options: {
        '--print-width <int>': 'print width (default: 100)'
      },
      details: 'For more options, see https://prettier.io/docs/en/options.html'
    },
    (args, opts) => {
      const cwd = api.getCwd();
      const prettyQuickResult = prettier(
        cwd,
        Object.assign(
          {
            config: prettierConfig
          },
          args,
          {
            onFoundSinceRevision: (scm, revision) => {
              console.log(
                `🔍  Finding changed files since ${chalk.bold(scm)} revision ${chalk.bold(
                  revision
                )}.`
              );
            },
            onFoundChangedFiles: (changedFiles) => {
              console.log(changedFiles);
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
