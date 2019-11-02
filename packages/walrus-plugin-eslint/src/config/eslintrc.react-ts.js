module.exports = {
  extends: [
    '@walrus/eslint-config',
    '@walrus/eslint-config/react',
    '@walrus/eslint-config/typescript'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
