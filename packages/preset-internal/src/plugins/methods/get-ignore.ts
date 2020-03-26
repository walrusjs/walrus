import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { Api } from '@walrus/types';

export default (api: Api) => {
  api.registerMethod({
    name: 'getIgnore',
    fn(directory: string, filename = '.walrusignore') {
      const file = join(directory, filename);
      if (existsSync(file)) {
        return readFileSync(file, 'utf8');
      }

      return undefined;
    }
  })
};
