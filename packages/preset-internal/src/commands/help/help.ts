import { Api } from '@walrus/types';
import { chalk, lodash } from '@birman/utils';
import assert from 'assert';

const helpCommand = ( api: Api ) => {
  api.registerCommand({
    name: 'help',
    description: 'show command helps',
    fn: ({ args }) => {
      const commandName = args._[0];

      console.log(commandName);

    }
  })
}

export default helpCommand;
