import { IPluginPrettierOptions } from '@walrus/types';
import { join } from 'path';

const defaultOptions: IPluginPrettierOptions = {
  config: join(__dirname, 'prettier.config.js')
};

export default defaultOptions;
