import Cmd from './cmd';
import { join } from 'path';
import * as eslint from 'eslint';
import { readPkg } from '@walrus/shared-utils';

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

export default function() {
  Cmd(options);
}

