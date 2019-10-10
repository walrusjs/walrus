import { resolve } from 'path';
import { PluginResolution, lodash } from '@walrus/shared-utils';
import Server from './service';

export interface IPluginConfig {
  [key: string]: any;
}

const pluginResolution = new PluginResolution();

class PluginAPI {
  private id: string;
  private readonly pluginConfig: IPluginConfig;
  private service: Server;

  constructor (
    id: string,
    service,
    pluginConfig: IPluginConfig
  ) {
    this.id = id;
    this.service = service;
    this.pluginConfig = pluginConfig;
  }

  /**
   * 获取当前的工作目录
   */
  getCwd() {
    return this.service.context;
  }

  /**
   * 解决项目的路径
   *
   * @param {string} path 从项目根目录开始的相对路径
   * @return {string} 解析后的绝对路径
   */
  resolve(path: string): string {
    return resolve(this.service.context, path)
  }

  /**
   * 检查项目是否具有给定的插件
   * @param id
   */
  hasPlugin(id: string): boolean {
    return this.service.plugins.some(p => pluginResolution.matchesPluginId(id, p.id))
  }

  /**
   * 注册一个作为 `walrus [name]` 的命令
   *
   * @param {string} name
   * @param {object} [opts]
   *   {
   *     description: string,
   *     usage: string,
   *     options: { [string]: string }
   *   }
   * @param {function} fn
   *   (args: { [string]: string }, rawArgs: string[]) => ?Promise
   */
  registerCommand(name: string, opts, fn) {
    if (lodash.isFunction(opts)) {
      fn = opts;
      opts = null
    }
    this.service.commands[name] = {
      fn,
      opts: opts || {},
      config: this.pluginConfig
    }
  }
}

export default PluginAPI;
