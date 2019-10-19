import scms from './scms';
import { Logger } from '@walrus/shared-utils';

interface IOptions {
  since?: string;
  staged?: boolean;
  branch?: string;
  onFoundSinceRevision?: (name: string, revision: string) => void;
}

const logger = new Logger();

export default (
  currentDirectory: string,
  options: IOptions = {}
) => {
  const scm = scms(currentDirectory);
  const { staged, branch, since, onFoundSinceRevision } = options;
  if (!scm) {
    throw new Error('Unable to detect a source control manager.');
  }
  const directory = scm.rootDirectory;
  const revision = since || scm.getSinceRevision(directory, { staged, branch });

  onFoundSinceRevision && onFoundSinceRevision(scm.name, revision);
}
