import pkgUp from 'pkg-up';
import { existsSync } from 'fs';
import camelcase from 'camelcase';
import assert from 'assert';
import { basename, dirname, extname, join, relative } from 'path';
import { compatESModuleRequire, createDebug, resolve, winPath } from '@birman/utils';
import { PluginType } from '../enums';
import { Package, Plugin } from '../types';

const debug = createDebug('walrus:core:service:plugin-utils');

interface Opts {
  pkg: Package;
  cwd: string;
}

/**
 *
 * @param type
 * @param name
 */
function isPluginOrPreset(type: PluginType, name: string) {
  const hasScope = name.charAt(0) === '@';
  const re = RE[type];
  if (hasScope) {
    return re.test(name.split('/')[1]) || re.test(name);
  } else {
    return re.test(name);
  }
}

/**
 *
 * @param type
 * @param opts
 */
function getPluginsOrPresets(type: PluginType, opts: Opts): string[] {
  const upperCaseType = type.toUpperCase();
  return [
    // opts
    ...((opts[type === PluginType.preset ? 'presets' : 'plugins'] as any) || []),
    // env
    ...(process.env[`BIRMAN_${upperCaseType}S`] || '').split(',').filter(Boolean),
    // dependencies
    ...Object.keys(opts.pkg.devDependencies || {})
      .concat(Object.keys(opts.pkg.dependencies || {}))
      .filter(isPluginOrPreset.bind(null, type)),
    // user config
    ...((opts[type === PluginType.preset ? 'userConfigPresets' : 'userConfigPlugins'] as any) || [])
  ].map((path) => {
    return resolve.sync(path, {
      basedir: opts.cwd,
      extensions: ['.js', '.ts']
    });
  });
}

// -------------

interface PathToObjOpts {
  type: PluginType;
  path: string;
  cwd: string;
}

const RE = {
  [PluginType.plugin]: /^(@birman\/|birman-)plugin-/,
  [PluginType.preset]: /^(@birman\/|birman-)preset-/
};

/**
 * 转换name为key(将以点分割的字符串转换为小驼峰)
 * @param name
 * @example
 *   nameToKey('initial-state') // >> initialState
 *   nameToKey('webpack.css-loader') // >> webpack.cssLoader
 */
function nameToKey(name: string) {
  return name
    .split('.')
    .map((part) => camelcase(part))
    .join('.');
}

/**
 * 转换包的名字为key
 * @param pkgName
 * @param type
 */
function pkgNameToKey(pkgName: string, type: PluginType) {
  if (pkgName.charAt(0) === '@' && !pkgName.startsWith('@birman/')) {
    pkgName = pkgName.split('/')[1];
  }
  return nameToKey(pkgName.replace(RE[type], ''));
}

/**
 * 解析路径为插件对象
 *
 * 插件的 id 规则
 *  * 插件的 id 规则
 *  * 文件级的插件，如果没有声明 id，默认为 name + 相对路径
 *  * 内置插件以 @@ 为前缀，比如 @@/registerMethod
 * @param options
 */
export function pathToObj({ type, path, cwd }: PathToObjOpts) {
  let pkg = null;
  let isPkgPlugin = false;

  assert(existsSync(path), `${type} ${path} not exists, pathToObj failed`);

  const pkgJSONPath = pkgUp.sync({ cwd: path });

  if (pkgJSONPath) {
    pkg = require(pkgJSONPath);
    isPkgPlugin = winPath(join(dirname(pkgJSONPath), pkg.main || 'index.js')) === winPath(path);
  }

  let id;
  if (isPkgPlugin) {
    id = pkg!.name;
  } else if (winPath(path).startsWith(winPath(cwd))) {
    id = `./${winPath(relative(cwd, path))}`;
  } else if (pkgJSONPath) {
    id = winPath(join(pkg!.name, relative(dirname(pkgJSONPath), path)));
  } else {
    id = winPath(path);
  }
  id = id.replace('@walrus/preset-internal/lib/plugins', '@@');
  id = id.replace(/\.js$/, '');

  const key = isPkgPlugin
    ? pkgNameToKey(pkg!.name, type)
    : nameToKey(basename(path, extname(path)));

  return {
    id,
    key,
    path: winPath(path),
    apply() {
      // use function to delay require
      try {
        const ret = require(path);
        // use the default member for es modules
        return compatESModuleRequire(ret);
      } catch (e) {
        throw new Error(`Register ${type} ${path} failed, since ${e.message}`);
      }
    },
    defaultConfig: null
  };
}

// ------------ resolvePlugins ------------

interface ResolvePluginsOpts extends Opts {
  plugins: string[];
  userConfigPlugins: string[];
}

/***
 *
 */
export function resolvePlugins(opts: ResolvePluginsOpts) {
  const type = PluginType.plugin;
  const plugins = getPluginsOrPresets(type, opts);
  debug(`plugin paths:`);
  debug(plugins);
  return plugins.map((path: string) => {
    return pathToObj({
      type,
      path,
      cwd: opts.cwd
    });
  });
}

// ------------ resolvePlugins ------------

interface ResolvePresetsOpts extends Opts {
  presets: string[];
  userConfigPresets: string[];
}

/**
 *
 * @param opts
 */
export function resolvePresets(opts: ResolvePresetsOpts) {
  const type = PluginType.preset;
  const presets = [...getPluginsOrPresets(type, opts)];
  debug(`preset paths:`);
  debug(presets);
  return presets.map((path: string) => {
    return pathToObj({
      type,
      path,
      cwd: opts.cwd
    });
  });
}

/**
 *
 * @param plugin
 */
export function isValidPlugin(plugin: Plugin) {
  return plugin.id && plugin.key && plugin.apply;
}
