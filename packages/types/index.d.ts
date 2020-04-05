import { Ignore } from 'ignore';
import { PluginApi, Service } from '@walrus/core';

export interface Config {
  [key: string]: any;
}

interface Fun<V, T> {
  (v: V): T;
}

interface Obj {
  [key: string]: any;
}

export interface Api extends PluginApi {
  // properties
  cwd: typeof Service.prototype.cwd;
  userConfig: typeof Service.prototype.userConfig;
  config: Config;
  pkg: typeof Service.prototype.pkg;
  args: typeof Service.prototype.args;

  mergeConfig: (userConfig: Obj, args: Obj) => Obj;
  createMatcher: Fun<(string | string[]), (v?: string) => boolean>;
}
