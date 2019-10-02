import resolve from './utils/resolve';
import createJestConfig from './jest-config/defaultConfig';

const rootDir = process.cwd();

export class DefaultConfigResolver {
  resolveGlobal(): any {
    return createJestConfig(resolve, rootDir);
  }
}
