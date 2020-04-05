
import { join } from 'path';
import { winPath } from '@birman/utils';
import { ApplyPluginsType } from './enums';
import Service from '.';

const fixtures = join(__dirname, 'fixtures');

const simplyPluginIds = ({ cwd, plugins }: { cwd: string; plugins: any }) =>
  Object.keys(plugins).map(id => {
    const type = plugins[id].isPreset ? 'preset' : 'plugin';
    return `[${type}] ${id.replace(winPath(cwd), '.')}`;
  });

test('normal', async () => {
  const cwd = join(fixtures, 'normal');
  const service = new Service({
    cwd,
    presets: [
      require.resolve(join(cwd, 'preset_1')),
      require.resolve(join(cwd, 'preset_2'))
    ],
    plugins: [
      require.resolve(join(cwd, 'plugin_1')),
      require.resolve(join(cwd, 'plugin_2'))
    ]
  });

  expect(service.pkg.name).toEqual('foo');
  expect(service.initialPresets.map((p) => p.key)).toEqual([
    'index',
    'index',
    '2',
    '2',
    'bigfish',
    '1',
    '1'
  ]);
  expect(service.initialPlugins.map((p) => p.key)).toEqual([
    'plugin1',
    'plugin2',
    '2',
    '2',
    '1',
    '1'
  ]);

  await service.init();
  const plugins = simplyPluginIds({
    cwd: cwd,
    plugins: service.plugins
  });
  expect(plugins).toEqual([
    '[preset] ./preset_1/index',
    '[preset] ./preset_1/preset_1/index',
    '[preset] ./preset_2/index',
    '[preset] @walrus/preset-2',
    '[preset] walrus-preset-2',
    '[preset] @sensoro/walrus-preset-bigfish',
    '[preset] @walrus/preset-1',
    '[preset] walrus-preset-1',
    '[plugin] ./preset_1/preset_1/plugin_1',
    '[plugin] ./preset_1/plugin_1',
    '[plugin] ./preset_1/plugin_2',
    '[plugin] ./preset_2/plugin_1',
    '[plugin] ./plugin_1',
    '[plugin] ./plugin_2',
    '[plugin] @walrus/plugin-2',
    '[plugin] walrus-plugin-2',
    '[plugin] @walrus/plugin-1',
    '[plugin] walrus-plugin-1'
  ]);

  expect(service.hooks['foo'].length).toEqual(2);

  const ret = await service.applyPlugins({
    key: 'foo',
    type: ApplyPluginsType.add
  });
  expect(ret).toEqual(['a', 'a']);
});

test('api.args', async () => {
  const cwd = join(fixtures, 'api-args');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin'))],
  });
  const ret = await service.run({
    name: 'build',
    args: {
      projectName: 'bar',
    },
  });
  expect(ret).toEqual(`hello bar`);
});

// ----------------- registerCommand -----------------

test('api.registerCommand', async () => {
  const cwd = join(fixtures, 'api-register-command');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin'))],
  });
  const ret = await service.run({
    name: 'build',
    args: {
      projectName: 'bar',
    },
  });
  expect(ret).toEqual(`hello bar`);
});

test('api.registerCommand aliased', async () => {
  const cwd = join(fixtures, 'api-register-command-aliased');
  const service = new Service({
    cwd,
    plugins: [require.resolve(join(cwd, 'plugin'))],
  });
  const ret = await service.run({
    name: 'b',
    args: {
      projectName: 'bar',
    },
  });
  expect(ret).toEqual(`hello bar`);
});

// ----------------- registerPresets -----------------

test('api.registerPresets', async () => {
  const cwd = join(fixtures, 'api-register-presets');
  const service = new Service({
    cwd,
    presets: [require.resolve(join(cwd, 'preset_1'))]
  });
  await service.init();
  const plugins = simplyPluginIds({
    cwd: cwd,
    plugins: service.plugins
  });
  expect(plugins).toEqual(['[preset] ./preset_1', '[preset] preset_2', '[preset] ./preset_3']);
});

// ----------------- registerPlugins -----------------

test('api.registerPlugins', async () => {
  const cwd = join(fixtures, 'api-register-plugins');
  const service = new Service({
    cwd,
    presets: [require.resolve(join(cwd, 'preset_1'))],
    plugins: [require.resolve(join(cwd, 'plugin_1'))]
  });
  await service.init();
  const plugins = simplyPluginIds({
    cwd: cwd,
    plugins: service.plugins
  });
  expect(plugins).toEqual([
    '[preset] ./preset_1',
    '[plugin] plugin_4',
    '[plugin] ./plugin_5',
    '[plugin] ./plugin_1',
    '[plugin] plugin_2',
    '[plugin] ./plugin_3'
  ]);
});
