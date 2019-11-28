#!/usr/bin/env node

import { semver, minimist, checkNodeVersion } from '@walrus/shared-utils';
import Service from './service';
import custom from './custom';

const service = new Service();

// 获取需要兼容的Node版本
const requiredVersion = require('../package.json').engines.node;

// 检查Node版本
checkNodeVersion(requiredVersion, 'walrus-cli');

// Node版本为9.x则给出警告
if (semver.satisfies(process.version, '9.x')) {
  custom.error(
    `You are using Node ${process.version}.\n` +
    `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
    `It's strongly recommended to use an active LTS version instead.`
  );
}

const rawArgv = process.argv.slice(2);

const args = minimist(rawArgv, {
  boolean: []
});

const command = args._[0];

service.run(command, args, rawArgv)
  .catch((err) => {
    custom.error(err);
    process.exit(1);
  });
