import debug from 'debug';
import * as assert from 'assert';
import * as signale from 'signale';
import * as mustache from 'mustache';

class Plugin {
  public debug: debug.Debugger;
  public log: typeof signale;
  public mustache: typeof mustache;

  constructor(
    id: string
  ) {
    this.debug = debug(`walrus-plugin: ${id}`);
    this.log = signale;
    this.mustache = mustache;
  }

  registerCommand = () => {
    this.log.info('test');
  }
}

export default Plugin;
