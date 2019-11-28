import { PluginCommitLintOptions } from '@walrus/types';
import { _ } from '@walrus/shared-utils';
import defaultOptions from './defaultConfig';
import {
  checkFromStdin,
  checkFromRepository,
  getSeed,
  loadFormatter,
  selectParserOpts
} from './utils';

const load = require('@commitlint/load');
const read = require('@commitlint/read');
const lint = require('@commitlint/lint');
const stdin = require('get-stdin');
const pkg = require('../package.json');

export default async function commitLint(raw: string[] = [], config: PluginCommitLintOptions = {}) {
  const options = Object.assign({}, defaultOptions, config);

  if (options.env) {
    if (!(options.env in process.env)) {
      throw new Error(
        `Recieved '${options.env}' as value for --env, but environment variable '${options.env}' is not available globally`
      );
    }
    options.edit = process.env[options.env];
  }

  const fromStdin = checkFromStdin(raw, options);

  const range = _.pick(options, 'edit', 'from', 'to');

  const input = await (fromStdin ? stdin() : read(range, { cwd: options.cwd }));

  const messages = (Array.isArray(input) ? input : [input])
    .filter((message) => typeof message === 'string')
    .filter((message) => message.trim() !== '')
    .filter(Boolean);

  if (messages.length === 0 && !checkFromRepository(options)) {
    const err = new Error(
      '[input] is required: supply via stdin, or --env or --edit or --from and --to'
    );
    console.log(err.message);
    throw err;
  }

  const loadOpts = {
    cwd: options.cwd,
    file: options.config
  };

  const loaded = await load(getSeed(options), loadOpts);

  const parserOpts = selectParserOpts(loaded.parserPreset);

  const opts = {
    parserOpts: {},
    plugins: {},
    ignores: [],
    defaultIgnores: true
  };

  if (parserOpts) {
    opts.parserOpts = parserOpts;
  }

  if (loaded.plugins) {
    opts.plugins = loaded.plugins;
  }

  if (loaded.ignores) {
    opts.ignores = loaded.ignores;
  }

  if (loaded.defaultIgnores === false) {
    opts.defaultIgnores = false;
  }

  const format = loadFormatter(loaded, options);

  // Strip comments if reading from `.git/COMMIT_EDIT_MSG`
  if (range.edit) {
    opts.parserOpts['commentChar'] = '#';
  }

  const lints = messages.map((message) => lint(message, loaded.rules, opts));

  // @ts-ignore
  const results = await Promise.all(lints);

  const report = results.reduce(
    (info, result) => {
      info.valid = result.valid ? info.valid : false;
      info.errorCount += result.errors.length;
      info.warningCount += result.warnings.length;
      info.results.push(result);

      return info;
    },
    {
      valid: true,
      errorCount: 0,
      warningCount: 0,
      results: []
    }
  );

  const output = format(report, {
    color: options.color,
    verbose: options.verbose,
    helpUrl: options.helpUrl
      ? options.helpUrl.trim()
      : 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint'
  });

  if (!output.quiet && output !== '') {
    console.log(output);
  }

  if (!report.valid) {
    const err = new Error(output);
    err['type'] = pkg.name;
    throw err;
  }
}
