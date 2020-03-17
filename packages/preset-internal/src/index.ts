export default function() {
  return {
    plugins: [
      // bundle configs
      require.resolve('./plugins/features/plugins'),
      require.resolve('./plugins/features/presets'),

      // commands
      require.resolve('./plugins/commands/help'),
      require.resolve('./plugins/commands/version'),
    ],
  };
}
