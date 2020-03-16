import assert from 'assert';
import { join } from 'path';
import { existsSync } from 'fs';
import { EventEmitter } from 'events';
import { AsyncSeriesWaterfallHook } from 'tapable';
import { BabelRegister, NodeEnv, lodash } from '@birman/utils';
import PluginApi, { PluginApiOpts } from './plugin-api';
import Config from './config';
import { resolvePlugins } from './utils/plugin-utils';
import { getUserConfigWithKey } from './config/utils';
import { ServiceStage, ApplyPluginsType, EnableBy } from './enums';
import { Command, Hook, Plugin, Package } from './types';

export interface ServiceOpts {
  cwd: string;
  pkg?: any;
  presets?: string[];
  plugins?: string[];
  env?: NodeEnv;
}

interface ConfigData {
  plugins?: string[];
  [key: string]: any;
}

class Service extends EventEmitter {
  cwd: string;
  pkg: Package;
  configInstance: Config;
  // user config
  userConfig: ConfigData;
  skipPluginIds: Set<string> = new Set<string>();
  // babel register
  babelRegister: BabelRegister;
  // registered commands
  commands: {
    [name: string]: Command | string;
  } = {};
  // plugin methods
  pluginMethods: {
    [name: string]: Function;
  } = {};
  // hooks
  hooksByPluginId: {
    [id: string]: Hook[];
  } = {};
  hooks: {
    [key: string]: Hook[];
  } = {};
  // including presets and plugins
  plugins: {
    [id: string]: Plugin;
  } = {};
  // plugins for registering
  _extraPlugins: Plugin[] = [];
  // initial presets and plugins from arguments, config, process.env, and package.json
  initialPlugins: Plugin[];
  // lifecycle stage
  stage: ServiceStage = ServiceStage.uninitiialized;
  EnableBy = EnableBy;
  ServiceStage = ServiceStage;
  env: string | undefined;
  args: any;

  constructor(opts: ServiceOpts) {
    super();
    this.cwd = opts.cwd || process.cwd();

    // repoDir should be the root dir of repo
    this.pkg = opts.pkg || this.resolvePackage();

    assert(existsSync(this.cwd), `cwd ${this.cwd} does not exist.`);

    // register babel before config parsing
    this.babelRegister = new BabelRegister();

    this.configInstance = new Config({
      cwd: this.cwd,
      service: this,
      localConfig: this.env === 'development',
    });
    this.userConfig = this.configInstance.getUserConfig();

    // setup initial plugins
    const baseOpts = {
      pkg: this.pkg,
      cwd: this.cwd,
    };
    this.initialPlugins = resolvePlugins({
      ...baseOpts,
      plugins: opts.plugins || [],
      userConfigPlugins: this.userConfig.plugins || [],
    });
    this.babelRegister.setOnlyMap({
      key: 'initialPlugins',
      value: lodash.uniq([
        ...this.initialPlugins.map(({ path }) => path),
      ]),
    });
  }

  setStage(stage: ServiceStage) {
    this.stage = stage;
  }

  resolvePackage() {
    try {
      return require(join(this.cwd, 'package.json'));
    } catch (e) {
      return {};
    }
  }

  getPluginAPI(opts: PluginApiOpts) {
    const pluginAPI = new PluginApi(opts);

    // register built-in methods
    [
      'onPluginReady',
      'modifyPaths',
      'onStart',
      'modifyDefaultConfig',
      'modifyConfig',
    ].forEach(name => {
      pluginAPI.registerMethod({ name, exitsError: false });
    });

    return new Proxy(pluginAPI, {
      get: (target, prop: string) => {
         // 由于 pluginMethods 需要在 register 阶段可用
        // 必须通过 proxy 的方式动态获取最新，以实现边注册边使用的效果
        if (this.pluginMethods[prop]) return this.pluginMethods[prop];
        if (
          [
            'applyPlugins',
            'ApplyPluginsType',
            'EnableBy',
            'ConfigChangeType',
            'babelRegister',
            'stage',
            'ServiceStage',
            'paths',
            'cwd',
            'pkg',
            'userConfig',
            'config',
            'env',
            'args',
            'hasPlugins',
            'hasPresets',
          ].includes(prop)
        ) {
          return typeof this[prop] === 'function'
            ? this[prop].bind(this)
            : this[prop];
        }
        return target[prop];
      }
    })
  }

  registerPlugin(plugin: Plugin) {
    // 考虑要不要去掉这里的校验逻辑
    // 理论上不会走到这里，因为在 describe 的时候已经做了冲突校验
    if (this.plugins[plugin.id]) {
      const name = plugin.isPreset ? 'preset' : 'plugin';
      throw new Error(`\
${name} ${plugin.id} is already registered by ${this.plugins[plugin.id].path}, \
${name} from ${plugin.path} register failed.`);
    }
    this.plugins[plugin.id] = plugin;
  }

