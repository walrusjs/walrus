import { dirname } from 'path';
import { Service as CoreService, ServiceOpts } from '@walrus/core';

class Service extends CoreService {
  constructor(opts: ServiceOpts) {
    process.env.WALRUS_VERSION = require('../package').version;
    process.env.WALRUS_DIR = dirname(require.resolve('../package'));

    super({
      ...opts,
      presets: [
        require.resolve('@walrus/preset-internal'),
        ...(opts.presets || []),
      ],
      plugins: opts.plugins || [],
    });
  }
}

export { Service };
