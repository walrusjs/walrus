#!/usr/bin/env node
import { chalk } from '@walrus/shared-utils';
import { API } from '@walrus/types';
import stylelint from 'stylelint';
import lintConfig from './config/stylelint.config.js';

export default function(api: API) {
  api.registerCommand(
    'stylelint',
    {
      description: 'lint your style code',
      usage: 'walrus stylelint [options] [...files]',
      options: {
        '--fix': 'Automatically fix violations of certain rules.',
        '--syntax': 'Specify a syntax. Options.'
      },
      details:
        'For more options, see https://github.com/stylelint/stylelint/blob/master/docs/user-guide/cli.md'
    },
    (args) => {
      stylelint
        .lint({
          config: lintConfig,
          files: args._,
          ...args
        })
        .then(function(data) {
          // do things with data.output, data.errored,
          // and data.results
          const { output } = data;
          const outputParsed = JSON.parse(output);
          outputParsed &&
            outputParsed.forEach(function(o) {
              const { source, warnings } = o;
              console.error(chalk.red(source));
              warnings &&
                warnings.forEach(function(w) {
                  const { line, column, rule, text } = w;
                  console.error(chalk.red(`${line}:${column}   ${text}`));
                });
              console.error('');
            });
        })
        .catch(function(err) {
          // do things with err e.g.
          console.error(chalk.red(err.stack));
        });
    }
  );
}
