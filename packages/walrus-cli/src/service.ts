import { chalk, configLoader } from '@walrus/shared-utils';

export interface IArgs {
  [key: string]: string
}

export interface ICommands {
  [name: string]: {
    opts: {
      usage: string;
      description: string;
      options: {
        [key: string]: string
      }
    };
    fn: (args: IArgs, rawArgs: string[]) => Promise<any>;
  }
}

class Service {
  private initialized: boolean;
  private context: string;
  public commands: ICommands;

  constructor(
    context: string
  ) {
    this.context = context;
    this.initialized = false;
    this.commands = {};
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
  }

  getUserConfig() {
    this.context = this.context || process.cwd();

    const userConfig = configLoader.loadSync([
      'walrus.config.js',
      'walrus.config.ts'
    ], this.context);

    console.log(userConfig.data);
  }
}

export default Service;
