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

  resolveForProject(projectRoot: string, configPath: string) {
    const jestConfigPath = getSystemPath(join(projectRoot, configPath));
    if (!existsSync(jestConfigPath)) {
      this.logger.warn(`warning: unable to locate custom jest configuration file at path "${jestConfigPath}"`);
      return {};
    }
    return require(jestConfigPath);
  }
}
