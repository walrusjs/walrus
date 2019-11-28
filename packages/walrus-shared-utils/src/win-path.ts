const slash = require('slash');

/**
 * Convert Windows backslash paths to slash paths
 * @param path
 */
export default function(path: string): string {
  return slash(path);
}
