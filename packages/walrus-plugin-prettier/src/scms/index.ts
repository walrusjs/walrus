import * as gitScm from './git';

export default (directory) => {
  const rootDirectory = gitScm.detect(directory);

  if (rootDirectory) {
    return Object.assign({ rootDirectory }, gitScm);
  }
}
