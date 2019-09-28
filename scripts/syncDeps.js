const semver = require('semver');
const inquirer = require('inquirer');
const globby = require('globby');
const chalk = require('chalk');
const readline = require('readline');
const { writeFileSync, readFileSync } = require(`fs`);
const { relative, resolve } = require(`path`);
const request = require('request-promise-native');
const { execSync } = require(`child_process`);

const localPackageRE = /'(@walrus\/(?:cli|eslint|babel)[\w-]+)': '\^([\w-.]+)'/g;
// 版本信息缓存
const versionCache = {};

/**
 * 获取包的最新版本
 * @param pkg
 */
const getRemoteVersion = async (pkg) => {
  if (versionCache[pkg]) {
    return versionCache[pkg]
  }

  if (versionCache[pkg]) {
    return versionCache[pkg]
  }
  let response;
  try {
    response = await request(`http://registry.npmjs.org/${pkg}/latest`, {
      json: true
    })
  } catch (e) {
    return
  }
  versionCache[pkg] = response.version;
  return response.version
};

/**
 * 获取包的最新版本 - 同步
 * @param pkg
 */
const getRemoteVersionSync = (pkg) => {
  if (versionCache[pkg]) {
    return versionCache[pkg]
  }
  const version = execSync(`npm view ${pkg} version`).toString().trim();
  versionCache[pkg] = version;
  return version;
};

/**
 * 检查是否更新 - 同步
 * @param pkg 包的名称
 * @param filePath 文件路径
 * @param local 本地版本
 * @param remote 最新版本
 */
const checkUpdateSync = (
  pkg,
  filePath,
  local,
  remote
) => {
  if (remote !== local) {
    const isNewer = semver.gt(remote, local);
    if (!isNewer) {
      return false
    }
    const maybeBreaking = !semver.intersects(`^${local}`, `^${remote}`);
    console.log(genUpdateString(pkg, filePath, local, remote, maybeBreaking));
    return true
  }
};

/**
 * 检查是否更新 - 异步
 * @param pkg 包的名称
 * @param filePath 文件路径
 * @param local 本地版本
 * @param remote 最新版本
 */
const checkUpdate = async (
  pkg,
  filePath,
  local,
  remote
) => {
  if (remote !== local) {
    const isNewer = semver.gt(remote, local);
    if (!isNewer) {
      return false
    }
    const maybeBreaking = !semver.intersects(`^${local}`, `^${remote}`);
    if (!maybeBreaking) {
      return true;
    }
    const { shouldUpdate } = await inquirer.prompt([{
      name: 'shouldUpdate',
      type: 'confirm',
      message: genUpdateString(pkg, filePath, local, remote, maybeBreaking) + `\n` +
        `Update this dependency?`
    }]);
    return shouldUpdate;
  }
};

/**
 * 获取更新的日志信息
 * @param pkg 包的名称
 * @param filePath
 * @param local 本地版本
 * @param remote 最新版本
 * @param maybeBreaking
 */
function genUpdateString (
  pkg,
  filePath,
  local,
  remote,
  maybeBreaking
) {
  return `${chalk.cyan(pkg)}: ${local} => ${remote} ` +
    (maybeBreaking ? chalk.red.bold(`maybe breaking `) : ``) +
    chalk.gray(`(${relative(process.cwd(), filePath)})`)
}

// 写的缓存
const writeCache = {};

const bufferWrite = (file, content) => {
  writeCache[file] = content
};

const flushWrite = () => {
  for (const file in writeCache) {
    writeFileSync(file, writeCache[file])
  }
};

async function syncDeps (options) {
  const { local, version, skipPrompt } = options;
  // 1. update all package deps
  const updatedDeps = new Set();

  if (!local) {
    console.log('Syncing remote deps...');
    // 读取packages目录下所有的包的package.json
    const packages = await globby(['packages/*/package.json']);
    const resolvedPackages = (await Promise.all(packages.filter(filePath => {
      return filePath.match(/walrus-plugin|eslint-config/)
    })
      .concat('package.json')
      .map(async (filePath) => {
        const pkg = require(resolve(__dirname, '../', filePath));
        // 检查是否有依赖项
        if (!pkg.dependencies) {
          return
        }
        const deps = pkg.dependencies;
        // 解析后的依赖
        const resolvedDeps = [];
        for (const dep in deps) {
          let local = deps[dep];
          if (local.charAt(0) !== '^') {
            continue
          }
          local = local.replace(/^\^/, '');
          readline.clearLine(process.stdout);
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(dep);
          const remote = await getRemoteVersion(dep);
          resolvedDeps.push({
            dep,
            local,
            remote
          });
        }
        return {
          pkg,
          filePath,
          resolvedDeps
        }
      })))
      .filter(_ => _);

    for (const resolvedPackage of resolvedPackages) {
      const { pkg, filePath, resolvedDeps } = resolvedPackage;
      let isUpdated = false;
      for (const { dep, local, remote } of resolvedDeps) {
        if (remote && await checkUpdate(dep, filePath, local, remote)) {
          pkg.dependencies[dep] = `^${remote}`;
          updatedDeps.add(dep);
          isUpdated = true
        }
      }
      if (isUpdated) {
        bufferWrite(filePath, JSON.stringify(pkg, null, 2) + '\n')
      }
    }
  }

  console.log('Syncing local deps...');

  const updatedRE = new RegExp(`'(${Array.from(updatedDeps).join('|')})': '\\^(\\d+\\.\\d+\\.\\d+[^']*)'`);
  const paths = await globby(['packages/**/*.js']);

  paths
    .filter(p => !/\/files\//.test(p) && !/\/node_modules/.test(p))
    .forEach(filePath => {
      let isUpdated = false;
      const makeReplacer = versionGetter => (_, pkg, curVersion) => {
        const targetVersion = versionGetter(pkg);
        if (!targetVersion) return _;
        if (checkUpdateSync(pkg, filePath, curVersion, targetVersion)) {
          isUpdated = true
        }
        return `'${pkg}': '^${targetVersion}'`
      };

      const localReplacer = makeReplacer(
        pkg => {
          try {
            if (pkg.includes('eslint-config')) {
              return require(`../packages/${pkg}/package.json`).version
            }

            if (!semver.prerelease(version) && pkg.includes('@walrus/walrus-plugin')) {
              return `${semver.major(version)}.${semver.minor(version)}.0`
            }

            // otherwise, inline version takes priority
            return version || require(`../packages/${pkg}/package.json`).version
          } catch (e) {}
        }
      );

      const remoteReplacer = makeReplacer(getRemoteVersionSync);

      const updated = readFileSync(filePath, 'utf-8')
        // update @walrus packages in this repo
        .replace(localPackageRE, localReplacer)
        .replace(updatedRE, remoteReplacer);

      if (isUpdated) {
        bufferWrite(filePath, updated)
      }
    });

  if (!Object.keys(writeCache).length) {
    return console.log(`All packages up-to-date.`)
  }

  if (skipPrompt) {
    flushWrite();
    return
  }

  const { yes } = await inquirer.prompt([{
    name: 'yes',
    type: 'confirm',
    message: 'Commit above updates?'
  }]);

  if (yes) {
    flushWrite()
  }
}

syncDeps({
  version: '0.0.2',
  local: true,
  skipPrompt: true
});

exports.syncDeps = syncDeps;

if (!process.env.WALRUS_CLI_RELEASE) {
  const args = require('minimist')(process.argv.slice(2));
  syncDeps(args)
    .catch(err => {
      console.log(err);
      process.exit(1);
    })
}
