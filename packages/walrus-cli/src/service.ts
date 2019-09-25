import { existsSync } from 'fs';
import { join } from 'path';
import * as readPkg from 'read-pkg';
import {
  configLoader,
  PluginResolution,
  Logger,
  debug,
  lodash
} from '@walrus/shared-utils';
import helpCommand from './commands/help';
import PluginAPI from './pluginAPI';
import { defaults } from './options';

export interface IArgs {
  [key: string]: any;
}

export type IRawArgs = string[];

export interface ICommands {
  [name: string]: {
    opts: {
      usage: string;
      description: string;
      options: {
        [key: string]: string
      }
    };
    fn: (args: IArgs, rawArgs: IRawArgs) => Promise<any>;
  }
}

const logger = new Logger();

function getInteriorPluginId(id) {
  return id.replace(/^.\//, 'built-in:')
}

class Service {
  private initialized: boolean;
  public context: string;
  public plugins: any[];
  public pkg: readPkg.PackageJson;
  public projectOptions: any;
  private pluginResolution: PluginResolution;
  protected pluginsToSkip: Set<any>;
  public commands: ICommands;

  constructor(
    context: string,
    options?: {
      plugins?: any[];
      pkg?: readPkg.PackageJson;
      useBuiltIn?: boolean;
    }
  ) {
    const { plugins = [], pkg, useBuiltIn = false } = options;
    this.pkg = this.resolvePkg(pkg);
    this.context = context;
    this.initialized = false;
    this.pluginResolution = new PluginResolution();
    this.commands = {};
  }

  /**
   * 获取用户配置
   */
  loadUserOptions() {
    this.context = this.context || process.cwd();

    const userConfig = configLoader.loadSync([
      'walrus.config.js',
      'walrus.config.ts'
    ], this.context);

    return userConfig.data || {};
  }

  /**
   * 设置需要跳过的插件
   * @param args
   */
  setPluginsToSkip(args: IArgs) {
    const skipPlugins = args['skip-plugins'];

    this.pluginsToSkip = skipPlugins
      ? new Set(skipPlugins.split(',').map((id) => {
        return this.pluginResolution.resolvePluginId(id);
      }))
      : new Set();
  }

  /**
   * 解析插件
   * @param inlinePlugins
   * @param useBuiltIn
   */
  resolvePlugins(inlinePlugins, useBuiltIn) {
    const idToPlugin = (id) => ({
      id: getInteriorPluginId(id),
      apply: require(id)
    });

    let plugins;

    const builtInPlugins = [
      {
        id: getInteriorPluginId('./commands/help'),
        apply: helpCommand
      }
    ];

    if (inlinePlugins) {
      plugins = useBuiltIn
        ? builtInPlugins.concat(inlinePlugins)
        : inlinePlugins
    } else {
      const projectPlugins = Object.keys(this.pkg.devDependencies || {})
        .concat(Object.keys(this.pkg.dependencies || {}))
        .filter(this.pluginResolution.isPlugin)
        .map(id => {
          if (
            this.pkg.optionalDependencies &&
            id in this.pkg.optionalDependencies
          ) {
            let apply = () => {};
            try {
              apply = require(id)
            } catch (e) {
              logger.warn(`Optional dependency ${id} is not installed.`)
            }

            return { id, apply }
          } else {
            return idToPlugin(id)
          }
        });
      plugins = builtInPlugins.concat(projectPlugins)
    }

    return plugins;
  }

  /**
   * 解析package.json
   *
   * @param inlinePkg
   * @param context 当前工作目录
   * @return 返回解析后的Json对象
   */
  resolvePkg(inlinePkg, context: string = this.context): readPkg.PackageJson {
    if (inlinePkg) {
      return inlinePkg;
    }
    else if (existsSync(join(context, 'package.json'))) {
      return readPkg.sync({ cwd: context })
    }
    else {
      return {}
    }
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    const userOptions = this.loadUserOptions();
    this.projectOptions = lodash.defaultsDeep(userOptions, defaults());

    debug('walrus:project-config')(this.projectOptions);

    // apply plugins.
    this.plugins.forEach(({ id, apply }) => {
      if (this.pluginsToSkip.has(id)) return;
      apply(new PluginAPI(id, this), this.projectOptions)
    })
  }

  async run (
    name: string,
    args: IArgs = {},
    rawArgv: IRawArgs = []
  ) {
    this.setPluginsToSkip(args);

    this.init();

    args._ = args._ || [];
    let command = this.commands[name];

    if (!command && name) {
      logger.error(`command "${name}" does not exist.`);
      process.exit(1)
    }

    if (!command || args.help || args.h) {
      command = this.commands.help
    } else {
      args._.shift(); // remove command itself
      rawArgv.shift()
    }

    const { fn } = command;
    return fn(args, rawArgv);
  }
}

export default Service;
