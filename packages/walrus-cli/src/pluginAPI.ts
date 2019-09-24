import { semver } from '@walrus/shared-utils';

class PluginAPI {
  private id: string;
  private service: any;

  constructor (
    id: string,
    service
  ) {
    this.id = id;
    this.service = service
  }
}

export default PluginAPI;
