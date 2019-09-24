import { clearConsole, chalk, semver } from '@walrus/shared-utils';

export const generateTitle = function(checkUpdate?: boolean) {
  const current = '0.0.1';
  const latest = '0.0.2';

  let title = chalk.bold.blue(`Walrus CLI v${current}`);

  if (process.env.WALRUS_CLI_TEST) {
    title += ' ' + chalk.blue.bold('TEST')
  }
  if (process.env.WALRUS_CLI_DEBUG) {
    title += ' ' + chalk.magenta.bold('DEBUG')
  }
  if (checkUpdate && semver.gt(latest, current)) {
    if (process.env.WALRUS_CLI_API_MODE) {
      title += chalk.green(` 🌟️ Update available: ${latest}`)
    } else {
      title += chalk.green(`
┌────────────────────${`─`.repeat(latest.length)}──┐
│  Update available: ${latest}  │
└────────────────────${`─`.repeat(latest.length)}──┘`)
    }
  }

  return title;
};

export const clearConsoleWithTitle = function(checkUpdate?: boolean) {
  const title = generateTitle(checkUpdate);
  clearConsole(title);
};
