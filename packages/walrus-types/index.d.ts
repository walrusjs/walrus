import IConfig, { IPlugin } from './config';
import { IPluginPrettierOptions, IProcessFilesOptions } from './plugin-prettier';
import { IPluginCommitLintOptions } from './plugin-commitlint';

export {
  IConfig,
  IPlugin,
  IPluginPrettierOptions,
  IProcessFilesOptions,
  IPluginCommitLintOptions
};

export interface ICommandOpts {
  description?: string;
  usage?: string;
  options?: {
    [key: string]: string;
  };
  details?: string;
}

export type Args = {
  [key: string]: any;
}

export type IRawArgs = string[];

export type ICommandFun = (
  args: Args,
  rawArgs: IRawArgs,
  opts?: {
    [key: string]: any
  }
) => void;

interface IRegisterCommand {
  (commandName: string, opts: ICommandOpts, fn: ICommandFun): void;
  (commandName: string, fn: ICommandFun): void;
}

export interface IApi {
  // 获取当前的工作目录
  getCwd(): string;
  // 解决项目的路径
  resolve(path: string): string;
  // 检查项目是否具有给定的插件
  hasPlugin(id: string): boolean;
  // 注册命令
  registerCommand: IRegisterCommand;
  service: any;
}
