import { PluginApi, Service } from '@walrus/core';


export interface Api extends PluginApi {
  cwd: typeof Service.prototype.cwd;
  pkg: typeof Service.prototype.pkg;

}
