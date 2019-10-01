import { isWindows } from '../osUtils';

function asWindowsPath(path: string) {
  const drive = path.match(/^\/(\w)(?:\/(.*))?$/);
  if (drive) {
    const subPath = drive[2] ? drive[2].replace(/\//g, '\\') : '';

    return `${drive[1]}:\\${subPath}`;
  }

  return path.replace(/\//g, '\\');
}

export default function getSystemPath(path: string): string {
  if (isWindows) {
    return asWindowsPath(path);
  }

  return path;
}
