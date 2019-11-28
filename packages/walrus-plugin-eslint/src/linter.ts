import { homedir, tmpdir } from 'os';
import { join, dirname } from 'path';
import * as eslint from 'eslint';
import { CLIEngine } from 'eslint';
import pkgConf from 'pkg-conf';
import { _ } from '@walrus/shared-utils';

export type IParseOpts = (opts: string, packageOpts: any, rootDir: string) => {};

interface IEslintConfig extends CLIEngine.Options {
  resolvePluginsRelativeTo?: string;
}

export interface IOptions {
  // 当前的工作目录 默认: process.cwd()
  cwd?: string;
  // 应与`bin`的key匹配
  cmd?: string;
  fix?: boolean;
  bugs?: any;
  parser?: string;
  tagline?: string;
  // 需要忽略文件
  ignore?: string[];
  // 默认忽略开关
  noDefaultIgnore?: boolean;
  eslint?: typeof eslint;
  plugin?: string;
  plugins?: string[];
  env?: string;
  envs?: string[];
  global?: string;
  globals?: string[];
  version?: string;
  parseOpts?: IParseOpts;
  // eslint配置
  eslintConfig?: IEslintConfig;
  usePackageJson?: boolean;
}

const HOME_OR_TMP = homedir() || tmpdir();

const DEFAULT_PATTERNS = [
  '**/*.js',
  '**/*.jsx',
  '**/*.mjs',
  '**/*.cjs'
];

// 默认忽略的文件
const DEFAULT_IGNORE = [
  '**/*.min.js',
  'coverage/**',
  'node_modules/**',
  'vendor/**'
];

const deglob = require('deglob');

class Linter {
  private readonly cwd: string;
  private readonly cmd: string;
  private eslint: typeof eslint;
  private customParseOpts: IParseOpts;
  private readonly eslintConfig: IEslintConfig;

  constructor(options: IOptions) {
    this.eslint = options.eslint;
    this.cmd = options.cmd;
    this.cwd = options.cwd || process.cwd();
    this.customParseOpts = options.parseOpts;

    const m = options.version && options.version.match(/^(\d+)\./);
    const majorVersion = (m && m[1]) || '0';

    const cacheLocation = join(HOME_OR_TMP, `.${this.cwd}-v${majorVersion}-cache/`);

    this.eslintConfig = Object.assign({
      cache: true,
      cacheLocation: cacheLocation,
      envs: [],
      fix: false,
      globals: [],
      ignore: false,
      plugins: [],
      useEslintrc: false
    }, options.eslintConfig);

    if (this.eslintConfig.configFile) {
      this.eslintConfig.resolvePluginsRelativeTo = dirname(this.eslintConfig.configFile);
    }
  }

  lintTextSync = (text: string, opts) => {
    opts = this.parseOpts(opts);
    return new this.eslint.CLIEngine(opts.eslintConfig).executeOnText(text, opts.filename)
  };

  lintText = (text, opts, cb) => {
    if (_.isFunction(opts)) {
      return this.lintText(text, null, opts);
    }
    let result;
    try {
      result = this.lintTextSync(text, opts);
    } catch (err) {
      return process.nextTick(cb, err);
    }
    process.nextTick(cb, null, result);
  };

  lintFiles = (
    files: string[],
    opts: IOptions,
    callback: (error, result?) => void
  ) => {
    const self = this;
    if (_.isFunction(opts)) {
      return self.lintFiles(files, null, opts);
    }
    opts = self.parseOpts(opts);
    if (_.isString(files)) {
      files = [files];
    }
    if (files.length === 0) {
      files = DEFAULT_PATTERNS
    }

    const deglobOpts = {
      ignore: opts.ignore,
      cwd: opts.cwd,
      useGitIgnore: true,
      usePackageJson: false
    };

    deglob(files, deglobOpts, function (err, allFiles) {
      if (err) return callback(err);

      let result;
      try {
        result = new self.eslint.CLIEngine(opts.eslintConfig).executeOnFiles(allFiles)
      } catch (err) {
        return callback(err)
      }

      if (opts.fix) {
        self.eslint.CLIEngine.outputFixes(result)
      }

      return callback(null, result)
    })
  };

  /**
   * 解析配置项
   * @param opts
   */
  parseOpts = (opts: IOptions) => {
    const self = this;

    if (opts) {
      opts = {};
    }
    opts = Object.assign({}, opts);
    opts.eslintConfig = Object.assign({}, self.eslintConfig);
    opts.eslintConfig.fix = !!opts.fix;

    if (!opts.cwd) opts.cwd = self.cwd;

    // 如果未提供usePackageJson选择，默认为true
    const usePackageJson = !_.isNil(opts.usePackageJson)
      ? opts.usePackageJson
      : true;

    // package.json中的配置
    const packageOpts = usePackageJson
      ? pkgConf.sync(self.cmd, { cwd: opts.cwd })
      : {};

    // ignore
    if (!opts.ignore) opts.ignore = [];
    addIgnore(packageOpts.ignore);
    if (!packageOpts.noDefaultIgnore) {
      addIgnore(DEFAULT_IGNORE)
    }

    // globals
    addGlobals(packageOpts.globals || packageOpts.global);
    addGlobals(opts.globals || opts.global);

    // plugins
    addPlugins(packageOpts.plugins || packageOpts.plugin);
    addPlugins(opts.plugins || opts.plugin);

    // envs
    addEnvs(packageOpts.envs || packageOpts.env);
    addEnvs(opts.envs || opts.env);

    // parser
    setParser(packageOpts.parser || opts.parser);

    // 添加忽略
    function addIgnore(ignore) {
      if (!ignore) return;
      opts.ignore = opts.ignore.concat(ignore);
    }

    // 添加global
    function addGlobals(globals) {
      if (!globals) return;
      opts.eslintConfig.globals = self.eslintConfig.globals.concat(globals)
    }

    // 添加插件
    function addPlugins(plugins) {
      if (!plugins) return;
      opts.eslintConfig.plugins = self.eslintConfig.plugins.concat(plugins)
    }

    // 添加Env
    function addEnvs(envs) {
      if (!envs) return;
      if (!_.isArray(envs) && !_.isString(envs)) {
        // envs can be an object in `package.json`
        envs = Object.keys(envs).filter(function (env) { return envs[env] })
      }
      opts.eslintConfig.envs = self.eslintConfig.envs.concat(envs)
    }

    function setParser(parser) {
      if (!parser) return;
      opts.eslintConfig.parser = parser
    }

    return opts;
  }
}

export default Linter;
