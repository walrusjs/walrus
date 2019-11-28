<h1 align="center">@walrus/shared-utils</h1>

[![Alita](https://img.shields.io/badge/alitajs-walrus-blue.svg)](https://github.com/walrus-plus/walrus)
[![NPM version](https://img.shields.io/npm/v/@walrus/shared-utils.svg?style=flat)](https://npmjs.org/package/@walrus/shared-utils)
[![NPM downloads](http://img.shields.io/npm/dm/@walrus/shared-utils.svg?style=flat)](https://npmjs.org/package/@walrus/shared-utils)

> 项目集成了多种工具方法，可作为 cli 的依赖包

## 📦 Install

```
// npm
npm install @walrus/shared-utils

// yarn
yarn add @walrus/shared-utils
```

## 🔨 Usage

```
import { lodash } form '@walrus/shared-utils';

const result = true;

if (lodash.isBoolean(result)) {
  console.log('result is boolean type');
}
```

## 🎉 目录

- [📦 Install](#%f0%9f%93%a6-install)
- [🔨 Usage](#%f0%9f%94%a8-usage)
- [🎉 目录](#%f0%9f%8e%89-%e7%9b%ae%e5%bd%95)
- [✨ API](#%e2%9c%a8-api)
  - [lodash](#lodash)
  - [isLinux](#islinux)
  - [isMacintosh](#ismacintosh)
  - [isWindows](#iswindows)
  - [isUrl](#isurl)
  - [clearConsole](#clearconsole)
  - [compatDirname](#compatdirname)
  - [configLoader](#configloader)
  - [checkNodeVersion](#checknodeversion)
  - [chalk](#chalk)
  - [signale](#signale)
  - [semver](#semver)

## ✨ API

### lodash

```
import { lodash } form '@walrus/shared-utils';
```

文档请查看[lodash](https://lodash.com/)

### isLinux

- 使用:

```
import { isLinux } form '@walrus/shared-utils';
```

- 类型:

```
() => boolean;
```

- 描述: 是否是 Linux 系统

### isMacintosh

- 使用:

```
import { isLinux } form '@walrus/shared-utils';
```

- 类型:

```
() => boolean;
```

- 描述: 是否是 Mac 系统

### isWindows

- 使用:

```
import { isWindows } form '@walrus/shared-utils';
```

- 类型:

```
() => boolean;
```

- 描述: 是否是 Windows 系统

### isUrl

- 使用:

```
import { isUrl } form '@walrus/shared-utils';
```

- 类型:

```
(path: string) => boolean;
```

- 描述: path 是否是 Url

### clearConsole

- 使用:

```
import { clearConsole } form '@walrus/shared-utils';
```

- 类型:

```
() => void;
```

- 描述: 清空控制台

### compatDirname

- 使用:

```
import { compatDirname } form '@walrus/shared-utils';
```

- 类型:

```
(path: string, cwd: string, fallback) => void;
```

- 描述: 查找模块路径

### configLoader

> 封装`joycon`支持读取`.ts`后缀配置文件，具体 API 请查看[joycon](https://github.com/egoist/joycon)

- 使用:

```
import { compatDirname } form '@walrus/shared-utils';

const userConfig = configLoader.loadSync([
  'walrus.config.js',
  'walrus.config.ts'
], process.cwd());
```

- 类型:

- 描述: 读取配置文件

### checkNodeVersion

- 使用:

```
import { checkNodeVersion } form '@walrus/shared-utils';

// 获取node兼容版本
const requiredVersion = require('../package.json').engines.node;

checkNodeVersion(checkNodeVersion, '@walrus/cli')
```

- 类型:

```
(wanted: string, id: string) => void
```

- 描述: 检查 Node 版本

### chalk

> 导出`chalk`, 具体文档请查看[chalk](https://github.com/chalk/chalk)

- 使用:

```
import { chalk } form '@walrus/shared-utils';
```

### signale

可扩展的日志记录器

> 导出`signale`, 具体文档请查看[signale](https://github.com/klaussinani/signale/blob/master/docs/readme.zh_CN.md)

- 使用:

```
import { signale } form '@walrus/shared-utils';
```

### semver

> 导出`semver`, 具体文档请查看[semver](https://github.com/semver/semver)

- 使用:

```
import { semver } form '@walrus/shared-utils';
```
