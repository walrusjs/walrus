import { PluginApi, Service } from '@walrus/core';

export interface Config {
  [key: string]: any;
}

interface AnyObj {
  [key: string]: any;
}

export interface Api extends PluginApi {
  // properties
  cwd: typeof Service.prototype.cwd;
  userConfig: typeof Service.prototype.userConfig;
  config: Config;
  pkg: typeof Service.prototype.pkg;
  args: typeof Service.prototype.args;

  // methods
  mergeConfig: (userConfig: AnyObj, args: AnyObj) => AnyObj;
}
