import { join } from 'path';
import parseRequireDeps from '.';
import winPath from '../win-path';

const fixtures = join(__dirname, 'fixtures');

test('normal', () => {
  const fixture = join(fixtures, 'normal');
  const ret = parseRequireDeps(join(fixture, '.birmanrc.ts')).map((p) =>
    p.replace(winPath(fixture), '.')
  );
  expect(ret).toEqual(['./.birmanrc.ts', './config/foo.ts', './src/a.js']);
});

test('directory index', () => {
  const fixture = join(fixtures, 'directory-index');
  const ret = parseRequireDeps(join(fixture, 'config/config.ts')).map((p) =>
    p.replace(winPath(fixture), '.')
  );
  expect(ret).toEqual(['./config/config.ts', './utils/index.tsx', './src/foo.ts']);
});

test('avoid cycle', () => {
  const fixture = join(fixtures, 'cycle');
  const ret = parseRequireDeps(join(fixture, 'a.ts')).map((p) => p.replace(winPath(fixture), '.'));
  expect(ret).toEqual(['./a.ts', './b.ts', './c.ts']);
});
