import * as semver from 'semver';
import * as lodash from 'lodash';
const debug = require('debug');

export { isLinux, isMacintosh, isWindows } from './osUtils';
export { default as clearConsole } from './utils/clearConsole';
export { default as Logger } from './logger';
export { default as compatDirname } from './compatDirname';
export { default as PluginResolution } from './pluginResolution';
export { default as configLoader } from './configLoader';
export { default as checkNodeVersion } from './checkNodeVersion';
export { default as chalk } from 'chalk';
export { default as isUrl } from './isUrl';
export { default as winPath } from './winPath';
export {
  semver,
  lodash,
  debug
}