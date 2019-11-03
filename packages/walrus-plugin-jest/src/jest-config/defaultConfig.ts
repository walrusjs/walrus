const config = (resolve, rootDir) => {
  const defaultConfig = {
    rootDir: '',
    setupFiles: [
      resolve('shim.js'),
      resolve('setupJest.js')
    ],
    resolver: require.resolve('jest-pnp-resolver'),

    setupFilesAfterEnv: [resolve('setupFilesAfterEnv.js')],
    testEnvironment: 'jsdom',

    transform: {
      '\\.jsx?$': resolve('transformers/babelTransform.js'),
      '\\.tsx?$': require.resolve('ts-jest'),
      '^.+\\.css$': resolve('transformers/cssTransform.js'),
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': resolve('transformers/fileTransform.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss|less)$',
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    moduleNameMapper: {
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    testMatch: ['**/?*.(spec|test|e2e).(j|t)s?(x)'],
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
    verbose: true,
    testPathIgnorePatterns: ['/node_modules/']
  };

  if (rootDir) {
    defaultConfig.rootDir = rootDir;
  }

  return defaultConfig;
};

export default config;
