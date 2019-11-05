import { API, Config } from '@walrus/types';
import { run } from 'jest';
import { DefaultConfigResolver } from './defaultConfig.resolver';
import { CustomConfigResolver } from './customConfig.resolver';
import { JestConfigurationBuilder } from './jestConfigurationBuilder';

const debug = require('debug')('walrus-plugin-jest');

export default function(api: API, conf: Config) {
  api.registerCommand(
    'test',
    {
      description: 'run unit tests with jest',
      usage: 'walrus test [options] <regexForTestFiles>',
      options: {
        '--watch': 'run tests in watch mode'
      },
      details:
        `All jest command line options are supported.\n` +
        `See https://facebook.github.io/jest/docs/en/cli.html for more details.`
    },
    (args, rawArgv) => {
      const rootDir = api.resolve('.');
      // 获取默认配置
      const defaultConfig = new DefaultConfigResolver(rootDir);

      const configuration = new JestConfigurationBuilder(
        defaultConfig,
        new CustomConfigResolver()
      ).buildConfiguration(process.cwd());
      rawArgv.push('--config', JSON.stringify(configuration));
      // 未查找到测试文件正常退出
      rawArgv.push('--passWithNoTests');
      run(rawArgv)
        .then((result) => {
          debug(result);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  );
}

export const defaultModes = {
  test: 'test'
};
