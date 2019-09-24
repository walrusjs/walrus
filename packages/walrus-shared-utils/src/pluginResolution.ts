const scopeRE = /^@[\w-]+(\.)?[\w-]+\//;

class PluginResolution {
  private readonly namespace: string;
  private officialPlugins: string[];
  private pluginRegExp: RegExp;

  constructor(namespace?: string) {
    this.namespace = namespace || 'walrus';
    this.officialPlugins = [
      'eslint'
    ];
    this.pluginRegExp = new RegExp(`^(@${this.namespace}\\/|${this.namespace}-|@[\\w-]+(\\.)?[\\w-]+\\/${this.namespace}-)plugin-`);
  };

  /**
   * 判断是否是插件
   * @param id
   */
  isPlugin = (id: string): boolean => {
    return this.pluginRegExp.test(id);
  };

  resolvePluginId = (id: string): string => {
    // already full id
    // e.g. walrus-plugin-foo, @walrus/plugin-foo, @bar/walrus-plugin-foo
    if (this.pluginRegExp.test(id)) {
      return id;
    }

    if (this.officialPlugins.includes(id)) {
      return `@walrus/plugin-${id}`
    }

    // scoped short
    // e.g. @vue/foo, @bar/foo
    if (id.charAt(0) === '@') {
      const scopeMatch = id.match(scopeRE);
      if (scopeMatch) {
        const scope = scopeMatch[0];
        const shortId = id.replace(scopeRE, '');
        return `${scope}${scope === '@walrus/' ? `` : `walrus-`}-plugin-${shortId}`
      }
    }

    // default short
    // e.g. foo
    return `walrus-plugin-${id}`
  }
}

export default PluginResolution;
