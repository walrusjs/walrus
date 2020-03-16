export default function() {
  return {
    plugins: [
      // commands
      require.resolve('./plugins/commands/help/help'),
      require.resolve('./plugins/commands/version/version'),
    ],
  };
}
