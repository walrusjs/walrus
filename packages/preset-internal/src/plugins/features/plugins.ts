import { Api } from '@walrus/types';

export default (api: Api) => {
  api.describe({
    key: 'plugins',
    config: {
      schema(joi) {
        return joi.array().items(joi.string());
      },
    },
  });
};
