import { join } from 'path';
import getCwd from './get-cwd';

export default (dir: string) => {
  try {
    return require(join(getCwd(), 'package.json'));
  } catch (error) {
    try {
      return require(join(dir, 'package.json'));
    } catch (error) {
      return null;
    }
  }
};
