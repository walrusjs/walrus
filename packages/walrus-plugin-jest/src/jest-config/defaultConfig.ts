const config = (resolve, rootDir) => {
  const defaultConfig = {
    rootDir: '',
    roots: ['<rootDir>/src'],
    setupFiles: [resolve('setupJest.js')],
    browser: true,

    testPathIgnorePatterns: ['<rootDir>/node_modules/'],

    setupFilesAfterEnv: [resolve('setupFilesAfterEnv.js')],
    testEnvironment: 'jsdom',

    transform: {
      '^.+\\.(t|j)sx$': resolve('transformers/babelTransform.js'),
      '^.+\\.css$': resolve('transformers/cssTransform.js'),
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': resolve('transformers/fileTransform.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
    verbose: true,
  };

  if (rootDir) {
    defaultConfig.rootDir = rootDir;
  }

  return defaultConfig;
};

export default config;
