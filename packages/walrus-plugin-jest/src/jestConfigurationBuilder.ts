import { lodash } from '@walrus/shared-utils';
import { DefaultConfigResolver } from './defaultConfig.resolver';
import { CustomConfigResolver } from './customConfig.resolver';

export class JestConfigurationBuilder {
  constructor(
    private defaultConfigResolver: DefaultConfigResolver,
    private customConfigResolver: CustomConfigResolver
  ) {}

  buildConfiguration(
    projectRoot: string,
    configPath: string = 'jest.config.js'
  ): any {

    const globalDefaultConfig = this.defaultConfigResolver.resolveGlobal();
    const projectDefaultConfig = this.defaultConfigResolver.resolveForProject();
    const globalCustomConfig = this.customConfigResolver.resolveGlobal(projectRoot);
    const projectCustomConfig = this.customConfigResolver.resolveForProject(projectRoot, configPath);

    return lodash.mergeWith(globalDefaultConfig, projectDefaultConfig, globalCustomConfig, projectCustomConfig);
  }
}
