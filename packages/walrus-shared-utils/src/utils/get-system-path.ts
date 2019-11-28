import { isWindows } from '../os-utils';

function asWindowsPath(path: string) {
  const drive = path.match(/^\/(\w)(?:\/(.*))?$/);
  if (drive) {
    const subPath = drive[2] ? drive[2].replace(/\//g, '\\') : '';

    return `${drive[1]}:\\${subPath}`;
  }

  return path.replace(/\//g, '\\');
}

/**
 * 获取系统路径，主要解决windows/linux路径规则不一致的问题
 * @param path
 */
export default function getSystemPath(path: string): string {
  if (isWindows) {
    return asWindowsPath(path);
  }

  return path;
}
