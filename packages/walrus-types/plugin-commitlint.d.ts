export interface PluginCommitLintOptions {
  // 执行的目录
  cwd?: string;
  env?: string;
  edit?: string | boolean;
  // 切换色彩输出
  color?: boolean;
  // 配置文件路径
  config?: string;
  extends?: string;
  from?: string;
  to?: string;
  quiet?: boolean;
  format?: string;
  verbose?: string;
  helpUrl?: string;
}
