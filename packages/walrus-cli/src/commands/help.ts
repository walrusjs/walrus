export default function (
  api
) {
  api.registerCommand('help', args => {
    const commandName = args._[0];
    console.log(commandName + 'help command');
  })
}
