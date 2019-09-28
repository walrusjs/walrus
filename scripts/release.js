/**

 如何发布：

 1. 确保您具有所有软件包的发布权限:
 - 您必须是npm @walrus组织成员
 - 您必须具有发布walrus-version-marker的权限
 - 确保您没有启用 npm per-publish 2-factor / OTP, 因为它不适用于Lerna（我们用于批量发布）。

 2. 运行`yarn release`，按照提示进行操作

 3A. 如果一切正常，则标签应已自动按入，并且本地变更日志提交应该已经生成。转到4。

 3B. 如果发布中途失败，则事情变得很繁琐。现在你需要转到npm检查哪些软件包已经发布并手动发布尚未发布的。

 3B.1. 将release git标签推送到GitHub。
 3B.2. 运行`yarn changelog`来生成changelog提交。

 4. 将更改日志提交推送到`dev`分支。

 5. 转到GitHub并验证变更日志是否处于活动状态。

 6. 转到GitHub版本页面并发布版本（这对于发布遇到问题的版本）

 Note: eslint-config-* packages should be released separately & manually.

 */

process.env.WALRUS_CLI_RELEASE = 'true';

const semver = require('semver');
const inquirer = require('inquirer');
const execa = require('execa');
const minimist = require('minimist');
const { syncDeps } = require('./syncDeps');

const cliOptions = minimist(process.argv);
if (cliOptions['local-registry']) {
  inquirer.prompt = () => ({
    bump: 'minor',
    yes: true
  })
}

// 获取当前版本
const currentVersion = require('../lerna.json').version;

const release = async () => {
  console.log(`Current version: ${currentVersion}`);

  const bumps = ['patch', 'minor', 'major', 'prerelease'];
  const versions = {};
  bumps.forEach(b => { versions[b] = semver.inc(currentVersion, b) });
  const bumpChoices = bumps.map(b => ({ name: `${b} (${versions[b]})`, value: b }));

  const { bump, customVersion } = await inquirer.prompt([
    {
      name: 'bump',
      message: 'Select release type:',
      type: 'list',
      choices: [
        ...bumpChoices,
        { name: 'custom', value: 'custom' }
      ]
    },
    {
      name: 'customVersion',
      message: 'Input version:',
      type: 'input',
      when: answers => answers.bump === 'custom'
    }
  ]);

  const version = customVersion || versions[bump];

  const { yes } = await inquirer.prompt([{
    name: 'yes',
    message: `Confirm releasing ${version}?`,
    type: 'confirm'
  }]);

  if (yes) {
    await syncDeps({
      version,
      local: true,
      skipPrompt: true
    });
    delete process.env.PREFIX;

    // buildEditorConfig()

    try {
      await execa('git', ['add', '-A'], { stdio: 'inherit' });
      await execa('git', ['commit', '-m', 'chore: pre release sync'], { stdio: 'inherit' })
    } catch (e) {
      // if it's a patch release, there may be no local deps to sync
    }
  }

  const releaseType = semver.diff(currentVersion, version);

  let distTag = 'latest';
  if (releaseType.startsWith('pre') && !cliOptions['local-registry']) {
    distTag = 'next'
  }

  const lernaArgs = [
    'publish',
    version,
    '--dist-tag',
    distTag
  ];
  // keep packages' minor version in sync
  if (releaseType !== 'patch') {
    lernaArgs.push('--force-publish')
  }

  if (cliOptions['local-registry']) {
    lernaArgs.push('--no-git-tag-version', '--no-commit-hooks', '--no-push', '--yes')
  }

  await execa(require.resolve('lerna/cli'), lernaArgs, { stdio: 'inherit' })
};

release()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
