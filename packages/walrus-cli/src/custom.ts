import { Signale, SignaleOptions } from '@walrus/shared-utils/lib/signale';

const options: SignaleOptions = {
  scope: 'walrus-cli'
};

export default new Signale(options);
