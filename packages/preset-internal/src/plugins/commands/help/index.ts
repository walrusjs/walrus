import { Api } from '@walrus/types';
import { chalk, lodash } from '@birman/utils';
import assert from 'assert';

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

export default (api: Api) => {
  api.registerCommand({
    name: 'help',
    description: 'show command helps',
    fn({ args }) {
      const commandName = args._[0];
      if (commandName) {
        const command = api.service.commands[commandName] as any;
        assert(command, `Command ${commandName} not found.`);
        console.log(`
  Usage: walrus ${commandName} [options]

  Options:

  Details:

${command.details ? padLeft(command.details.trim()) : ''}
        `);
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
