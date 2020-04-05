import { join } from 'path';
import createMatcher from '.';

test('createMatcher', async () => {

  const matcher = createMatcher('**/*.ts');

  const files = [
    'src/index.js',
    'src/lib/test.ts'
  ];

  expect(files.filter(matcher)).toEqual(['src/lib/test.ts']);
})

