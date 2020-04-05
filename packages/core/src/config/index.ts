import { existsSync } from 'fs';
import { extname, join } from 'path';
import {
  chalk,
  chokidar,
  compatESModuleRequire,
  deepmerge,
  lodash,
  parseRequireDeps,
  winPath,
  createDebug
} from '@walrus/utils';
import assert from 'assert';
import joi from '@hapi/joi';
import Service from '../service';
import { ServiceStage } from '../service/enums';
import {
  isEqual,
  mergeDefault,
  getUserConfigWithKey,
  updateUserConfigWithKey
} from './utils';

const debug = createDebug('walrus:core:config');

interface Changed {
  key: string;
  pluginId: string;
}

interface Opts {
  cwd: string;
  service: Service;
  localConfig?: boolean;
}

const CONFIG_FILES = ['.walrusrc.ts', '.walrusrc.js', 'walrus.config.ts', 'walrus.config.js'];

class Config {
  cwd: string;
  service: Service;
  config?: object;
  localConfig?: boolean;
  configFile?: string | null;

  constructor(opts: Opts) {
    this.cwd = opts.cwd || process.cwd();
    this.service = opts.service;
    this.localConfig = opts.localConfig;
  }

  async getDefaultConfig() {
    const pluginIds = Object.keys(this.service.plugins);

    // collect default config
    let defaultConfig = pluginIds.reduce((memo, pluginId) => {
      const { key, config = {} } = this.service.plugins[pluginId];
      if ('default' in config) memo[key] = config.default;
      return memo;
    }, {});

    return defaultConfig;
  }

  getConfig({ defaultConfig }: { defaultConfig: object }) {
    assert(
      this.service.stage >= ServiceStage.pluginReady,
      `Config.getConfig() failed, it should not be executed before plugin is ready.`
    );
    const userConfig = this.getUserConfig();

    // 用于提示用户哪些 key 是未定义的
    // TODO: 考虑不排除 false 的 key
    const userConfigKeys = Object.keys(userConfig).filter((key) => {
      return userConfig[key] !== false;
    });

    // get config
    const pluginIds = Object.keys(this.service.plugins);

    pluginIds.forEach((pluginId) => {
      const { key, config = {} } = this.service.plugins[pluginId];
      // recognize as key if have schema config
      if (!config.schema) return;
      const value = getUserConfigWithKey({ key, userConfig });

      // 不校验 false 的值，此时已禁用插件
      if (value === false) return;

      // do validate
      const schema = config.schema(joi);

      assert(joi.isSchema(schema), `schema return from plugin ${pluginId} is not valid schema.`);

      const { error } = schema.validate(value);
      if (error) {
        const e = new Error(`Validate config "${key}" failed, ${error.message}`);
        e.stack = error.stack;
        throw e;
      }

      // remove key
      const index = userConfigKeys.indexOf(key.split('.')[0]);
      if (index !== -1) {
        userConfigKeys.splice(index, 1);
      }

      // update userConfig with defaultConfig
      if (key in defaultConfig) {
        const newValue = mergeDefault({
          defaultConfig: defaultConfig[key],
          config: value
        });
        updateUserConfigWithKey({
          key,
          value: newValue,
          userConfig
        });
      }
    });

    if (userConfigKeys.length) {
      const keys = userConfigKeys.length > 1 ? 'keys' : 'key';
      throw new Error(`Invalid config ${keys}: ${userConfigKeys.join(', ')}`);
    }

    return userConfig;
  }

  getUserConfig() {
    const configFile = this.getConfigFile();
    this.configFile = configFile;

    if (configFile) {
      let envConfigFile;
      if (process.env.BIRMAN_ENV) {
        envConfigFile = this.addAffix(configFile, process.env.BIRMAN_ENV);
        if (!existsSync(join(this.cwd, envConfigFile))) {
          throw new Error(
            `get user config failed, ${envConfigFile} does not exist, but process.env.BIRMAN_ENV is set to ${process.env.BIRMAN_ENV}.`
          );
        }
      }

      const files = [
        configFile,
        envConfigFile,
        this.localConfig && this.addAffix(configFile, 'local')
      ]
        .filter((f): f is string => !!f)
        .map((f) => join(this.cwd, f))
        .filter((f) => existsSync(f));

      // clear require cache and set babel register
      const requireDeps = files.reduce((memo: string[], file) => {
        memo = memo.concat(parseRequireDeps(file));
        return memo;
      }, []);
      requireDeps.forEach((f) => {
        // TODO: potential windows path problem?
        if (require.cache[f]) {
          delete require.cache[f];
        }
      });
      this.service.babelRegister.setOnlyMap({
        key: 'config',
        value: requireDeps
      });

      // require config and merge
      return this.mergeConfig(...this.requireConfigs(files));
    } else {
      return {};
    }
  }

