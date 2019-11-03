import resolve from './utils/resolve';
import createJestConfig from './jest-config/defaultConfig';

const rootDir = process.cwd();

export class DefaultConfigResolver {
  private readonly rootDir: string;

  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  resolveGlobal = ()=> {
    return createJestConfig(resolve, this.rootDir);
  }
}
