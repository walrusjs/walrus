export enum ServiceStage {
  uninitiialized,
  constructor,
  init,
  initPresets,
  initPlugins,
  initHooks,
  pluginReady,
  getConfig,
  getPaths,
  run,
}

export enum EnableBy {
  register = 'register',
  config = 'config',
}

export enum ApplyPluginsType {
  add = 'add',
  modify = 'modify',
  event = 'event',
}

export enum PluginType {
  preset = 'preset',
  plugin = 'plugin',
}
