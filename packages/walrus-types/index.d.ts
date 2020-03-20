import { Ignore } from 'ignore';
import { PluginApi, Service } from '@walrus/core';

export interface ReleasePluginConfig {
  // 跳过编译
  skipBuild?: boolean;
  // 跳过发布
  skipPublish?: boolean;
  // 仓库地址
  repoUrl?: string;
  // 仓库地址前缀 目前支持 github
  repoUrlPrefix?: string;
  // 跳过 Git 状态检查
  skipGitStatusCheck?: boolean;
  // 仅发布
  publishOnly?: boolean;
  // 跳过changelog
  skipChangelog?: boolean;
  conventionalGraduate?: any;
  conventionalPrerelease?: any;
}

export interface Config {
  release?: ReleasePluginConfig;
  // 需要忽略的文件
  ignore?: string[]
  [key: string]: any;
}

interface Getter<V, T> {
  (v: V): T;
}

export interface Api extends PluginApi {
  // properties
  cwd: typeof Service.prototype.cwd;
  userConfig: typeof Service.prototype.userConfig;
  config: Config;
  pkg: typeof Service.prototype.pkg;
  args: typeof Service.prototype.args;

  // methods
  createIgnorer: Getter<(string | Ignore)[], (v?: string) => boolean>;
}
