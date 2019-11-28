import chalk from 'chalk';
import { EventEmitter } from 'events';

export const events = new EventEmitter();

class Logger {
  private format = (label, msg: string) => {
    return msg
      .split('\n')
      .map((line, i) => {
        return i === 0 ? `${label} ${line}` : line.padStart(chalk.reset(label).length);
      })
      .join('\n');
  };

  private chalkTag = (msg: string) => {
    chalk.bgBlackBright.white.dim(` ${msg} `);
  };

  private _log = (type, tag, message) => {
    if (message) {
      events.emit('log', {
        message,
        type,
        tag
      });
    }
  };

  log = (msg: string = '', tag = null) => {
    tag ? console.log(this.format(this.chalkTag(tag), msg)) : console.log(msg);
    this._log('log', tag, msg);
  };

  info = (msg: string = '', tag = null) => {
    console.log(this.format(chalk.bgBlue.black(' INFO ') + (tag ? this.chalkTag(tag) : ''), msg));
    this._log('info', tag, msg);
  };

  done = (msg: string = '', tag = null) => {
    console.log(this.format(chalk.bgGreen.black(' DONE ') + (tag ? this.chalkTag(tag) : ''), msg));
    this._log('done', tag, msg);
  };

  warn = (msg: string = '', tag = null) => {
    console.warn(
      this.format(
        chalk.bgYellow.black(' WARN ') + (tag ? this.chalkTag(tag) : ''),
        chalk.yellow(msg)
      )
    );
    this._log('warn', tag, msg);
  };

  error = (msg, tag = null) => {
    console.error(
      this.format(chalk.bgRed(' ERROR ') + (tag ? this.chalkTag(tag) : ''), chalk.red(msg))
    );
    this._log('error', tag, msg);
    if (msg instanceof Error) {
      console.error(msg.stack);
      this._log('error', tag, msg.stack);
    }
  };
}

const test = 131313

export default Logger
