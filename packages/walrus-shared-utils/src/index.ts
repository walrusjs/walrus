const debug = require('debug');
const minimist = require('minimist');

export { default as compatDirname } from './compat-dirname';
// 记录日志 - 不推荐使用 下个大版本会删除
export { default as Logger } from './logger';
// 日志记录器
export { default as signale } from './signale';
export * from './signale';
// 导出lodash
export { default as _ } from './lodash';
// npm的语义版本控制程序
export { default as semver } from './semver';
// 判断是否是Url
export { default as isUrl } from './is-url';
// 终端字符串样式
export { default as chalk } from 'chalk';
// 终端字符串样式
export { default as readPkg } from './read-pkg';
// 清空控制台
export { default as clearConsole } from './clear-console';
// 获取系统路径，主要解决windows/linux路径规则不一致的问题
export { default as getSystemPath } from './utils/get-system-path';
// 判断操作系统类型
export { isLinux, isMacintosh, isWindows } from './os-utils';
// 配置获取工具
export { default as configLoader } from './config-loader';
export { default as winPath } from './win-path';
// 插件解析工具
export { default as PluginResolution } from './plugin-resolution';
// 检查Node版本
export { default as checkNodeVersion } from './check-node-version';

export { debug, minimist };
