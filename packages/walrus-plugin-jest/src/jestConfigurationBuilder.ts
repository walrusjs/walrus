import { _ } from '@walrus/shared-utils';
import { DefaultConfigResolver } from './defaultConfig.resolver';
import { CustomConfigResolver } from './customConfig.resolver';

export class JestConfigurationBuilder {
  constructor(
    private defaultConfigResolver: DefaultConfigResolver,
    private customConfigResolver: CustomConfigResolver
  ) {}

  buildConfiguration(projectRoot: string, configPath: string = 'jest.config.js'): any {
    const globalDefaultConfig = this.defaultConfigResolver.resolveGlobal();
    const globalCustomConfig = this.customConfigResolver.resolveGlobal(projectRoot);

    return _.mergeWith(globalDefaultConfig, globalCustomConfig);
  }
}
