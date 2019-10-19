import { IApi, IConfig } from '@walrus/types';
import commitLint from './commitlint';

const pkg = require('../package.json');

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
  }, (args) => {
    commitLint(args._, Object.assign({}, config.pluginCommitLint, args)).catch(err =>
      setTimeout(() => {
        if (err.type === pkg.name) {
          process.exit(1);
        }
        throw err;
      })
    );;
  })
}
