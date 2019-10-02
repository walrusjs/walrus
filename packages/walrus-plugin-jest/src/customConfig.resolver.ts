import { join } from 'path';
import {
  Logger,
  getSystemPath,
  readPkg
} from '@walrus/shared-utils';
import {existsSync} from "fs";

export class CustomConfigResolver {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  resolveGlobal(projectRoot: string): any {
    const packageJsonPath = getSystemPath(projectRoot);
    const packageJson = readPkg.sync({
      cwd: packageJsonPath
    });
    const workspaceJestConfigPath = getSystemPath(join(projectRoot, 'jest.config.js'));

    return packageJson.jest || existsSync(workspaceJestConfigPath) && require(workspaceJestConfigPath) || {};
  }
}
