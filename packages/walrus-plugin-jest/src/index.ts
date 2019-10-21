import { IApi } from '@walrus/types';
import { run } from 'jest';
import { DefaultConfigResolver } from './defaultConfig.resolver';
import { CustomConfigResolver } from './customConfig.resolver';
import { JestConfigurationBuilder } from './jestConfigurationBuilder';

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
    const configuration = new JestConfigurationBuilder(
      new DefaultConfigResolver(),
      new CustomConfigResolver()
    ).buildConfiguration(process.cwd());
    rawArgv.push('--config', JSON.stringify(configuration));
    // 未查找到测试文件正常退出
    rawArgv.push('--passWithNoTests');
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
  'test': 'test'
};
