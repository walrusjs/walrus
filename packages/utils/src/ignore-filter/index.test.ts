import { join } from 'path';
import ignoreFilter from '.';

const fixtures = join(__dirname, 'fixtures');

test('normal', async () => {
  const cwd = join(fixtures, 'normal');

  const result = ignoreFilter({ directory: cwd });

  const files = [
    'lib/test.js',
    'src/lib/test.ts'
  ];

  expect(files.filter(result)).toEqual([]);
  expect(['src/test.js'].filter(result)).toEqual(['src/test.js']);
})

test('empty', async () => {
  const cwd = join(fixtures, 'empty');

  const result = ignoreFilter({ directory: cwd });

  const files = [
    'lib/test.js',
    'src/lib/test.ts'
  ];

  expect(files.filter(result)).toEqual(files);
})

