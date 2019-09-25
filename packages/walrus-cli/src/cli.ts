#!/usr/bin/env node
import { Command } from 'commander';
import didYouMean from 'didyoumean2';
import { chalk, semver, Logger, checkNodeVersion } from '@walrus/shared-utils';
import { clearConsoleWithTitle } from './utils/clearConsole';
import Service from './service';

const program = new Command();
const logger = new Logger();
const service = new Service(process.cwd());
const requiredVersion = require('../package.json').engines.node;

// 检查Node版本
checkNodeVersion(requiredVersion, 'walrus-cli');

// Node版本为9.x则给出警告
if (semver.satisfies(process.version, '9.x')) {
  console.log(chalk.red(
    `You are using Node ${process.version}.\n` +
    `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
    `It's strongly recommended to use an active LTS version instead.`
  ))
}

function suggestCommands (unknownCommand) {
  const availableCommands = program.commands.map(cmd => {
    return cmd._name
  });

  const suggestion = didYouMean(unknownCommand, availableCommands);
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion + '')}?`))
  }
}

program
  .version(require('../package').version)
  .usage('<command> [options]');

program
  .command('clear')
  .description('clear console')
  .action(() => {
    clearConsoleWithTitle();
  });

// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp();
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
    console.log();
    suggestCommands(cmd)
  });

program.parse(process.argv);

const rawArgv = process.argv.slice(2);

const args = require('minimist')(rawArgv, {
  boolean: [
    // build
    'modern',
    'report',
    'report-json',
    'inline-vue',
    'watch',
    // serve
    'open',
    'copy',
    'https',
    // inspect
    'verbose'
  ]
});

const command = args._[0];

service.run(command, args, rawArgv).catch(err => {
  logger.error(err);
  process.exit(1);
});
