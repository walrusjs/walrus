export default {
  mode: 'site',
  title: 'Walrus',
  locales: [['zh-CN', '中文']],
  // favicon: '.assets/logo.png',
  // logo: '.assets/logo.png',
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/walrusjs',
    },
  ],
  resolve: {
    includes: ['./docs'],
    previewLangs: [],
  }
};
