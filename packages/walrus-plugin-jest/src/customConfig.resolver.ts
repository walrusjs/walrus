import { join } from 'path';
import { existsSync } from 'fs';
import { getSystemPath, readPkg } from '@walrus/shared-utils';

export class CustomConfigResolver {
  constructor() {}

  resolveGlobal = (projectRoot: string) => {
    const packageJsonPath = getSystemPath(projectRoot);
    const packageJson = readPkg.sync({
      cwd: packageJsonPath
    });
    const workspaceJestConfigPath = getSystemPath(join(projectRoot, 'jest.config.js'));

    return (
      packageJson.jest ||
      (existsSync(workspaceJestConfigPath) && require(workspaceJestConfigPath)) ||
      {}
    );
  };
}
