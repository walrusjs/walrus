import { API, Config } from '@walrus/types';
import commitLint from './commitlint';

const pkg = require('../package.json');

export default function(api: API, config: Config) {
  api.registerCommand(
    'commitlint',
    {
      description: 'lint your commit messages',
      usage: 'walrus commitlint [input]',
      options: {
        '--color': 'toggle colored output',
        '--config [file]': 'path to the config file'
      }
    },
    (args, rawArgs, opts) => {
      commitLint(args._, Object.assign({}, opts, args)).catch((err) =>
        setTimeout(() => {
          if (err.type === pkg.name) {
            process.exit(1);
          }
          throw err;
        })
      );
    }
  );
}
