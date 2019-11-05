import { PluginPrettierOptions } from '@walrus/types';
import { join } from 'path';

const defaultOptions: PluginPrettierOptions = {
  config: join(__dirname, 'prettier.config.js')
};

export default defaultOptions;
