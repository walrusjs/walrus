import { join } from 'path';
import loadDotEnv from './load-dot-env';

test('loadDotEnv', () => {
  const fixtures = join(__dirname, '..', 'fixtures', 'load-dot-env', '.env');
  loadDotEnv(fixtures);

  expect(process.env.ENV_A).toEqual('none');
  expect(process.env.ENV_B).toEqual('http://localhost:8002/');
  expect(process.env.ENV_C).toEqual('8002');
});
