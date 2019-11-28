import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import ignore from 'ignore';

/**
 * 创建忽略，读取项目根目录.prettierignore
 */
export default (directory: string, filename = '.prettierignore') => {
  const file = join(directory, filename);

  if (existsSync(file)) {
    const text = readFileSync(file, 'utf8');
    const filter = ignore()
      .add(text)
      .createFilter();
    return (path) => filter(join(path));
  }

  return () => true;
};
