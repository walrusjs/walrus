import { join } from 'path';
import { existsSync } from 'fs';
import winPath from '../win-path';

type FileType = 'javascript' | 'css';

interface GetFileOpts {
  base: string;
  type: FileType;
  fileNameWithoutExt: string;
}

const extsMap: Record<FileType, string[]> = {
  javascript: ['.ts', '.tsx', '.js', '.jsx'],
  css: ['.less', '.sass', '.scss', '.stylus', '.css']
};

export default function getFile(opts: GetFileOpts) {
  const exts = extsMap[opts.type];
  for (const ext of exts) {
    const filename = `${opts.fileNameWithoutExt}${ext}`;
    const path = winPath(join(opts.base, filename));
    if (existsSync(path)) {
      return {
        path,
        filename
      };
    }
  }
  return null;
}
