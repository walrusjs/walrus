import multimatch from 'multimatch';
import { normalize } from 'path';

export default (pattern: (string | string[])) => {
  // Match everything if no pattern was given
  if (typeof pattern !== 'string' && !Array.isArray(pattern)) {
    return () => true;
  }
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  return file => multimatch(normalize(file), patterns, { dot: true }).length > 0;
}