  initPlugins() {
    this.setStage(ServiceStage.initPlugins);
    this._extraPlugins = [];

    this.setStage(ServiceStage.initPlugins);
    this._extraPlugins.push(...this.initialPlugins);
    while (this._extraPlugins.length) {
      this.initPlugin(this._extraPlugins.shift()!);
    }
  }

  initPlugin(plugin: Plugin) {
    const { id, key, apply } = plugin;

    const api = this.getPluginAPI({ id, key, service: this });

    // register before apply
    this.registerPlugin(plugin);
    apply()(api);
  }

  isPluginEnable(pluginId: string) {
    // api.skipPlugins() 的插件
    if (this.skipPluginIds.has(pluginId)) return false;

    const { key, enableBy } = this.plugins[pluginId];

    // 手动设置为 false
    if (this.userConfig[key] === false) return false;

    // 配置开启
    if (enableBy === this.EnableBy.config && !(key in this.userConfig)) {
      return false;
    }

    // 函数自定义开启
    if (typeof enableBy === 'function') {
      return enableBy();
    }

    // 注册开启
    return true;
  }

  async applyPlugins(opts: {
    key: string;
    type: ApplyPluginsType;
    initialValue?: any;
    args?: any;
  }) {
    const hooks = this.hooks[opts.key] || [];
    switch (opts.type) {
      case ApplyPluginsType.add:
        if ('initialValue' in opts) {
          assert(
            Array.isArray(opts.initialValue),
            `applyPlugins failed, opts.initialValue must be Array if opts.type is add.`,
          );
        }
        const tAdd = new AsyncSeriesWaterfallHook(['memo']);
        for (const hook of hooks) {
          if (!this.isPluginEnable(hook.pluginId!)) {
            continue;
          }
          tAdd.tapPromise(
            {
              name: hook.pluginId!,
              stage: hook.stage || 0,
              // @ts-ignore
              before: hook.before,
            },
            async (memo: any[]) => {
              const items = await hook.fn(opts.args);
              return memo.concat(items);
            },
          );
        }
        return await tAdd.promise(opts.initialValue || []);
      case ApplyPluginsType.modify:
        const tModify = new AsyncSeriesWaterfallHook(['memo']);
        for (const hook of hooks) {
          if (!this.isPluginEnable(hook.pluginId!)) {
            continue;
          }
          tModify.tapPromise(
            {
              name: hook.pluginId!,
              stage: hook.stage || 0,
              // @ts-ignore
              before: hook.before,
            },
            async (memo: any) => {
              return await hook.fn(memo, opts.args);
            },
          );
        }
        return await tModify.promise(opts.initialValue);
      case ApplyPluginsType.event:
        const tEvent = new AsyncSeriesWaterfallHook(['_']);
        for (const hook of hooks) {
          if (!this.isPluginEnable(hook.pluginId!)) {
            continue;
          }
          tEvent.tapPromise(
            {
              name: hook.pluginId!,
              stage: hook.stage || 0,
              // @ts-ignore
              before: hook.before,
            },
            async () => {
              await hook.fn(opts.args);
            },
          );
        }
        return await tEvent.promise();
      default:
        throw new Error(
          `applyPlugin failed, type is not defined or is not matched, got ${opts.type}.`,
        );
    }
  }

  async init() {
    // 初始化插件
    this.initPlugins();

    // hooksByPluginId -> hooks
    // hooks is mapped with hook key, prepared for applyPlugins()
    this.setStage(ServiceStage.initHooks);
    Object.keys(this.hooksByPluginId).forEach(id => {
      const hooks = this.hooksByPluginId[id];
      hooks.forEach(hook => {
        const { key } = hook;
        hook.pluginId = id;
        this.hooks[key] = (this.hooks[key] || []).concat(hook);
      });
    });

    // plugin is totally ready
    this.setStage(ServiceStage.pluginReady);
    this.applyPlugins({
      key: 'onPluginReady',
      type: ApplyPluginsType.event,
    });

  }

  async run({ name, args = {} }: { name: string; args?: any }) {
    args._ = args._ || [];

    // shift the command itself
    args._.shift();
    this.args = args;
    this.setStage(ServiceStage.init);

    await this.init();

    this.setStage(ServiceStage.run);

    const command =
      typeof this.commands[name] === 'string'
        ? this.commands[this.commands[name] as string]
        : this.commands[name];

    assert(command, `run command failed, command ${name} does not exists.`);

    await this.applyPlugins({
      key: 'onStart',
      type: ApplyPluginsType.event,
    });

    const { fn } = command as Command;
    return fn({ args });
  }
}

export default Service;
