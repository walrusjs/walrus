import IConfig, { IPlugin } from './config';

export { IConfig, IPlugin };

export interface ICommandOpts {
  description?: string;
  usage?: string;
  options?: {
    [key: string]: string;
  };
  details?: string;
}

export type IArgs = {
  [key: string]: any;
}

export type IRawArgs = string[];

export type ICommandFun = (
  args: IArgs,
  rawArgs: IRawArgs
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