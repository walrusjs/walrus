import ignore, { Ignore } from 'ignore';
import { join } from 'path';

export default (patterns: (string | Ignore)[] = []) => {
  if (patterns && patterns.length) {
    const filter = ignore()
      .add(patterns)
      .createFilter();
    return (path) => filter(join(path));
  }

  return () => true;
}
