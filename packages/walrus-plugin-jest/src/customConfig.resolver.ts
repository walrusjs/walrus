import { join } from 'path';
import { existsSync } from 'fs';
import {
  Logger,
  getSystemPath,
  readPkg
} from '@walrus/shared-utils';

export class CustomConfigResolver {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  resolveGlobal = (projectRoot: string) => {
    const packageJsonPath = getSystemPath(projectRoot);
    const packageJson = readPkg.sync({
      cwd: packageJsonPath
    });
    const workspaceJestConfigPath = getSystemPath(join(projectRoot, 'jest.config.js'));

    return packageJson.jest || existsSync(workspaceJestConfigPath) && require(workspaceJestConfigPath) || {};
  }
}
