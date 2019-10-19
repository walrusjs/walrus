<p align="center">
  <a href="https://github.com/walrus-plus/walrus">
    <img width="100" src="https://avatars0.githubusercontent.com/u/55735928?s=200&v=4">
  </a>
</p>

<h1 align="center">walrus-plugin-prettier</h1>

> 封装[prettier](https://github.com/prettier/prettier)

[![Alita](https://img.shields.io/badge/alitajs-walrus-blue.svg)](https://github.com/walrus-plus/walrus)
[![NPM version](https://img.shields.io/npm/v/@walrus/walrus-plugin-prettier.svg?style=flat)](https://npmjs.org/package/@walrus/walrus-plugin-prettier)

## 🔨 使用

`package.json`添加如下代码

```
"scripts": {
  "prettier": "walrus prettier"
}

```

## 🐝 配置

```
// walrus.config.ts
import { IConfig } from '@walrus/types';

const config: IConfig = {
  pluginPrettier: {
    // 预提交模式。在此标志下，仅已暂存的文件将被格式化，并且在格式化后将被重新暂存
    staged: boolean;
    // 与staged一起使用可在格式化后跳过重新暂存文件。
    restage: boolean;
    // 过滤给定的minimatch模式的文件。
    pattern: string | string[];
    // 在处理之前输出每个文件的名称
    verbose: boolean;
    // 防止git commit时任何文件被固定
    bail: boolean;
    // 检查文件格式是否正确，但不要格式化
    check: boolean;
  }
};

export default config;
```

## 🐈 命令行参数

### `--staged`

预提交模式。在此标志下，仅已暂存的文件将被格式化，并且在格式化后将被重新暂存

```
walrus prettier --staged
```

### `--no-restage`

与staged一起使用可在格式化后跳过重新暂存文件

```
walrus prettier --staged --no-restage
```

### `--pattern`

过滤给定的[minimatch](https://github.com/isaacs/minimatch)模式的文件

```
walrus prettier --pattern "**/*.*(js|jsx)"

walrus prettier --pattern "**/*.js" --pattern "**/*.jsx"
```

### `--verbose`

在处理之前输出每个文件的名称

```
walrus prettier --verbose
```

### `--bail`

防止git commit时任何文件被固定

```
walrus prettier --bail
```

### `--check`

检查文件格式是否正确，但不要格式化

```
walrus prettier --check
```

## 🍃 内置配置详情

```
module.exports = {
  // 一行最多 100 字符
  printWidth: 100,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾不需要逗号
  trailingComma: 'none',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf'
};
```
