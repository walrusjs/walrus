import { IApi } from '@walrus/types';
import { run } from 'jest';
import resolve from './utils/resolve';
import createJestConfig from './jest-config/defaultConfig';

const rootDir = process.cwd();
const debug = require('debug')('walrus-plugin-jest');

export default function(api: IApi) {
  api.registerCommand('test', {
    description: 'run unit tests with jest',
    usage: 'walrus test:unit [options] <regexForTestFiles>',
    options: {
      '--watch': 'run tests in watch mode'
    },
    details:
      `All jest command line options are supported.\n` +
      `See https://facebook.github.io/jest/docs/en/cli.html for more details.`
  },(args, rawArgv) => {
    rawArgv.push('--config', JSON.stringify(createJestConfig(resolve, rootDir)));
    run(rawArgv)
      .then((result) => {
        debug(result);
      })
      .catch(e => {
        console.log(e);
      });
  })
}

export const defaultModes = {
  'test:unit': 'test'
};
