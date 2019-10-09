#!/usr/bin/env node

import { join } from 'path';
import * as eslint from 'eslint';
import { IApi } from '@walrus/types';
import { readPkg } from '@walrus/shared-utils';
import cli from './cli';

const pkg = readPkg.sync({
  cwd: join(__dirname, '..')
});

const options = {
  bugs: pkg.bugs.url,
  cmd: 'walrus',
  eslint,
  eslintConfig: {
    configFile: join(__dirname, '../eslintrc.json')
  },
  version: pkg.version
};

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
    // cli(options);
  })
}
