import chalk from 'chalk';
import { IConfig } from '@walrus/types';
import getUserConfig from './utils/getUserConfig';
import { mergeConfig } from './utils';

const debug = require('debug')('umi-core:Service');

class Service {
  private cwd: string;
  private plugins: any[];
  private config: IConfig;

  constructor(cwd?) {
    this.cwd = cwd || process.cwd();
    this.config = getUserConfig();
  }

  init = () => {

  };

  initPlugins = () => {

  };

  resolvePlugins = () => {

  }
}

export default Service;
