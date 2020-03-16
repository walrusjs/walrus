import assert from 'assert';
import * as utils from '@umijs/utils';
import Service from '.';
import { Command, Hook } from './types';

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

}

export default PluginApi;
