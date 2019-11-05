import { API, Config } from '@walrus/types';

export default function(api: API, config: Config) {
  api.registerCommand(
    'example',
    {
      description: 'walrus example'
    },
    (args, rawArgv, opts) => {
      console.log('cli配置');
      console.dir(config);
      console.log('插件配置');
      console.dir(opts);
    }
  );
}
