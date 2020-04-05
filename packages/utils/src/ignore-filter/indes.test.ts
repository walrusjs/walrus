import { join } from 'path';
import ignoreFilter from '.';

const fixtures = join(__dirname, 'fixtures');

test('normal', async () => {
  const cwd = join(fixtures, 'normal');

  const result = ignoreFilter({ directory: cwd });

  expect(['lib/test.js'].filter(result)).toEqual([]);
  expect(['src/test.js'].filter(result)).toEqual(['src/test.js']);
})
