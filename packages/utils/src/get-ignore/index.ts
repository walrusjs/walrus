import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

export default function getIgnore(directory: string, filename = '.walrusignore') {
  const file = join(directory, filename);

  if (existsSync(file)) {
    return readFileSync(file, 'utf8').trim();
  }

  return undefined;
}
