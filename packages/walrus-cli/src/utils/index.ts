function getInteriorPluginId(id) {
  return id.replace(/^.\//, 'built-in:');
}

/**
 * 将ID转换为插件
 * @param id
 */
export function idToPlugin(id: string) {
  return {
    id: getInteriorPluginId(id),
    apply: require(id)
  };
}
