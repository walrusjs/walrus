import { Api } from '@walrus/types';

export default (api: Api) => {
  api.registerCommand({
    name: 'version',
    description: 'show umi version',
    fn: async function() {},
  });
};
