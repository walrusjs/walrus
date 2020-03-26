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

// 处理版本 >> walrus -v
if (args.version && !args._[0]) {
  args._[0] = 'version';
  const local = existsSync(join(__dirname, '../.local'))
    ? chalk.cyan('@local')
    : '';
  console.log(`walrus@${require('../package.json').version}${local}`);
} else if (!args._[0]) {
  args._[0] = 'help';
}

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
