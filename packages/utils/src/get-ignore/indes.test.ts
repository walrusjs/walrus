import { join } from 'path';
import getIgnore from './';

const fixtures = join(__dirname, 'fixtures');

test('normal', async () => {
  const cwd = join(fixtures, 'normal');

  const result = getIgnore(cwd);

  expect(result).toEqual(`lib`);
})
