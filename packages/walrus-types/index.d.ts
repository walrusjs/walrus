import IConfig, { IPlugin } from './config';

export { IConfig, IPlugin };

export interface IPackage {
  name?: string;
  version?: string;
  dependencies?: {
    [prop: string]: string;
  };
  devDependencies?: {
    [prop: string]: string;
  };
}

export interface IApi {
  package: IPackage
}
