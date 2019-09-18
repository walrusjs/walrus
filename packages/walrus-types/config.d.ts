export type IPluginOptions = {
  [key: string]: any
}

export type IPlugin<T = IPluginOptions> = string | [string, T];

interface IConfig {
  plugins?: IPlugin[];
}

export default IConfig;
