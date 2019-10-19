import { IApi, IConfig } from '@walrus/types';
import commitLint from './commitlint';

export default function(
  api: IApi,
  config: IConfig
) {
  api.registerCommand('commitlint', {
    description: 'Lint your commit messages',
    usage: 'walrus commitlint [input]',
    options: {
      '--color': 'toggle colored output',
      '--config [file]': 'path to the config file'
    }
  }, (args, rawArgv) => {
    const options = Object.assign({}, config.pluginCommitLint, rawArgv);
    commitLint(args._, options).then();
  })
}
