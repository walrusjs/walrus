import PluginResolution from './plugin-resolution';

let pluginResolution = null;

beforeEach(() => {
  pluginResolution = new PluginResolution('walrus', ['eslint', 'jest']);
});

describe('PluginResolution', () => {
  it('namespace', () => {
    expect(pluginResolution.namespace).toEqual('walrus');
  });

  it('officialPlugins', () => {
    expect(pluginResolution.officialPlugins).toEqual(['eslint', 'jest']);
  });

  describe('isPlugin', () => {
    it('官方插件', () => {
      expect(pluginResolution.isPlugin('@walrus/plugin-jest')).toEqual(true);
      expect(pluginResolution.isPlugin('@walrus/plugin-eslint')).toEqual(true);
      expect(pluginResolution.isPlugin('@walrus/plugin-stylelint')).toEqual(true);
      expect(pluginResolution.isPlugin('@walrus-plus/plugin-jest')).toEqual(false);
    });

    it('社区插件', () => {
      expect(pluginResolution.isPlugin('walrus-plugin-jest')).toEqual(true);
      expect(pluginResolution.isPlugin('walrus-plus-plugin-jest')).toEqual(false);
    });
  });
});
