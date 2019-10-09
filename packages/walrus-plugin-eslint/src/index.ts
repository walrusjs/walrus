#!/usr/bin/env node

import { IApi } from '@walrus/types';
import Cli from './cli';

export default function(api: IApi) {
  api.registerCommand('lint', {
    description: 'lint and fix source files',
    usage: 'walrus lint [options] [...files]',
    options: {
      '--format [formatter]': 'specify formatter (default: codeframe)',
      '--no-fix': 'do not fix errors or warnings',
      '--no-fix-warnings': 'fix errors, but do not fix warnings',
      '--max-errors [limit]':
        'specify number of errors to make build failed (default: 0)',
      '--max-warnings [limit]':
        'specify number of warnings to make build failed (default: Infinity)'
    },
    details:
      'For more options, see https://eslint.org/docs/user-guide/command-line-interface#options'
  }, (args) => {
    console.log(args);
    // Cli();
  })
}
