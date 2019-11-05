import { Config, Plugins } from './config';
import { PluginPrettierOptions, ProcessFilesOptions } from './plugin-prettier';
import { PluginCommitLintOptions } from './plugin-commitlint';

export { Config, Plugins, PluginPrettierOptions, ProcessFilesOptions, PluginCommitLintOptions };

// 注册命令输入
export interface CommandOpts {
  description?: string;
  usage?: string;
  options?: {
    [key: string]: string;
  };
  details?: string;
}

export type Args = {
  [key: string]: any;
};

export type RawArgs = string[];

export type CommandFun = (
  args: Args,
  rawArgs: RawArgs,
  opts?: {
    [key: string]: any;
  }
) => void;

export interface RegisterCommand {
  (commandName: string, opts: CommandOpts, fn: CommandFun): void;
  (commandName: string, fn: CommandFun): void;
}

export interface API {
  // 获取当前的工作目录
  getCwd(): string;
  // 解决项目的路径
  resolve(path: string): string;
  // 检查项目是否具有给定的插件
  hasPlugin(id: string): boolean;
  // 注册命令
  registerCommand: RegisterCommand;
  service: any;
}
