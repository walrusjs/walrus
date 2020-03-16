import assert from 'assert';
import * as utils from '@umijs/utils';
import Service from '.';
import { ServiceStage, PluginType } from './enums';
import { pathToObj, isValidPlugin } from './utils/plugin-utils';
import { Command, Hook, Preset } from './types';
import { Plugin } from './types';

export interface PluginApiOpts {
  id: string;
  key: string;
  service: Service;
}

class PluginApi {
  id: string;
  key: string;
  service: Service;
  utils: typeof utils;

  constructor(opts: PluginApiOpts) {
    this.id = opts.id;
    this.key = opts.key;
    this.service = opts.service;
    this.utils = utils;
  }

  register(hook: Hook) {
    assert(
      hook.key && typeof hook.key === 'string',
      `api.register() failed, hook.key must supplied and should be string, but got ${hook.key}.`,
    );
    assert(
      hook.fn && typeof hook.fn === 'function',
      `api.register() failed, hook.fn must supplied and should be function, but got ${hook.fn}.`,
    );
    this.service.hooksByPluginId[this.id] = (
      this.service.hooksByPluginId[this.id] || []
    ).concat(hook);
  }

  registerCommand(command: Command) {
    const { name, alias } = command;
    assert(
      !this.service.commands[name],
      `api.registerCommand() failed, the command ${name} is exists.`,
    );
    this.service.commands[name] = command;
    if (alias) {
      this.service.commands[alias] = name;
    }
  }

  registerMethod({ name, fn, exitsError = true }: {
    name: string;
    fn?: Function;
    exitsError?: boolean;
  }) {
    if (this.service.pluginMethods[name]) {
      if (exitsError) {
        throw new Error(
          `api.registerMethod() failed, method ${name} is already exist.`,
        );
      } else {
        return;
      }
    }

    this.service.pluginMethods[name] =
      fn || function(fn: Function) {
        const hook = {
          key: name,
          ...(utils.lodash.isPlainObject(fn) ? fn : { fn }),
        };
        this.register(hook);
      };
  }

  registerPresets(presets: (Preset | string)[]) {
    assert(
      this.service.stage === ServiceStage.initPresets,
      `api.registerPresets() failed, it should only used in presets.`,
    );
    assert(
      Array.isArray(presets),
      `api.registerPresets() failed, presets must be Array.`,
    );
    const extraPresets = presets.map(preset => {
      return isValidPlugin(preset as any)
        ? (preset as Preset)
        : pathToObj({
            type: PluginType.preset,
            path: preset as string,
            cwd: this.service.cwd,
          });
    });
    // 插到最前面，下个 while 循环优先执行
    this.service._extraPresets.splice(0, 0, ...extraPresets);
  }

  // 在 preset 初始化阶段放后面，在插件注册阶段放前面
  registerPlugins(plugins: (Plugin | string)[]) {
    assert(
      this.service.stage === ServiceStage.initPresets ||
        this.service.stage === ServiceStage.initPlugins,
      `api.registerPlugins() failed, it should only be used in registering stage.`,
    );
    assert(
      Array.isArray(plugins),
      `api.registerPlugins() failed, plugins must be Array.`,
    );
    const extraPlugins = plugins.map(plugin => {
      return isValidPlugin(plugin as any)
        ? (plugin as Plugin)
        : pathToObj({
            type: PluginType.plugin,
            path: plugin as string,
            cwd: this.service.cwd,
          });
    });
    if (this.service.stage === ServiceStage.initPresets) {
      this.service._extraPlugins.push(...extraPlugins);
    } else {
      this.service._extraPlugins.splice(0, 0, ...extraPlugins);
    }
  }

  skipPlugins(pluginIds: string[]) {
    pluginIds.forEach(pluginId => {
      this.service.skipPluginIds.add(pluginId);
    });
  }
}

export default PluginApi;
