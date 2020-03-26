
import { join } from 'path';
import { Service } from '@walrus/core';

const fixtures = join(__dirname, 'fixtures');

test('config-plugin', async () => {
  const cwd = join(fixtures, 'config-plugins');
  const service = new Service({
    cwd,
    presets: [require.resolve('./index.ts')]
  });
  const ret = await service.run({
    name: 'build',
    args: {
      projectName: 'bar',
    },
  });
  expect(ret).toEqual(`hello bar`);
});

test('api.getIgnore', async () => {
  const cwd = join(fixtures, 'method-getIgnore');
  const service = new Service({
    cwd,
    presets: [require.resolve('./index.ts')],
    plugins: [require.resolve(join(cwd, 'plugin'))],
  });
  const ret = await service.run({
    name: 'foo',
    args: {},
  });
  expect(ret).toEqual(`node_modules/
dist/
`);
});
