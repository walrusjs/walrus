import { Api } from '@walrus/types';
import { chalk, lodash } from '@walrus/utils';
import assert from 'assert';
import { getPadLength } from './utils';

function getDescriptions(commands: any) {
  return Object.keys(commands)
    .filter(name => typeof commands[name] !== 'string')
    .map(name => {
      return getDescription(commands[name]);
    });
}

function getDescription(command: any) {
  return `    ${chalk.green(
    lodash.padEnd(command.name, 10),
  )}${command.description || ''}`;
}

function padLeft(str: string) {
  return str
    .split('\n')
    .map((line: string) => `    ${line}`)
    .join('\n');
}

function logHelpForCommand(name, command) {
  if (!command) {
    console.log(chalk.red(`\n  command "${name}" does not exist.`));
  }

  const options = command.options || {};
  console.log(`\n  Usage: walrus ${name} [options]`);

  if (options) {
    console.log(`\n  Options:\n`);
    const padLength = getPadLength(options);
    for (const [flags, description] of Object.entries(options)) {
      console.log(`    ${chalk.blue(flags.padEnd(padLength))}${description}`);
    }
  }

  console.log('\n  Details: \n  ');

  console.log(`${command.details ? padLeft(command.details.trim()) : ''}`);
}

export default (api: Api) => {
  api.registerCommand({
    name: 'help',
    description: 'show command helps',
    fn({ args }) {
      const commandName = args._[0];
      if (commandName) {
        const command = api.service.commands[commandName] as any;
        assert(command, `Command ${commandName} not found.`);

        logHelpForCommand(commandName, command);
      } else {
        console.log(`
  Usage: walrus <command> [options]

  Commands:

${getDescriptions(api.service.commands).join('\n')}

  Run \`${chalk.bold(
    'walrus help <command>',
  )}\` for more information of specific commands.
  Visit ${chalk.bold('https://walrusjs.now.sh')} to learn more about walrus.
      `);
      }
    },
  });
};
