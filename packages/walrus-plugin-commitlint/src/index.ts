import { IApi, IConfig } from '@walrus/types';
import commitLint from './commitlint';

export default function(
  api: IApi,
  config: IConfig
) {
  api.registerCommand('commitlint', {
    description: 'Lint your commit messages',
  }, (args, rawArgv, opts) => {
    commitLint().then()
  })
}
