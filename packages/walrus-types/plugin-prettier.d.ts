export interface ProcessFilesOptions {
  // 检查文件格式是否正确，但不要格式化。
  check?: boolean;
  config?: string;
  onExamineFile?: (relative) => void;
  onCheckFile?: (relative, isFormatted) => void;
  onWriteFile?: (relative) => void;
}

export interface PluginPrettierOptions extends ProcessFilesOptions {
  since?: string;
  // 是否开启暂存模式
  staged?: boolean;
  branch?: string;
  bail?: boolean;
  // 在处理之前输出每个文件的名称
  verbose?: boolean;
  // 是否重新暂存 与staged配合使用
  restage?: boolean;
  // 过滤给定模式的文件
  pattern?: string[];
  onPartiallyStagedFile?: (file) => void;
  onFoundSinceRevision?: (name: string, revision: string) => void;
  onFoundChangedFiles?: (changeFiles: string[]) => void;
}
