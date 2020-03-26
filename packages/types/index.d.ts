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

  // methods
  scm: Fun<string, {
    // 仓库根目录
    rootDirectory: string;
    // 代码管理类型
    name: 'git' | 'hg',
    // 查找 .git、.hg 目录
    detect: (string) => string;
    // 获取最后的修订号
    getSinceRevision: (directory: string, opts: {  staged: boolean, branch: string }) => string;
    // 获取暂存的文件
    getChangedFiles: (directory: string, revision: string, staged: boolean) => string[];
    // 获取未暂存的文件
    getUnstagedChangedFiles: (directory: string) => string[];
    // 暂存文件
    stageFile: (directory: string, file: string) => void
  }>;
  getIgnore: (directory: string, filename?: string) => string;
  mergeConfig: (userConfig: Obj, args: Obj) => Obj;
  createIgnorer: Fun<(string | (string | Ignore)[]), (v?: string) => boolean>;
  createMatcher: Fun<(string | string[]), (v?: string) => boolean>;
}
