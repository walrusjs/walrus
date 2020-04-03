import resolve from 'resolve';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import lodash from 'lodash';
// @ts-ignore
import crequire from 'crequire';
import winPath from '../win-path';

function parse(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf-8');

  return (crequire(content) as any[])
    .map<string>((o) => o.path)
    .filter((path) => path.charAt(0) === '.')
    .map((path) =>
      winPath(
        resolve.sync(path, {
          basedir: dirname(filePath),
          extensions: ['.tsx', '.ts', '.jsx', '.js']
        })
      )
    );
}

export default function parseRequireDeps(filePath: string): string[] {
  const paths = [filePath];
  const ret = [winPath(filePath)];

  while (paths.length) {
    // 避免依赖循环
    const extraPaths = lodash.pullAll(parse(paths.shift()!), ret);
    if (extraPaths.length) {
      paths.push(...extraPaths);
      ret.push(...extraPaths);
    }
  }

  return ret;
}
