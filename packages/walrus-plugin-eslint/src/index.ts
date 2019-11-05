#!/usr/bin/env node

import { join } from 'path';
import * as eslint from 'eslint';
import { API, Config } from '@walrus/types';
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
    configFile: join(__dirname, './config/eslintrc.base.js')
  },
  version: pkg.version
};

export default function(api: API, config: Config) {
  api.registerCommand(
    'lint',
    {
      description: 'lint and fix source files',
      usage: 'walrus lint [options] [...files]',
      options: {
        '--format [formatter]': 'specify formatter (default: codeframe)',
        '--no-fix': 'do not fix errors or warnings',
        '--no-fix-warnings': 'fix errors, but do not fix warnings',
        '--max-errors [limit]': 'specify number of errors to make build failed (default: 0)',
        '--max-warnings [limit]':
          'specify number of warnings to make build failed (default: Infinity)'
      },
      details:
        'For more options, see https://eslint.org/docs/user-guide/command-line-interface#options'
    },
    () => {
      // react
      if (config.frame === 'react') {
        options.eslintConfig.configFile = join(__dirname, './config/eslintrc.react.js');
        if (config.useTS) {
          options.eslintConfig.configFile = join(__dirname, './config/eslintrc.react-ts.js');
        }
      }
      // 无框架
      if (!config.frame && config.useTS) {
        options.eslintConfig.configFile = join(__dirname, './config/eslintrc.ts.js');
      }
      cli(options);
    }
  );
}
