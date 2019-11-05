import { Config } from '@walrus/types';
import { join } from 'path';

const config: Config = {
  resolvePlugins: [
    [
      join(__dirname, './lib/index.js'),
      {
        test: 'test'
      }
    ]
  ]
};

export default config;
