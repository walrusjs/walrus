#!/usr/bin/env node

const resolveCwd = require('resolve-cwd');

const { name, bin } = require('../package.json');
const localCLI = resolveCwd.silent(`${name}/${bin['walrus']}`);

if (!process.env.USE_GLOBAL_WALRUS && localCLI && localCLI !== __filename) {
  const debug = require('@walrus/utils').createDebug('birman:cli');
  debug('Using local install of walrus');
  require(localCLI);
} else {
  require('../lib/cli');
}
