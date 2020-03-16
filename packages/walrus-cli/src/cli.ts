import { join } from 'path';
import { existsSync } from 'fs';
import { chalk, yParser } from '@birman/utils';
import { Service } from './service';
import getCwd from './utils/get-cwd';
import getPkg from './utils/get-pkg';

const args = yParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h'],
  },
  boolean: ['version'],
});

(async () => {
  try {
    const name = args._[0];
    await new Service({
      cwd: getCwd(),
      pkg: getPkg(process.cwd()),
    }).run({
      name,
      args,
    });
  } catch (e) {
    console.error(chalk.red(e.message));
    console.error(e.stack);
    process.exit(1);
  }
})();
