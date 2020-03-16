
import { join } from 'path';
import Service from '.';

const fixtures = join(__dirname, 'fixtures');

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
