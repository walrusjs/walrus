import { IApi } from '@walrus/types';
import { chalk } from '@walrus/shared-utils';
import prettier from './prettier';

export default function(api: IApi) {
  api.registerCommand('prettier', {
    description: 'prettier source files',
    usage: 'walrus prettier [opts] [filename ...]',
    options: {
      '--print-width <int>': 'print width (default: 100)'
    },
    details: 'For more options, see https://prettier.io/docs/en/options.html'
  }, (args, opts) => {
    console.log(args);
    console.log(opts);
    const cwd = api.getCwd();
    const prettyQuickResult = prettier(cwd,  Object.assign({}, args, {
      onFoundSinceRevision: (scm, revision) => {
        console.log(
          `🔍  Finding changed files since ${chalk.bold(
            scm,
          )} revision ${chalk.bold(revision)}.`,
        );
      },
    }))
  })
}
