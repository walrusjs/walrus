import * as getStdin from 'get-stdin';
import { minimist } from '@walrus/shared-utils';
import Linter, { IOptions } from './linter';

const rawArgv = process.argv.slice(2);

function Cmd(opts: IOptions) {
  const linter = new Linter(opts);

  opts = Object.assign({
    cmd: 'walrus-engine',
    tagline: 'JavaScript Custom Style',
    version: '0.0.0'
  }, opts);

  const argv = minimist(rawArgv, {
    alias: {
      global: 'globals',
      plugin: 'plugins',
      env: 'envs',
      help: 'h',
      verbose: 'v'
    },
    boolean: [
      'fix',
      'help',
      'stdin',
      'verbose',
      'version'
    ],
    string: [
      'global',
      'plugin',
      'parser',
      'env'
    ]
  });

  const lintOpts = {
    fix: argv.fix,
    globals: argv.global,
    plugins: argv.plugin,
    envs: argv.env,
    parser: argv.parser
  };

  let stdinText;

  if (argv.stdin) {
    getStdin()
      .then(function (text) {
        stdinText = text;
        linter.lintText(text, lintOpts, onResult)
      })
  } else {
    linter.lintFiles(argv._, lintOpts, onResult)
  }

  function onResult (err, result) {
    if (err) return onError(err);

    if (argv.stdin && argv.fix) {
      if (result.results[0].output) {
        // Code contained fixable errors, so print the fixed code
        process.stdout.write(result.results[0].output)
      } else {
        // Code did not contain fixable errors, so print original code
        process.stdout.write(stdinText)
      }
    }

    if (!result.errorCount && !result.warningCount) {
      process.exitCode = 0;
      return
    }

    console.error('%s: %s', opts.cmd, opts.tagline);

    const isFixable = result.results.some(function (result) {
      return result.messages.some(function (message) {
        return !!message.fix
      })
    });

    if (isFixable) {
      console.error(
        '%s: %s',
        opts.cmd,
        'Run `' + opts.cmd + ' --fix` to automatically fix some problems.'
      )
    }

    result.results.forEach(function (result) {
      result.messages.forEach(function (message) {
        log(
          '  %s:%d:%d: %s%s',
          result.filePath,
          message.line || 0,
          message.column || 0,
          message.message,
          argv.verbose ? ' (' + message.ruleId + ')' : ''
        )
      })
    });

    process.exitCode = result.errorCount ? 1 : 0;
  }

  function onError(err) {
    console.error(opts.cmd + ': Unexpected linter output:\n');
    console.error(err.stack || err.message || err);
    console.error(
      '\nIf you think this is a bug in `%s`, open an issue: %s',
      opts.cmd, opts.bugs
    );
    process.exitCode = 1
  }

  function log(template, filePath, line, column, message, ruleId) {
    if (argv.stdin && argv.fix) {
      arguments[0] = opts.cmd + ': ' + arguments[0];
      console.error.apply(console, arguments);
    } else {
      console.log.apply(console, arguments);
    }
  }

}

export default Cmd;
