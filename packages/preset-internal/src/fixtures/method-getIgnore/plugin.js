
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = (api) => {
  api.registerCommand({
    name: 'foo',
    async fn() {
      await delay(100);
      return api.getIgnore(api.cwd);
    },
  });
}
