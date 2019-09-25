#!/usr/bin/env node
import { chalk, semver, Logger, checkNodeVersion } from '@walrus/shared-utils';
import Service from './service';

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

service.run(command, args, rawArgv)
  .catch(err => {
    logger.error(err);
    process.exit(1);
  });
