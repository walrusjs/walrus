import { IPluginPrettierOptions } from './plugin-prettier';
import { IPluginCommitLintOptions } from './plugin-commitlint';

export type IPluginOptions = {
  [key: string]: any
}

export type IPlugin<T = IPluginOptions> = string | [string, T];

interface IConfig {
  /**
   * 当前项目使用的框架
   * 默认: react
   */
  frame?: 'react' | 'vue' | 'angular' | '';
  /**
   * 是否使用typescript
   * 默认: true
   */
  useTypescript?: boolean;
  /**
   * 是否自动解析package.json中的插件
   * 默认: false
   */
  autoResolvePlugin?: boolean;
  /**
   * 插件集合 社区插件 或者 自定义插件
   * 默认: []
   */
  plugins?: IPlugin[];
  /**
   * prettier插件相关配置
   */
  pluginPrettier?: IPluginPrettierOptions;
  pluginCommitLint?: IPluginCommitLintOptions;
}

export default IConfig;
