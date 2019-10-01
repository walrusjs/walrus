import resolve from './utils/resolve';
import createJestConfig from './jest-config/defaultConfig';

export const testPattern = `/**/+(*.)+(spec|test|e2e).+(t|j)s?(x)`;
export const tsConfigName = 'tsconfig.spec.json';

const rootDir = process.cwd();

export class DefaultConfigResolver {
  // 获取默认全局配置
  resolveGlobal(): any {
    return createJestConfig(resolve, rootDir);
  }

  resolveForProject(): any {
    return {};
  }
}
