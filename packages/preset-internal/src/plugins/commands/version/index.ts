import { Api } from '@walrus/types';

export default (api: Api) => {
  api.registerCommand({
    name: 'version',
    description: 'show walrus version',
    fn: async function() {
      console.log('version');
    },
  });
};
