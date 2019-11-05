import { lodash } from '@walrus/shared-utils';
import { PluginCommitLintOptions } from '@walrus/types';

const resolveFrom = require('resolve-from');
const resolveGlobal = require('resolve-global');

/**
 * 是否从历史中检查
 * @param opts
 */
export function checkFromHistory(opts: PluginCommitLintOptions) {
  return lodash.isString(opts.from) || lodash.isString(opts.to);
}

/**
 * 是否从编辑中检查
 * @param opts
 */
export function checkFromEdit(opts: PluginCommitLintOptions) {
  return Boolean(opts.edit) || opts.env;
}

/**
 * 是否从存储库中建议
 * @param opts
 */
export function checkFromRepository(opts: PluginCommitLintOptions) {
  return checkFromHistory(opts) || checkFromEdit(opts);
}

/**
 * 是否检查Stdin
 * @param input
 * @param opts
 */
export function checkFromStdin(input: string[], opts: PluginCommitLintOptions) {
  return input.length === 0 && !checkFromRepository(opts);
}

export function getSeed(seed) {
  const e = Array.isArray(seed.extends) ? seed.extends : [seed.extends];
  const n = e.filter(i => typeof i === 'string');
  return n.length > 0
    ? {extends: n, parserPreset: seed.parserPreset}
    : {parserPreset: seed.parserPreset};
}

export function selectParserOpts(parserPreset) {
  if (typeof parserPreset !== 'object') {
    return undefined;
  }

  if (typeof parserPreset.parserOpts !== 'object') {
    return undefined;
  }

  return parserPreset.parserOpts;
}

export function loadFormatter(config, flags) {
  const moduleName = flags.format || config.formatter || '@commitlint/format';
  const modulePath =
    resolveFrom.silent(__dirname, moduleName) ||
    resolveFrom.silent(flags.cwd, moduleName) ||
    resolveGlobal.silent(moduleName);

  if (modulePath) {
    const moduleInstance = require(modulePath);

    if (lodash.isFunction(moduleInstance.default)) {
      return moduleInstance.default;
    }

    return moduleInstance;
  }

  throw new Error(`Using format ${moduleName}, but cannot find the module.`);
}
