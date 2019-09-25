import { IApi } from '@walrus/types';

export default function(api: IApi) {
  api.registerCommand('test:unit', {
    description: 'run unit tests with jest',
    usage: 'walrus test:unit [options] <regexForTestFiles>',
    options: {
      '--watch': 'run tests in watch mode'
    },
    details:
      `All jest command line options are supported.\n` +
      `See https://facebook.github.io/jest/docs/en/cli.html for more details.`
  },(args, rawArgv) => {
    // require('jest').run(rawArgv);
    console.log('test command');
  })
}

export const defaultModes = {
  'test:unit': 'test'
};
