import { join } from 'path';
import ignore, { Ignore } from 'ignore';
import { existsSync, readFileSync } from 'fs';

interface Opts {
  directory?: string;
  filename?: string;
  patterns?: string[];
}

type IgnoreFilterResult = (item?: any) => boolean;

export default function ignoreFilter(opts: Opts): IgnoreFilterResult {
  const { directory, filename = '.walrusignore', patterns } = opts;

  let ignoreFilter: IgnoreFilterResult = () => true;

  if (directory && filename) {
    const file = join(directory, filename);

    if (existsSync(file)) {
      const filter = ignore().add(readFileSync(file, 'utf8').toString()).createFilter();
      ignoreFilter = (path) => filter(join(path));
    }
  }

  if (patterns && patterns.length) {
    const filter = ignore()
      .add(patterns)
      .createFilter();
      ignoreFilter = (path) => filter(join(path));
  }

  return ignoreFilter;
}
