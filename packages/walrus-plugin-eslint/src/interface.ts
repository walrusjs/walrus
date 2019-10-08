export interface IRule {
  [key: string]: 'error' | 'warn' | 'off' | 0 | 1 | 2 | {

  }
}

export interface IEslintConfig {
  extends: string[];
  parserOptions: {
    ecmaVersion: number;
    sourceType: 'script' | 'module',
    ecmaFeatures: {
      jsx: boolean;

    }
  },
  plugins: string[];
  rules: {

  }
}
