import ignore, { Ignore } from 'ignore';
import { join } from 'path';
import { Api } from '@walrus/types';

export default (api: Api) => {
  api.registerMethod({
    name: 'createIgnorer',
    fn(patterns: (string | Ignore)[] = []) {
      if (patterns && patterns.length) {
        const filter = ignore()
          .add(patterns)
          .createFilter();
        return (path) => filter(join(path));
      }

      return () => true;
    }
  })
};
