import { deepmerge, lodash } from '@birman/utils';

interface Opts {
  defaultConfig: any;
  config: any;
}

export default ({ defaultConfig, config }: Opts) => {
  if (lodash.isPlainObject(defaultConfig) && lodash.isPlainObject(config)) {
    return deepmerge(defaultConfig, config);
  }
  return typeof config !== 'undefined' ? config : defaultConfig;
};
