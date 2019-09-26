import { resolve } from 'path';

export default (relativePath: string): string => {
  return resolve(__dirname, '..', relativePath);
}
