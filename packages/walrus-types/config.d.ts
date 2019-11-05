// 插件配置
export interface PluginOptions {
  [key: string]: any;
}

// 指定目标环境
export type Target = 'node' | 'browser';

export type ResolvePlugin<T = PluginOptions> = string | [string, T];

/**
 * 插件类型定义
 * name应为插件包的名称，不带 `walrus-plugin-` 前缀。
 * 该值将用作其选项，传递true等效于一个空对象，false用于禁用内置插件。
 */
export interface Plugins<T = PluginOptions> {
  [name: string]: boolean | PluginOptions;
}

export interface Config {
  /**
   * 当前项目使用的框架
   * 默认: react
   */
  frame?: 'react' | 'vue' | 'angular';
  /**
   * 是否使用typescript
   * 默认: true
   */
  useTS?: boolean;
  /**
   * 目标环境
   * 默认: 'browser'
   */
  target?: Target;
  /**
   * 插件配置
   * 默认: {}
   */
  plugins?: Plugins;
  /**
   * 需要导入的插件
   */
  resolvePlugins?: ResolvePlugin[];
}
