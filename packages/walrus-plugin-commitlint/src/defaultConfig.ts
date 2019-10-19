import { join } from 'path';
import { IPluginCommitLintOptions } from '@walrus/types';

const defaultOptions: IPluginCommitLintOptions = {
  env: null,
  color: true,
  edit: false,
  from: null,
  to: null,
  config: join(__dirname, 'commitlint.config.js')
};

export default defaultOptions;