  getConfigFile(): string | null {
    // TODO: support custom config file
    const configFile = CONFIG_FILES.find((f) => existsSync(join(this.cwd, f)));
    return configFile ? winPath(configFile) : null;
  }

  addAffix(file: string, affix: string) {
    const ext = extname(file);
    return file.replace(new RegExp(`${ext}$`), `.${affix}${ext}`);
  }

  mergeConfig(...configs: object[]) {
    let ret = {};
    for (const config of configs) {
      // TODO: 精细化处理，比如处理 dotted config key
      ret = deepmerge(ret, config);
    }
    return ret;
  }

  requireConfigs(configFiles: string[]) {
    return configFiles.map((f) => compatESModuleRequire(require(f)));
  }

  getWatchFilesAndDirectories() {
    const birmanEnv = process.env.BIRMAN_ENV;
    const configFiles = lodash.clone(CONFIG_FILES);
    CONFIG_FILES.forEach((f) => {
      if (this.localConfig) configFiles.push(this.addAffix(f, 'local'));
      if (birmanEnv) configFiles.push(this.addAffix(f, birmanEnv));
    });

    const configDir = winPath(join(this.cwd, 'config'));

    const files = configFiles
      .reduce<string[]>((memo, f) => {
        const file = winPath(join(this.cwd, f));
        if (existsSync(file)) {
          memo = memo.concat(parseRequireDeps(file));
        } else {
          memo.push(file);
        }
        return memo;
      }, [])
      .filter((f) => !f.startsWith(configDir));

    return [configDir].concat(files);
  }

  watch(opts: {
    userConfig: object;
    onChange: (args: {
      userConfig: any;
      pluginChanged: Changed[];
      valueChanged: Changed[];
    }) => void;
  }) {
    let paths = this.getWatchFilesAndDirectories();
    let userConfig = opts.userConfig;

    const watcher = chokidar.watch(paths, {
      ignoreInitial: true,
      cwd: this.cwd
    });

    watcher.on('all', (event, path) => {
      console.log(chalk.green(`[${event}] ${path}`));
      const newPaths = this.getWatchFilesAndDirectories();
      const diffs = lodash.difference(newPaths, paths);
      if (diffs.length) {
        watcher.add(diffs);
        paths = paths.concat(diffs);
      }

      const newUserConfig = this.getUserConfig();
      const pluginChanged: Changed[] = [];
      const valueChanged: Changed[] = [];

      Object.keys(this.service.plugins).forEach((pluginId) => {
        const { key, config = {} } = this.service.plugins[pluginId];
        // recognize as key if have schema config
        if (!config.schema) return;
        if (!isEqual(newUserConfig[key], userConfig[key])) {
          const changed = {
            key,
            pluginId: pluginId
          };
          if (newUserConfig[key] === false || userConfig[key] === false) {
            pluginChanged.push(changed);
          } else {
            valueChanged.push(changed);
          }
        }
      });

      debug(`newUserConfig: ${JSON.stringify(newUserConfig)}`);
      debug(`oldUserConfig: ${JSON.stringify(userConfig)}`);
      debug(`pluginChanged: ${JSON.stringify(pluginChanged)}`);
      debug(`valueChanged: ${JSON.stringify(valueChanged)}`);

      if (pluginChanged.length || valueChanged.length) {
        opts.onChange({
          userConfig: newUserConfig,
          pluginChanged,
          valueChanged
        });
      }
      userConfig = newUserConfig;
    });

    return () => {
      watcher.close();
    };
  }
}

export default Config;
