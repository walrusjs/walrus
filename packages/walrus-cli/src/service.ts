import { existsSync } from 'fs';
import { join } from 'path';
import {
  _,
  debug,
  readPkg,
  configLoader,
  PluginResolution,
} from '@walrus/shared-utils';
import { CommandOpts, CommandFun, RawArgs, Config, Args } from '@walrus/types';
import helpCommand from './commands/help';
import custom from './custom';
import PluginAPI, { PluginConfig } from './pluginAPI';
import { DEFAULT_CONFIG_FILENAMES } from './config';

export interface Commands {
  [name: string]: {
    fn: CommandFun;
    opts: CommandOpts;
    config: PluginConfig;
  };
}

export type ApplyFun = (pluginAPI: PluginAPI, config: Config) => void;

export interface Plugin {
  id: string;
  apply: {
    default?: ApplyFun;
    defaultModes?: {
      [key: string]: string;
    };
  };
  opts?: {
    [key: string]: any;
  };
}

const merge = _.merge;
const resolveFrom = require('resolve-from');

function getInteriorPluginId(id) {
  return id.replace(/^.\//, 'built-in:');
}

/**
 * 解析walrus-cli的package.json
 */
function resolveWalrusCliPkg() {
  return readPkg.sync({
    cwd: join(__dirname, '..')
  });
}

class Service {
  private initialized: boolean;
  public context: string;
  public config: Config;
  public plugins: Plugin[];
  public pkg: readPkg.PackageJson;
  public walrusCliPkg: readPkg.PackageJson;
  private pluginResolution: PluginResolution;
  // 所有的命令
  public commands: Commands;
  public modes: {
    [key: string]: string;
  };

  constructor(context: string = process.cwd(), config?: Config) {
    this.commands = {};
    this.context = context;
    this.pluginResolution = new PluginResolution('walrus');
    this.pkg = this.resolvePkg();
    this.config = this.normalizeConfig(config || {});
    this.walrusCliPkg = resolveWalrusCliPkg();
    this.initialized = false;
  }

  /**
   * 获取用户配置
   */
  loadUserOptions(): Config {
    this.context = this.context || process.cwd();
    // 根据配置依次读取配置文件
    const userConfig = configLoader.loadSync(DEFAULT_CONFIG_FILENAMES, this.context);

    return userConfig.data || {};
  }

  normalizeConfig = (config: Config): Config => {
    const userConfig = this.loadUserOptions();

    const result = merge({}, userConfig, config, {
      frame: config.frame || userConfig.frame || 'react',
      useTS: config.useTS || userConfig.useTS || true,
      target: config.target || userConfig.target || 'browser'
    });

    result.plugins = result.plugins || {};

    return result;
  };

  /**
   * 解析插件
   */
  async resolvePlugins() {
    const pluginsOptions: { [key: string]: any } = {
      eslint: this.config.plugins.eslint !== false && merge({}, this.config.plugins.eslint),

      commitlint:
        this.config.plugins.commitlint !== false && merge({}, this.config.plugins.commitlint),

      jest: this.config.plugins.jest !== false && merge({}, this.config.plugins.jest),

      prettier: this.config.plugins.jest !== false && merge({}, this.config.plugins.prettier),

      stylelint: this.config.plugins.stylelint !== false && merge({}, this.config.plugins.stylelint)
    };

    // 内置插件
    const builtInPlugins = [
      {
        id: getInteriorPluginId('./commands/help'),
        apply: helpCommand
      }
    ];

    for (const name of Object.keys(this.config.plugins)) {
      if (pluginsOptions[name] === undefined) {
        Object.assign(pluginsOptions, { [name]: this.config.plugins[name] });
      }
    }

    const plugins = await Promise.all(
      Object.keys(pluginsOptions)
        .filter((name) => pluginsOptions[name])
        .map(async (name) => {
          let plugin = await this.getPlugin(name);
          if (!plugin) return null;

          if (!plugin.default) {
            plugin = {
              default: plugin
            };
          }

          return {
            id: this.pluginResolution.resolvePluginId(name),
            apply: plugin,
            opts: pluginsOptions[name] || {}
          };
        })
    );

    // 需要导入的插件
    if (_.isArray(this.config.resolvePlugins)) {
      this.config.resolvePlugins.forEach((item) => {
        if (_.isString(item)) {
          plugins.push({
            id: getInteriorPluginId(_.uniqueId('plugin')),
            apply: require(item),
            opts: {}
          });
        }
        if (_.isArray(item)) {
          plugins.push({
            id: getInteriorPluginId(_.uniqueId('plugin')),
            apply: require(item[0]),
            opts: item[1] || {}
          });
        }
      });
    }

    return builtInPlugins.concat(plugins).filter((_) => _);
  }

  getPlugin = (name: string) => {
    // 是否是@walrus/plugin-*形式的内置包
    const isOfficialBuiltIn = require('../package').dependencies[`@walrus/plugin-${name}`];
    // 是否是walrus-plugin-*形式的内置包
    const isBuiltIn = require('../package').dependencies[`walrus-plugin-${name}`];

    let plugin = null;

    // 内置插件
    if (isOfficialBuiltIn) {
      return require(`@walrus/plugin-${name}`);
    }

    if (isBuiltIn) {
      return require(`walrus-plugin-${name}`);
    }

    // 用户安装官方插件
    if (
      (this.pkg.dependencies && this.pkg.dependencies[`@walrus/plugin-${name}`]) ||
      (this.pkg.devDependencies && this.pkg.devDependencies[`@walrus/plugin-${name}`])
    ) {
      return require(`@walrus/plugin-${name}`);
    }

    if (!plugin) {
      plugin = this.localRequire(`walrus-plugin-${name}`);
    }

    if (!plugin && name.charAt(0) === '@') {
      plugin = this.localRequire(name);
    }

    if (plugin) {
      return plugin;
    } else {
      custom.warn(`Optional dependency ${name} is not installed.`);
      return null;
    }
  };

  localRequire(name: string, { silent, cwd }: { silent?: boolean; cwd?: string } = {}) {
    cwd = cwd || this.context;
    const resolved = silent ? resolveFrom.silent(cwd, name) : resolveFrom(cwd, name);
    return resolved && require(resolved);
  }

  /**
   * 解析package.json
   *
   * @param context 当前工作目录
   * @return 返回解析后的Json对象
   */
  resolvePkg(context: string = this.context) {
    if (existsSync(join(context, 'package.json'))) {
      return readPkg.sync({ cwd: context });
    } else {
      return {};
    }
  }

  async init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.plugins = (await this.resolvePlugins()) as any;
    this.modes = this.plugins.reduce((modes, { apply: { defaultModes } }) => {
      return Object.assign(modes, defaultModes);
    }, {});

    debug('walrus:project-config')(this.config);

    // apply plugins.
    this.plugins.forEach(({ id, apply, opts }) => {
      if (_.isFunction(apply)) {
        apply(new PluginAPI(id, this, opts), this.config);
      } else {
        apply.default(new PluginAPI(id, this, opts), this.config);
      }
    });
  }

  async run(name: string, args: Args = {}, rawArgv: RawArgs = []) {
    await this.init();

    args._ = args._ || [];
    let command = this.commands[name];

    if (!command && name) {
      custom.error(`command "${name}" does not exist.`);
      process.exit(1);
    }

    if (!command || args.help || args.h) {
      command = this.commands.help;
    } else {
      args._.shift(); // remove command itself
      rawArgv.shift();
    }

    const { fn, config } = command;

    if (_.isFunction(fn)) {
      return fn(args, rawArgv, config);
    }
    if (_.isObject(fn)) {
      // @ts-ignore
      return fn.default(args, rawArgv, config);
    }
  }
}

// @ts-ignore
export default Service;
