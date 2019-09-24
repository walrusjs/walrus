import { configLoader, PluginResolution, Logger } from '@walrus/shared-utils';

export interface IArgs {
  [key: string]: any;
}

export type IRawArgs = string[];

export interface ICommands {
  [name: string]: {
    opts: {
      usage: string;
      description: string;
      options: {
        [key: string]: string
      }
    };
    fn: (args: IArgs, rawArgs: IRawArgs) => Promise<any>;
  }
}

const logger = new Logger();

class Service {
  private initialized: boolean;
  private context: string;
  private pluginResolution: PluginResolution;
  protected pluginsToSkip: Set<any>;
  public commands: ICommands;

  constructor(
    context: string
  ) {
    this.context = context;
    this.initialized = false;
    this.pluginResolution = new PluginResolution();
    this.commands = {};
  }

  getUserConfig() {
    this.context = this.context || process.cwd();

    const userConfig = configLoader.loadSync([
      'walrus.config.js',
      'walrus.config.ts'
    ], this.context);
  }

  /**
   * 设置需要跳过的插件
   * @param args
   */
  setPluginsToSkip(args: IArgs) {
    const skipPlugins = args['skip-plugins'];

    this.pluginsToSkip = skipPlugins
      ? new Set(skipPlugins.split(',').map((id) => {
        return this.pluginResolution.resolvePluginId(id);
      }))
      : new Set();
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
  }

  async run (
    name: string,
    args: IArgs = {},
    rawArgv: IRawArgs = []
  ) {
    this.setPluginsToSkip(args);

    this.init();

    args._ = args._ || [];
    let command = this.commands[name];

    if (!command && name) {
      logger.error(`command "${name}" does not exist.`);
      process.exit(1)
    }

    if (!command || args.help || args.h) {
      command = this.commands.help
    } else {
      args._.shift(); // remove command itself
      rawArgv.shift()
    }

    const { fn } = command;
    return fn(args, rawArgv);
  }
}

export default Service;
