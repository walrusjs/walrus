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
   * 插件集合 社区插件 或者 自定义插件
   * 默认: []
   */
  plugins?: IPlugin[];
}

export default IConfig;
