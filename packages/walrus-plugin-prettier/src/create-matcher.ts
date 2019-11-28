import * as multimatch from 'multimatch';
import { _ } from '@walrus/shared-utils';
import { normalize } from 'path';

export default (pattern) => {
  // Match everything if no pattern was given
  if (!_.isString(pattern) && !_.isArray(pattern)) {
    return () => true;
  }
  const patterns = _.isArray(pattern) ? pattern : [pattern];
  return (file) => multimatch(normalize(file), patterns, { dot: true }).length > 0;
};
