import { merge } from 'lodash';
import { LoadResult } from 'joycon';
import configLoader from './utils/configLoader';
import { IConfig } from '@walrus/types';

/**
 * 获取用户配置
 * @param cwd 用户的执行目录
 */
const getUserConfig = (cwd?: string): IConfig => {
  cwd = cwd || process.cwd();

  const userConfig: LoadResult = configLoader.loadSync({
    files: [
      'walrus.config.js',
      'walrus.config.ts'
    ],
    cwd
  });

  const defaultConfig: IConfig = {

  };

  return merge(defaultConfig, userConfig.data);
};

/**
 * 获取配置
 * @param cwd
 */
const getConfig = (cwd?: string) => {
  cwd = cwd || process.cwd();

  // 用户配置
  return getUserConfig(cwd) || {};
};

export default getConfig;
