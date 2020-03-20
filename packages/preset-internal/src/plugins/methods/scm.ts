import { Api } from '@walrus/types';
import scms from './scms';

export default (api: Api) => {
  api.registerMethod({
    name: 'scm',
    fn(currentDirectory: string) {
      const scm = scms(currentDirectory);
      if (!scm) {
        throw new Error('Unable to detect a source control manager.');
      }
      return scm;
    }
  })
};
