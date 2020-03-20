export default function() {
  return {
    plugins: [
      // register methods
      require.resolve('./plugins/methods/create-ignorer'),

      // bundle configs
      require.resolve('./plugins/features/ignore'),
      require.resolve('./plugins/features/plugins'),
      require.resolve('./plugins/features/presets'),

      // commands
      require.resolve('./plugins/commands/help'),
      require.resolve('./plugins/commands/version'),
    ],
  };
}
