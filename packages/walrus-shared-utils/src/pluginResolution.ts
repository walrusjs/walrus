const scopeRE = /^@[\w-]+(\.)?[\w-]+\//;

/**
 * 插件解析工具
 */
class PluginResolution {
  public namespace: string;
  public officialPlugins: string[];
  private readonly pluginRegExp: RegExp;

  constructor(namespace: string, officialPlugins: string[] = []) {
    this.namespace = namespace;
    this.officialPlugins = officialPlugins;
    this.pluginRegExp = new RegExp(`^(@${this.namespace}\\/|${this.namespace}-|@[\\w-]+(\\.)?[\\w-]+\\/${this.namespace}-)plugin-`);
  };

  /**
   * 判断是否是插件
   * 三种格式
   *  @{namespace}/plugin-* >> @walrus/plugin-eslint
   *  {namespace}-plugin-* >> walrus-plugin-eslint
   *  @{*}/walrus-plugin-* >> @bar/walrus-plugin-eslint
   * @param id
   */
  isPlugin = (id: string): boolean => {
    return this.pluginRegExp.test(id);
  };

  /**
   * 解析插件ID
   * @param id
   */
  resolvePluginId = (id: string): string => {
    // already full id
    // e.g. walrus-plugin-foo, @walrus/plugin-foo, @bar/walrus-plugin-foo
    if (this.pluginRegExp.test(id)) {
      return id;
    }

    // 如果是内置插件 则返回 @{namespace}/plugin-{id}
    if (this.officialPlugins.includes(id)) {
      return `@${this.namespace}/plugin-${id}`
    }

    // scoped short
    // e.g. @vue/foo, @bar/foo
    if (id.charAt(0) === '@') {
      const scopeMatch = id.match(scopeRE);
      if (scopeMatch) {
        const scope = scopeMatch[0];
        const shortId = id.replace(scopeRE, '');

        if (scope === `@${this.namespace}/`) {
          return  `${scope}-plugin-${shortId}`
        } else {
          return `${scope}${this.namespace}-plugin-${shortId}`
        }
      }
    }

    // default short
    // e.g. foo
    return `${this.namespace}-plugin-${id}`
  };

  /**
   * 插件ID是否匹配
   * @param input
   * @param full
   */
  matchesPluginId = (input, full) => {
    const short = full.replace(this.pluginRegExp, '');
    return (
      // input is full
      full === input ||
      // input is short without scope
      short === input ||
      // input is short with scope
      short === input.replace(scopeRE, '')
    )
  }
}

export default PluginResolution;
