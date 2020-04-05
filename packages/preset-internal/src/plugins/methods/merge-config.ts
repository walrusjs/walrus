import { Api } from '@walrus/types';
import { lodash } from '@walrus/utils';

interface Obj {
  [key: string]: any;
}

export default (api: Api) => {
  api.registerMethod({
    name: 'mergeConfig',
    fn(userConfig: Obj = {}, args: Obj = {}) {
      const result = {};
      const config = lodash.merge({}, userConfig, args);

      Object.keys(config).forEach(item => {
        const key = lodash.camelCase(item);

        if (!(key in result) && item !== '_') {
          result[key] = config[item];
        }
      });

      return result;
    }
  })
};
