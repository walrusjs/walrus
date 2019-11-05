import { join } from 'path';
import { PluginCommitLintOptions } from '@walrus/types';

const defaultOptions: PluginCommitLintOptions = {
  env: null,
  color: true,
  edit: false,
  from: null,
  to: null,
  config: join(__dirname, 'commitlint.config.js')
};

export default defaultOptions;
