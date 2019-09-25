import * as semver from 'semver';
import chalk from 'chalk';

/**
 * 检查Node版本
 * @param wanted 需要兼容的版本
 * @param id 需要提示的 cli name
 */
export default function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ));
    process.exit(1)
  }
}
