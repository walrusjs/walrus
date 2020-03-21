import { Ignore } from 'ignore';
import { PluginApi, Service } from '@walrus/core';
import { PluginCommitLintConfig } from './plugin-commitlint';
import { PluginPrettierConfig, ProcessFilesOptions } from './plugin-prettier';

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
  // 插件配置
  release?: ReleasePluginConfig;
  prettier?: PluginPrettierConfig;
  // 需要忽略的文件
  ignore?: string[];
  commitlint?: any;
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
  mergeConfig: (userConfig: Obj, args: Obj) => Obj;
  createIgnorer: Fun<(string | (string | Ignore)[]), (v?: string) => boolean>;
  createMatcher: Fun<(string | string[]), (v?: string) => boolean>;
}

export { PluginCommitLintConfig }
export { PluginPrettierConfig, ProcessFilesOptions }
