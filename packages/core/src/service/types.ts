import joi from '@hapi/joi';
import { yargs } from '@walrus/utils';
import { EnableBy } from './enums';

export interface PluginConfig {
  default?: any;
  schema?: {
    (joi: joi.Root): joi.Schema;
  };
  onChange?: string | Function;
}

export interface Dep {
  [name: string]: string;
}

export interface Package {
  name?: string;
  dependencies?: Dep;
  devDependencies?: Dep;
  [key: string]: any;
}

export interface Plugin {
  id: string;
  // Currently only used for config
  key: string;
  path: string;
  apply: Function;

  config?: PluginConfig;
  isPreset?: boolean;
  enableBy?: EnableBy | Function;
}

export interface Preset extends Plugin {}

export interface Hook {
  key: string;
  fn: Function;
  pluginId?: string;
  before?: string;
  stage?: number;
}

export interface Command {
  name: string;
  alias?: string;
  description?: string;
  options?: {
    [key: string]: string;
  }
  details?: string;
  fn: {
    ({ args }: { args: yargs.Arguments }): void;
  };
}
