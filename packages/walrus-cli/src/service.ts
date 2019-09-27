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
import {
  ICommandOpts,
  ICommandFun,
  IRawArgs,
  IArgs
} from '@walrus/types';
import helpCommand from './commands/help';
import PluginAPI from './pluginAPI';
import { defaults } from './options';

export interface ICommands {
  [name: string]: {
    opts: ICommandOpts;
    fn: ICommandFun;
  }
}

const logger = new Logger();

function getInteriorPluginId(id) {
  return id.replace(/^.\//, 'built-in:')
}

/**
 * 解析walrus-cli的package.json
 */
function resolveWalrusCliPkg() {
  return readPkg.sync({
    cwd: join(__dirname, '..')
  })
}

function idToPlugin(id: string) {
  return {
    id: getInteriorPluginId(id),
    apply: require(id)
  }
}

class Service {
  private initialized: boolean;
  public context: string;
  public plugins: any[];
  public pkg: readPkg.PackageJson;
  public walrusCliPkg: readPkg.PackageJson;
  public projectOptions: any;
  private pluginResolution: PluginResolution;
  protected pluginsToSkip: Set<any>;
  public commands: ICommands;
  public modes: {
    [key: string]: string;
  };

  constructor(
    context: string,
    options?: {
      plugins?: any[];
      pkg?: readPkg.PackageJson;
      useBuiltIn?: boolean;
    }
  ) {
    const { plugins, pkg, useBuiltIn } = options || {};
    this.commands = {};
    this.context = context;
    this.pluginResolution = new PluginResolution();
    this.pkg = this.resolvePkg(pkg);
    this.walrusCliPkg = resolveWalrusCliPkg();
    this.initialized = false;
    this.plugins = this.resolvePlugins(plugins, useBuiltIn);
    this.modes = this.plugins.reduce((modes, { apply: { defaultModes }}) => {
      return Object.assign(modes, defaultModes)
    }, {});
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
      // 获取项目中安装的插件
      const projectPlugins = this.getPkgPlugin(this.pkg);
      plugins = builtInPlugins.concat(projectPlugins)
    }

    // 获取 walrus-cli 中安装的插件
    if (this.walrusCliPkg) {
      const walrusCliPlugins = this.getPkgPlugin(this.walrusCliPkg);
      plugins = builtInPlugins.concat(walrusCliPlugins)
    }

    return plugins;
  }

  private getPkgPlugin(pkg: readPkg.PackageJson) {
    return Object.keys(pkg.devDependencies || {})
      .concat(Object.keys(pkg.dependencies || {}))
      .filter(this.pluginResolution.isPlugin)
      .map(id => {
        if (pkg.optionalDependencies && id in pkg.optionalDependencies) {
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
  }

  /**
   * 解析package.json
   *
   * @param inlinePkg
   * @param context 当前工作目录
   * @return 返回解析后的Json对象
   */
  resolvePkg(inlinePkg?, context: string = this.context) {
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
      if (lodash.isFunction(apply)) {
        apply(new PluginAPI(id, this), this.projectOptions)
      } else {
        apply.default(new PluginAPI(id, this), this.projectOptions)
      }
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

    if (lodash.isFunction(fn)) {
      return fn(args, rawArgv);
    }
    if (lodash.isObject(fn)) {
      // @ts-ignore
      return fn.default(args, rawArgv);
    }
  }
}

export default Service;